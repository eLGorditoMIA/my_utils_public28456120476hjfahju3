# Changelog

All notable changes to this project are documented here, newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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
