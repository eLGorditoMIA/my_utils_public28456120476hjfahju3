/**
 * Extract a JSON-like template from a ServiceNow CONCAT expression.
 * Supports:
 *  - CONCAT("{\"a\":\"", @state.a, "\",\"b\":\"", @state.b, "\"}")
 *  - Plain JSON already
 *
 * Returns a best-effort JSON template string where variables become tokens like:
 *  {{@state.a}}
 *
 * @param {string} input
 * @returns {{ template: string, notes: string[] }}
 */
export function extractJsonTemplate(input) {
  const notes = [];
  const trimmed = (input || "").trim();
  if (!trimmed) return { template: "", notes };

  // If it's already JSON (starts with { and ends with }) assume it's template JSON.
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    notes.push("Detected plain JSON input (not CONCAT).");
    return { template: trimmed, notes };
  }

  // Try to isolate inside CONCAT(...)
  let inner = trimmed;
  const m = trimmed.match(/^CONCAT\((.*)\)\s*$/s);
  if (m && m[1]) {
    inner = m[1];
    notes.push("Detected CONCAT(...) wrapper.");
  } else {
    notes.push("No CONCAT(...) wrapper detected. Attempting best-effort parse.");
  }

  // Tokenize by commas at top-level (not inside quotes)
  const tokens = [];
  let cur = "";
  let inQuote = false;
  let esc = false;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (esc) {
      cur += ch;
      esc = false;
      continue;
    }
    if (ch === "\\") {
      cur += ch;
      esc = true;
      continue;
    }
    if (ch === '"') {
      inQuote = !inQuote;
      cur += ch;
      continue;
    }
    if (ch === "," && !inQuote) {
      tokens.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) tokens.push(cur.trim());

  if (!tokens.length) {
    notes.push("Could not tokenize expression.");
    return { template: "", notes };
  }

  // Build template by concatenating string literals and inserting placeholders for non-literals
  let out = "";
  for (const t of tokens) {
    // String literal token like "{\"a\":\""
    const isString = t.startsWith('"') && t.endsWith('"');
    if (isString) {
      // Remove surrounding quotes
      let s = t.slice(1, -1);
      // Unescape typical sequences present in SN expressions
      // NOTE: This is best-effort and intentionally conservative
      s = s.replace(/\\"/g, '"');
      s = s.replace(/\\n/g, "\n");
      s = s.replace(/\\t/g, "\t");
      s = s.replace(/\\\\/g, "\\");
      out += s;
    } else if (t) {
      out += `{{${t}}}`;
    }
  }

  const final = out.trim();
  if (!(final.startsWith("{") && final.endsWith("}"))) {
    notes.push("Warning: Extracted template does not look like a full JSON object (missing { }?).");
  }
  return { template: final, notes };
}

/**
 * Try parsing JSON. If it fails due to {{tokens}}, replace them with safe strings and re-parse.
 * @param {string} jsonText
 * @returns {{ parsed: any, parseMode: string }}
 */
export function parseJsonTemplate(jsonText) {
  // First attempt: direct parse
  try {
    return { parsed: JSON.parse(jsonText), parseMode: "direct" };
  } catch (e1) {
    // Replace {{...}} tokens with placeholder strings
    const tokenReplaced = jsonText.replace(/\{\{[^}]+\}\}/g, '"__TEMPLATE_TOKEN__"');
    return { parsed: JSON.parse(tokenReplaced), parseMode: "token_replaced" };
  }
}
