# CONCAT / JSON Workbench

A static, no-build, no-dependency tool for working with ServiceNow `CONCAT("...")`
expressions. Paste in a CONCAT expression, plain JSON, or even a JS object literal
with bare identifiers (e.g. `{ id: "1", tags: [a, 1] }`), click **Render**, and it
will:

- Extract/normalize the input into valid JSON (preserving `@state.x` references as
  `{{@state.x}}` tokens).
- Show it as pretty-printed, filterable/highlightable JSON.
- Let you edit it via a key/value table (including nested objects/arrays, via a
  drill-down nested editor).
- Regenerate a valid `CONCAT("...")` expression from your edits, ready to paste back
  into ServiceNow.
- Keep a local history of renders (stored in `localStorage`), with configurable
  page size / retention limit.

## Running it

This app uses native ES modules (`<script type="module">`), which browsers block
from loading over `file://` due to CORS restrictions. You must serve it over
`http://`:

```bash
cd json_viewer
python -m http.server 8000
```

Then open **http://localhost:8000/index.html** in a browser. Double-clicking
`index.html` directly will not work.

## Project structure

```
index.html          Page markup / layout
styles.css           Styling
src/
  main.js            Wires up all the UI event handlers; app entry point
  state.js            In-memory app state (current object, history, settings)
  templateParser.js    Extracts/parses CONCAT or JSON input into a JSON template
  concatBuilder.js      Regenerates a CONCAT("...") expression from edited JSON
  derived.js            Pretty-print + filter/highlight of the rendered JSON
  table.js              Key/value table rendering, editing, nested drill-down
  historyStore.js       localStorage persistence for render history
  historyPanel.js        History UI (list, paging, load/copy/delete actions)
  pathUtils.js           Shared helpers for walking/editing nested object paths
  dom.js                 Shared DOM helpers (status messages, HTML escaping/highlighting)
  jsObjectParser.js       Identifier-preserving JS-object-literal parser
                          (used as a fallback by templateParser.js for bare-identifier
                          input; no longer has its own standalone UI)
```

## Notes / known limitations

- The bare-identifier fallback parser only supports simple identifiers (e.g. `foo`),
  not dotted paths (e.g. `v.accountId`).
- History and settings are stored per-browser in `localStorage`
  (`concat_json_viewer_history_v1` and related keys) — clearing site data resets them.

See [CHANGELOG.md](CHANGELOG.md) for a history of what's been added/changed.
