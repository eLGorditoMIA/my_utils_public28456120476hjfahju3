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

const BARE_TOKEN_RE = /^@[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/;

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

  // A bare @state.x-style value (optionally dotted) is a script variable
  // token, same as if typed with the {{...}} wrapper.
  if (BARE_TOKEN_RE.test(t)) return "{{" + t + "}}";

  // If user typed valid JSON (object/array/null/string/number), accept it.
  // Example: {"a":1} or [1,2] or null or "text"
  try {
    return JSON.parse(t);
  } catch (e) {
    // Not valid JSON, treat as string
    return s;
  }
}

/**
 * Strips a token's {{...}}/{{{...}}} wrapper down to the bare expression
 * inside, for display purposes only (Pretty JSON, Key/Value table). The
 * underlying stored value keeps its braces — this never touches state.
 */
export function stripTokenBraces(v) {
  if (typeof v !== "string") return v;
  const t = v.trim();
  let m = /^\{\{\{([^}]+)\}\}\}$/.exec(t);
  if (m) return m[1].trim();
  m = /^\{\{([^}]+)\}\}$/.exec(t);
  if (m) return m[1].trim();
  return v;
}

/**
 * Deep-maps an object/array, stripping token braces off every leaf string
 * value, for display only.
 */
export function toDisplayObject(obj) {
  if (Array.isArray(obj)) return obj.map(toDisplayObject);
  if (obj !== null && typeof obj === "object") {
    const out = {};
    Object.keys(obj).forEach((k) => (out[k] = toDisplayObject(obj[k])));
    return out;
  }
  return stripTokenBraces(obj);
}

/**
 * Deep-maps an object/array, wrapping any bare (or quoted-but-unwrapped)
 * @state.x-style string value into its {{...}} token form. Lets input like
 * plain JSON `{"firstName":"@state.test"}` (no braces) or a round-tripped
 * copy of the brace-free Pretty JSON display still be recognized as a token.
 */
export function wrapBareTokens(x) {
  if (Array.isArray(x)) return x.map(wrapBareTokens);
  if (x !== null && typeof x === "object") {
    const out = {};
    Object.keys(x).forEach((k) => (out[k] = wrapBareTokens(x[k])));
    return out;
  }
  if (typeof x === "string" && BARE_TOKEN_RE.test(x.trim())) return "{{" + x.trim() + "}}";
  return x;
}

/**
 * Pretty-prints an object/array with NO quotes anywhere — keys and string
 * values are written bare, exactly as you'd type them. Intended for the
 * already-stripped display object (see toDisplayObject), not the raw
 * token-wrapped state.
 */
export function stringifyPrettyObject(obj, indent) {
  const sp = typeof indent === "number" ? " ".repeat(indent) : "  ";

  function renderLeaf(v) {
    if (v === null || v === undefined) return "null";
    return String(v);
  }

  function render(val, level) {
    const pad = sp.repeat(level);
    const padIn = sp.repeat(level + 1);

    if (Array.isArray(val)) {
      if (!val.length) return "[]";
      return "[\n" + val.map((v) => padIn + (v !== null && typeof v === "object" ? render(v, level + 1) : renderLeaf(v))).join(",\n") + "\n" + pad + "]";
    }

    if (val !== null && typeof val === "object") {
      const keys = Object.keys(val);
      if (!keys.length) return "{}";
      return (
        "{\n" +
        keys
          .map((k) => padIn + String(k) + ": " + (val[k] !== null && typeof val[k] === "object" ? render(val[k], level + 1) : renderLeaf(val[k])))
          .join(",\n") +
        "\n" +
        pad +
        "}"
      );
    }

    return renderLeaf(val);
  }

  return render(obj, 0);
}

export function objectToTemplate(obj) {
  const isArr = Array.isArray(obj);
  const o = obj || (isArr ? [] : {});
  // Arrays keep their index order; objects keep insertion order, which the
  // Key/Value table's Up/Down reorder buttons let you control directly.
  const keys = isArr ? o.map((_, i) => i) : Object.keys(o);

  const out = isArr ? [] : {};
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

  const outKeys = isArr ? out.map((_, i) => i) : Object.keys(out);
  for (const k of outKeys) {
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
