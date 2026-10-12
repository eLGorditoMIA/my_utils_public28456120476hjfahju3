export function generateConcatFromTemplate(template) {
  const t = (template || "").trim();
  if (!t) return "";

  // Split into parts:
  //  - literal text
  //  - string token placeholders: {{ token }}  -> inserted as raw expression BUT template should include quotes around it
  //  - raw token placeholders:    {{{ token }}} -> inserted raw and template should NOT include quotes
  const re = /\{\{\{([^}]+)\}\}\}|\{\{([^}]+)\}\}/g;
  let last = 0;
  let m;
  const parts = [];

  while ((m = re.exec(t)) !== null) {
    const literal = t.substring(last, m.index);
    if (literal) parts.push({ type: "lit", value: literal });

    // m[1] -> raw token inside {{{ }}} ; m[2] -> string token inside {{ }}
    const rawToken = (m[1] || "").trim();
    const strToken = (m[2] || "").trim();
    if (rawToken) parts.push({ type: "expr", value: rawToken });
    else if (strToken) parts.push({ type: "expr", value: strToken });

    last = re.lastIndex;
  }
  const tail = t.substring(last);
  if (tail) parts.push({ type: "lit", value: tail });

  // Build CONCAT("...") where literals are quoted strings with escapes and expr are raw
  const out = [];
  for (const p of parts) {
    if (p.type === "lit") {
      let s = p.value;
      // Escape for being inside a double-quoted ServiceNow string
      s = s.replace(/\\/g, "\\\\");
      s = s.replace(/"/g, '\\"');
      s = s.replace(/\n/g, "\\n");
      s = s.replace(/\r/g, "\\r");
      s = s.replace(/\t/g, "\\t");
      out.push('"' + s + '"');
    } else if (p.type === "expr") {
      out.push(p.value);
    }
  }

  return "CONCAT(" + out.join(", ") + ")";
}

export function coerceValue(raw) {
  const s = raw == null ? "" : String(raw);
  const t = s.trim();
  if (t === "") return "";
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);

  // Preserve tokens the user types as literal strings (template tokens)
  //  - {{...}}   = string token
  //  - {{{...}}} = raw token
  if (/^\{\{[^}]+\}\}$/.test(t)) return t;
  if (/^\{\{\{[^}]+\}\}\}$/.test(t)) return t;

  // If user typed valid JSON (object/array/null/string/number), accept it.
  // Example: {"a":1} or [1,2] or null or "text"
  try {
    return JSON.parse(t);
  } catch (e) {
    // Not valid JSON, treat as string
    return s;
  }
}

export function objectToTemplate(obj) {
  const o = obj || {};
  const keys = Object.keys(o);
  keys.sort((a, b) => a.localeCompare(b));

  const out = {};
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && /^\{\{[^}]+\}\}$/.test(v.trim())) {
      // Mark as token placeholder (no quotes in CONCAT output)
      out[k] = v.trim();
    } else {
      // For everything else, represent as a JSON value, but stringify as text for template.
      // We keep it as real JSON value in edited JSON; template needs strings for non-token values.
      if (typeof v === "string") out[k] = v;
      else out[k] = v;
    }
  }

  // Build template JSON text.
  // Rule:
  //  - {{...}} tokens are STRING tokens and must remain QUOTED in JSON ("{{...}}")
  //  - {{{...}}} tokens are RAW tokens and must be UNQUOTED in JSON ({{{...}}})
  //
  // We do this safely by temporarily replacing RAW tokens with markers, JSON.stringify,
  // then replacing the quoted markers with the raw token text.

  const marker = "__RAW_TOKEN_MARKER__";
  const rawTokenMap = {};

  for (const k of Object.keys(out)) {
    const v = out[k];
    if (typeof v === "string" && /^\{\{\{[^}]+\}\}\}$/.test(v)) {
      rawTokenMap[k] = v;
      out[k] = marker + k + marker;
    }
  }

  let json = JSON.stringify(out, null, 0);

  // Replace "__RAW_TOKEN_MARKER__key__RAW_TOKEN_MARKER__" with {{{token}}}
  for (const k of Object.keys(rawTokenMap)) {
    const needle = '"' + marker + k + marker + '"';
    json = json.replaceAll(needle, rawTokenMap[k]);
  }

  return json;
}
