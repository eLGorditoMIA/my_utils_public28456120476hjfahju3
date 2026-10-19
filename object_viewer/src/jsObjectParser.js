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
  let s = (src || "").trim();
  if (!s) return { obj: null, notes: ["Empty input."] };

  const sanitized = sanitizeJsObjectText(s);
  s = sanitized.text;
  const notes = sanitized.notes;

  // Must start with { and end with }
  if (!(s.startsWith("{") && s.endsWith("}"))) {
    throw new Error("Input must be an object literal starting with { and ending with }.");
  }

  // Quote bare keys: a: -> "a":
  // This is best-effort and assumes keys are simple identifiers.
  s = s.replace(/([,{]\s*)([A-Za-z_$][\w$]*)(\s*):/g, '$1"$2"$3:');

  // Treat an empty value (nothing between ':' and the next ',' or '}') as an
  // empty string, so a template like `{ firstName: @state.test, lastName: }`
  // can be used to seed blank fields for later editing instead of failing to
  // parse.
  s = s.replace(/:(\s*)(?=[,}])/g, ': ""');

  // Replace RHS identifiers that are not true/false/null and not numbers with string tokens.
  // We only do this in value positions after ':' or after '[' or after ',' within arrays.
  // A bare "@state.x"-style identifier (ServiceNow token syntax, optionally dotted) is
  // normalized straight into a "{{@state.x}}" token, same as if the user had typed the
  // double-brace form directly. Best-effort: this won't handle every JS expression.
  s = s.replace(/(:\s*|\[\s*|,\s*)(@?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)(\s*)(?=[,}\]])/g, function (m, p1, ident, p3) {
    if (ident === "true" || ident === "false" || ident === "null") return m;
    if (ident.startsWith("@")) return p1 + JSON.stringify("{{" + ident + "}}") + p3;
    return p1 + '"__IDENT__:' + ident + '"' + p3;
  });

  // Now it should be valid JSON
  const obj = JSON.parse(s);
  return { obj, notes };
}

/**
 * Strip artifacts commonly left over from copy-pasting a JS object literal
 * instead of strict JSON: `//` and `/* *\/` comments (outside of string
 * literals), surrounding code outside the outermost {...}/[...] (e.g. an
 * `object=` assignment prefix or a trailing `gs.info(...)` call), a
 * trailing semicolon, and trailing commas before a closing `}` or `]`.
 * @param {string} src
 * @returns {{ text: string, notes: string[] }}
 */
export function sanitizeJsObjectText(src) {
  const notes = [];
  let s = src;

  let out = "";
  let inQuote = null; // '"' or "'" while scanning inside a string literal
  let esc = false;
  let strippedComment = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const next = s[i + 1];

    if (inQuote) {
      out += ch;
      if (esc) {
        esc = false;
      } else if (ch === "\\") {
        esc = true;
      } else if (ch === inQuote) {
        inQuote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inQuote = ch;
      out += ch;
      continue;
    }

    if (ch === "/" && next === "/") {
      strippedComment = true;
      while (i < s.length && s[i] !== "\n") i++;
      out += "\n";
      continue;
    }

    if (ch === "/" && next === "*") {
      strippedComment = true;
      i += 2;
      while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) i++;
      i++; // land on the closing '/'
      continue;
    }

    out += ch;
  }
  s = out;
  if (strippedComment) notes.push("Removed inline comment(s).");

  // Discard any surrounding code — e.g. `object=` before, or a trailing
  // `gs.info(...)`/`;` after — and keep only the outermost {...}/[...]
  // literal, so a copy-paste that includes an assignment or a log statement
  // still renders just the object/array.
  const span = findOutermostBracketSpan(s);
  if (span) {
    const before = s.slice(0, span.start).trim();
    const after = s.slice(span.end + 1).trim();
    if (before || after) notes.push("Stripped surrounding code outside the object/array literal.");
    s = s.slice(span.start, span.end + 1);
  }

  // Remove a single trailing semicolon (pasted from code).
  const beforeSemi = s;
  s = s.replace(/;\s*$/, "");
  if (s !== beforeSemi) notes.push("Removed trailing semicolon.");

  // Remove trailing commas before a closing } or ].
  const beforeComma = s;
  s = s.replace(/,(\s*[}\]])/g, "$1");
  if (s !== beforeComma) notes.push("Removed trailing comma(s).");

  return { text: s.trim(), notes };
}

/**
 * Find the span of the first top-level (not inside a string literal) {...}
 * or [...] in `s`, tracking nesting depth so inner braces/brackets don't end
 * the match early. Returns null if there's no top-level `{`/`[` at all, or
 * if it's never balanced (e.g. a lone `{` with no matching `}`).
 * @param {string} s
 * @returns {{ start: number, end: number } | null}
 */
function findOutermostBracketSpan(s) {
  let start = -1;
  let openCh = null;
  let closeCh = null;
  let depth = 0;
  let inQuote = null;
  let esc = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQuote) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === inQuote) inQuote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQuote = ch;
      continue;
    }
    if (start === -1) {
      if (ch === "{" || ch === "[") {
        start = i;
        openCh = ch;
        closeCh = ch === "{" ? "}" : "]";
        depth = 1;
      }
      continue;
    }
    if (ch === openCh) depth++;
    else if (ch === closeCh) {
      depth--;
      if (depth === 0) return { start, end: i };
    }
  }
  return null;
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
