import { parseJsObjectLiteral, sanitizeJsObjectText } from "./jsObjectParser.js";
import { wrapBareTokens } from "./concatBuilder.js";

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
  const rawTrimmed = (input || "").trim();
  if (!rawTrimmed) return { template: "", notes };

  // Strip comments/trailing semicolon/trailing commas up front so a pasted
  // JS object literal (as opposed to strict JSON) doesn't throw off the
  // {}/[] detection or the CONCAT(...) isolation below.
  const sanitized = sanitizeJsObjectText(rawTrimmed);
  const trimmed = sanitized.text;
  notes.push(...sanitized.notes);

  // If it's already JSON (starts with {/[ and ends with the matching }/]) assume it's template JSON.
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
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
      let s;
      try {
        // Proper JSON-string unescaping handles every valid escape (and
        // compound ones like `\\n` — an escaped backslash followed by a
        // literal "n", e.g. from a value that itself already contained a
        // JSON-escaped newline) correctly in one pass, unlike sequential
        // regex replacement which can't tell `\\n` apart from `\n`.
        s = JSON.parse(t);
      } catch (e) {
        // Fallback for fragments that aren't valid standalone JSON strings
        // on their own (rare, non-standard CONCAT escaping).
        s = t.slice(1, -1);
        s = s.replace(/\\"/g, '"');
        s = s.replace(/\\n/g, "\n");
        s = s.replace(/\\t/g, "\t");
        s = s.replace(/\\\\/g, "\\");
      }
      out += s;
    } else if (t) {
      out += `{{${t}}}`;
    }
  }

  const final = out.trim();
  const looksLikeObject = final.startsWith("{") && final.endsWith("}");
  const looksLikeArray = final.startsWith("[") && final.endsWith("]");
  if (!looksLikeObject && !looksLikeArray) {
    notes.push("Warning: Extracted template does not look like a full JSON object/array (missing {}/[]?).");
  }
  return { template: final, notes };
}

function stripIdentTokens(x) {
  if (Array.isArray(x)) return x.map(stripIdentTokens);
  if (x !== null && typeof x === "object") {
    const out = {};
    Object.keys(x).forEach((k) => (out[k] = stripIdentTokens(x[k])));
    return out;
  }
  if (typeof x === "string" && x.startsWith("__IDENT__:")) return x.replace("__IDENT__:", "");
  return x;
}

/**
 * Try parsing JSON. If it fails due to {{tokens}}, replace them with safe strings and re-parse.
 * If it still fails because the input is a JS-object-literal (bare keys/identifiers, e.g.
 * `{ id: "123", tags: [a, 1, "z"] }`), fall back to the JS Object mode's identifier-quoting
 * parser and treat any bare identifier as a literal string value.
 * @param {string} jsonText
 * @returns {{ parsed: any, parseMode: string }}
 */
export function parseJsonTemplate(jsonText) {
  // First attempt: direct parse
  try {
    return { parsed: wrapBareTokens(JSON.parse(jsonText)), parseMode: "direct" };
  } catch (e1) {
    // Replace {{...}} tokens with placeholder strings
    const tokenReplaced = jsonText.replace(/\{\{[^}]+\}\}/g, '"__TEMPLATE_TOKEN__"');
    try {
      return { parsed: wrapBareTokens(JSON.parse(tokenReplaced)), parseMode: "token_replaced" };
    } catch (e2) {
      try {
        const { obj } = parseJsObjectLiteral(tokenReplaced);
        return { parsed: wrapBareTokens(stripIdentTokens(obj)), parseMode: "js_literal_coerced" };
      } catch (e3) {
        throw e1;
      }
    }
  }
}
