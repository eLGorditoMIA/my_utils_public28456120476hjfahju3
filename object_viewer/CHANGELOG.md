# Changelog

All notable changes to this project are documented here, newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## 2026-10-15 (2)

### Fixed
- Pasting a **double-JSON-encoded** value — a quoted, backslash-escaped JSON
  string whose content is itself a JSON document (e.g. copying a field value
  that was already `JSON.stringify`'d once) — failed with "Bad escaped
  character in JSON" for any value that itself contained an escaped
  character (e.g. a field with an embedded `\n`). Cause: `extractJsonTemplate`
  (`templateParser.js`) unescaped quoted string tokens with a fixed-order
  chain of regex replacements, which can't distinguish a literal `\\n`
  (escaped backslash + a literal "n", produced when a string already
  containing `\n` gets JSON-encoded a second time) from a literal `\n`
  (escaped newline) — it would convert the trailing `\n` of `\\n` into a real
  newline control character, corrupting the JSON. Now each quoted token is
  unescaped with `JSON.parse` (which handles every valid JSON escape,
  including compound ones, correctly in a single pass), falling back to the
  old regex chain only if that token isn't valid standalone JSON.

## 2026-10-15

### Fixed
- Pretty JSON filter (`deepFilterObject` in `pathUtils.js`) didn't recurse into
  arrays of objects/arrays — only plain objects. A nested array field (e.g. an
  array-of-records inside each element of a top-level array of records) was
  treated as an opaque leaf: if the filter matched anywhere inside it, the
  *entire* array was kept wholesale instead of being pruned down to just the
  matching item(s), unlike sibling plain-object fields. Now arrays are
  recursed into the same way objects are, so non-matching items inside nested
  arrays are pruned too. Affects both the Pretty JSON and Pretty Object filter
  views, since both share this function.

## 2026-10-13 (6)

### Added
- A new "Pretty Object (no quotes)" panel, below Pretty JSON. Shows the same
  data with zero quote characters anywhere — not around keys, not around
  string values, not around tokens — exactly as you'd type it as a bare JS
  object literal. Distinct from Pretty JSON, which still shows standard JSON
  syntax with quotes. Collapsed by default; `Show`/`Hide` toggles it, `Copy
  pretty object` copies its text. Respects the same filter box as Pretty JSON
  (narrows to matching branches, with the match highlighted).

## 2026-10-13 (5)

### Changed
- `@state.x`-style tokens now display without their `{{...}}` wrapper in
  Pretty JSON and the Key/Value table (e.g. `@state.test` instead of
  `{{@state.test}}`) — shows the data the way you typed it. The underlying
  value, Generated CONCAT, and `Copy edited JSON` are unaffected: internally
  it's still stored and treated as a script variable token.
- Plain JSON with a quoted `@state.x` value (no braces at all, e.g. pasting
  back a copy of the Pretty JSON display) is now also recognized as a token,
  not a literal string — closes the round-trip gap this would've otherwise
  created.
- Editing a value in the Key/Value table to a bare `@state.x` now always
  normalizes it into a token, consistent regardless of entry point (Add
  field, table edit, nested editor).

## 2026-10-13 (4)

### Changed
- Moved "Create a new object" from its own card into two small `+ {}` / `+ []`
  icon buttons in the header, next to the title. Keeps the original two-column
  Input / Readable-output layout intact instead of pushing it into a 3-item
  grid.

## 2026-10-13 (3)

### Added
- A "Create a new object" feature, with `New object {}` and `New array []`
  buttons. Lets you build an object/array from scratch using the existing
  Add field / Key-Value table / nested editor, without needing to paste any
  CONCAT/JSON text first.

## 2026-10-13 (2)

### Added
- Empty values in the bare-identifier fallback parser: `{ firstName: @state.test, lastName: , id: }`
  now parses instead of failing, with empty fields (nothing between `:` and the
  next `,`/`}`) becoming `""`. Useful for seeding a mostly-blank template object
  into the editor and filling in the rest of the fields afterward.

## 2026-10-13

### Added
- Bare `@state.x`-style tokens (ServiceNow state variables, optionally
  dotted) now work without the `{{...}}` wrapper in CONCAT/JSON mode's
  bare-identifier fallback. For example `{firstName: @state.test}` now
  parses the same as `{firstName: {{@state.test}}}`, and Generated CONCAT
  emits `@state.test` as an unquoted script variable. Plain (non-`@`)
  bare identifiers are unaffected — they still normalize to plain string
  values.

## 2026-10-12 (4)

### Added
- Search boxes in the "How to use" and "What's new" panels: typing filters
  the doc down to matching lines (highlighted), matching the existing
  Pretty JSON filter behavior. Clearing the search restores the full text.

## 2026-10-12 (3)

### Added
- A version badge (`v1`) in the header, top-right.
- A `Show`/`Hide` toggle next to `Copy CONCAT` that collapses/expands the
  Generated CONCAT panel; it defaults to collapsed on page load.

### Fixed
- Version badge overlapped the header's description text. It now sits in a
  flex row next to the title instead of being absolutely positioned.

## 2026-10-12 (2)

### Added
- Top-level JSON array support: pasting `[{...}, {...}]` (instead of a single
  object) now works end-to-end — parsing, Pretty JSON + filter/highlight
  (array wrapper preserved when pruning), the key/value table (rows are array
  indices; `Add field` pushes, `Delete selected` splices), nested drill-down,
  and Generated CONCAT (preserves array order instead of reordering keys).

### Changed
- Renamed project folder from `json_viewer` to `object_viewer`.

## 2026-10-12

### Added
- Bare-identifier fallback parsing in CONCAT/JSON mode: input like
  `{ id: "123", tags: [a, 1, "z"] }` (unquoted keys/identifiers, JS object literal
  syntax) now parses successfully, with identifiers normalized to plain JSON string
  values. Previously this only worked in the (now-removed) JS Object mode.
- Filter match highlighting: the rendered JSON is pruned to just the matching
  branch(es) (parent path preserved, non-matching siblings removed), with the
  actual matching key/value substring highlighted via `<mark>`.
- README.md and this changelog.

### Changed
- Regenerated CONCAT output now derives from the normalized/parsed object (not the
  raw input text) when the input was bare-identifier JS-literal syntax, so the
  generated CONCAT is always valid JSON underneath.
- Renamed the app from "CONCAT JSON Viewer" to "CONCAT / JSON Workbench" and
  updated the header description to reflect the three supported input shapes
  (CONCAT expression, plain JSON, JS object literal).
- Generalized the seeded example input from ServiceNow-domain-specific field names
  to generic ones (`id`, `name`, `status`, `code`, `count`, `flag_a`, `flag_b`).

### Fixed
- `loadHistoryLimit()` / `loadHistoryPageSize()` returned `0` instead of the
  intended default on a clean browser (`Number(null)` is `0`, not `NaN`, so the
  `isNaN()` guard never caught it). Fixed in `historyStore.js`.

### Removed
- The standalone "JS Object" mode/tab (its own input, history, table, and nested
  editor) — its parsing capability (handling bare identifiers) was folded into
  CONCAT/JSON mode's fallback parser instead, so a separate mode/UI was no longer
  needed. `jsObjectParser.js` is kept as a dependency of that fallback.

## Baseline (prior to the above)

- Modular ES-module app structure (`state.js`, `templateParser.js`,
  `concatBuilder.js`, `table.js`, `historyStore.js`, `historyPanel.js`, `derived.js`,
  `dom.js`, `pathUtils.js`, `main.js`) replacing an earlier monolithic HTML file.
- Core CONCAT/JSON Template feature: paste a ServiceNow `CONCAT("...")` expression
  (or plain JSON), extract/parse it into JSON (preserving `@state.x` tokens),
  render as pretty JSON + an editable key/value table (with nested drill-down),
  and regenerate a CONCAT expression from edits.
- Render history with configurable page size / retention limit, persisted in
  `localStorage`.
- A standalone "JS Object" mode/tab was added for a time (parsing raw JS object
  literals with bare identifiers) before being folded into CONCAT/JSON mode and
  removed — see 2026-10-12 above.
