/**
 * Parse a JS object literal WITHOUT evaluating identifiers.
 * Strategy:
 *  - Replace identifiers on RHS with string tokens __IDENT__:name
 *  - Quote bare keys
 *  - JSON.parse
 *
 * Supports:
 *  { a: b, "c": d, nested: { x: y }, arr: [a, 1, "z"] }
 *
 * @param {string} src
 * @returns {{ obj: any, notes: string[] }}
 */
export function parseJsObjectLiteral(src) {
  const notes = [];
  let s = (src || "").trim();
  if (!s) return { obj: null, notes: ["Empty input."] };

  // Remove trailing semicolon if pasted from code
  s = s.replace(/;\s*$/, "");

  // Must start with { and end with }
  if (!(s.startsWith("{") && s.endsWith("}"))) {
    throw new Error("Input must be an object literal starting with { and ending with }.");
  }

  // Quote bare keys: a: -> "a":
  // This is best-effort and assumes keys are simple identifiers.
  s = s.replace(/([,{]\s*)([A-Za-z_$][\w$]*)(\s*):/g, '$1"$2"$3:');

  // Replace RHS identifiers that are not true/false/null and not numbers with string tokens.
  // We only do this in value positions after ':' or after '[' or after ',' within arrays.
  // Best-effort: this won't handle every JS expression.
  s = s.replace(/(:\s*|\[\s*|,\s*)([A-Za-z_$][\w$]*)(\s*)(?=[,}\]])/g, function (m, p1, ident, p3) {
    if (ident === "true" || ident === "false" || ident === "null") return m;
    return p1 + '"__IDENT__:' + ident + '"' + p3;
  });

  // Now it should be valid JSON
  const obj = JSON.parse(s);
  return { obj, notes };
}

export function isObject(x) {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

export function coerceValue(raw) {
  const s = raw == null ? "" : String(raw);
  const t = s.trim();
  if (t === "") return "";
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);

  // Preserve identifier tokens
  if (/^__IDENT__:[A-Za-z_$][\w$]*$/.test(t)) return t;

  // JSON value?
  try {
    return JSON.parse(t);
  } catch (e) {
    return s;
  }
}

export function normalizeForDisplay(obj) {
  // Convert identifier tokens into bare identifiers (for JS output)
  function walk(x) {
    if (Array.isArray(x)) return x.map(walk);
    if (isObject(x)) {
      const out = {};
      Object.keys(x).forEach((k) => (out[k] = walk(x[k])));
      return out;
    }
    if (typeof x === "string" && x.startsWith("__IDENT__:")) return x.replace("__IDENT__:", "");
    return x;
  }
  return walk(obj);
}

export function stringifyJsObject(obj, indent) {
  // Render as JS object literal with quoted keys, and identifier values unquoted.
  const sp = typeof indent === "number" ? " ".repeat(indent) : "  ";

  function render(val, level) {
    const pad = sp.repeat(level);
    const padIn = sp.repeat(level + 1);

    if (Array.isArray(val)) {
      if (!val.length) return "[]";
      return "[\n" + val.map((v) => padIn + render(v, level + 1)).join(",\n") + "\n" + pad + "]";
    }

    if (isObject(val)) {
      const keys = Object.keys(val);
      if (!keys.length) return "{}";
      return (
        "{\n" +
        keys
          .map((k) => {
            return padIn + JSON.stringify(k) + ": " + render(val[k], level + 1);
          })
          .join(",\n") +
        "\n" +
        pad +
        "}"
      );
    }

    if (typeof val === "string" && /^__IDENT__:[A-Za-z_$][\w$]*$/.test(val)) {
      return val.replace("__IDENT__:", "");
    }

    return JSON.stringify(val);
  }

  return render(obj, 0);
}

export function buildTemplateFields(obj) {
  // caret-delimited key=value pairs; identifier tokens are rendered as-is (no quotes)
  const keys = Object.keys(obj || {});
  keys.sort((a, b) => a.localeCompare(b));

  return keys
    .map((k) => {
      const v = obj[k];
      if (typeof v === "string" && /^__IDENT__:[A-Za-z_$][\w$]*$/.test(v)) {
        return k + "=" + v.replace("__IDENT__:", "");
      }
      if (typeof v === "object" && v !== null) {
        return k + "=" + JSON.stringify(v);
      }
      return k + "=" + String(v);
    })
    .join("^");
}
