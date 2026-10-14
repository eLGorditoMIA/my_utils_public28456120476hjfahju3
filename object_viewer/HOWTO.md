# How to use each section

## Input

Paste one of these, then click **Render**:

- A ServiceNow CONCAT expression:
  ```
  CONCAT("{\"id\":\"123\",\"name\":\"", @state.name, "\",\"status\":\"", @state.status, "\"}")
  ```
- Plain JSON:
  ```
  {"id":"123","name":"Alice","status":"active"}
  ```
- A JS object literal with bare identifiers (unquoted keys/values are treated as
  plain strings):
  ```
  { id: "123", tags: [a, 1, "z"], meta: { nested: { deep: deepVal } } }
  ```
  A bare `@state.x`-style value (optionally dotted, e.g. `@state.member.id`) is
  treated specially: it's normalized into a `{{@state.x}}` token instead of a
  plain string, so you don't need to type the `{{...}}` wrapper yourself:
  ```
  { firstName: @state.test, lastName: plain }
  ```
  parses the same as `{ firstName: {{@state.test}}, lastName: plain }` — `plain`
  becomes the string `"plain"`, while `@state.test` becomes an unquoted script
  variable in Generated CONCAT. Every field still needs a value — `lastName: ,`
  with nothing between the colon and comma won't parse.
- A top-level JSON **array** of objects:
  ```
  [{"id":"1","name":"Alice"},{"id":"2","name":"Bob"}]
  ```
  works the same as an object — Pretty JSON/filter, the key/value table (rows
  are array indices), and Generated CONCAT all adapt automatically. In the
  table, `Add field` pushes a new item (the key box is ignored) and
  `Delete selected` removes items by index instead of by key.

`Copy extracted JSON template` copies the raw JSON template (with `{{@state.x}}`
tokens intact) extracted from your input, before any value substitution.

## Settings

Click **Settings** to adjust history `Page size` (how many history entries show
per page). `Editor settings` / `Output settings` are placeholders for future
options.

## History

Every successful render is saved here (deduped on identical templates). Use
**← Prev / Next →** to page through, `Max saved` to cap how many are retained,
**Clear history** to empty the list, or **Purge storage** to also wipe the
underlying `localStorage` keys. Click any entry's `Load` action to re-run it
through Render.

## Pretty JSON (with filter)

Shows the normalized JSON. Type into the filter box to narrow the view: non-matching
sibling keys at each level are pruned, but the parent path down to a match is kept
so you can still see where it came from, with the actual match highlighted. Example,
using the nested input below:
```
{"id":"123","meta":{"metrics":{"config":{"allow_retry":true,"env":"prod"}}}}
```
Filtering for `allow_retry` shows:
```
{
  "meta": {
    "metrics": {
      "config": {
        "allow_retry": true
      }
    }
  }
}
```
with `allow_retry` highlighted. Clear the filter to see the full object again.

## Generated CONCAT

Regenerates a valid `CONCAT("...")` expression from whatever is currently in the
Pretty JSON / key-value table, ready to paste back into ServiceNow. `{{...}}`
tokens become quoted string arguments (e.g. `@state.name`); `{{{...}}}` tokens
become unquoted raw arguments (use this for booleans/numbers you want passed
through without quotes, e.g. `{{{@state.flag_a}}}`).

## Key / Value table

Lists the top-level fields of the rendered object. Edit a key or value directly
in the table; `Add field` appends a new row; check the `sel` boxes and
`Delete selected` to remove rows. Values are coerced automatically — typing
`true`/`false` becomes a boolean, a bare number becomes a number, valid JSON
(e.g. `{"a":1}` or `[1,2]`) becomes a nested object/array, anything else stays
a string. Uncheck `Enable editing` to view the table read-only.

## How to use / What's new panels

Both panels have a **Search** box in their header. Type into it to narrow the
panel down to just the matching lines (highlighted), the same way the Pretty
JSON filter works. Clear the box to see the full document again.

## Nested editor

Click an object/array value in the table to drill into it — the nested editor
opens showing that sub-object's own key/value rows, with the same add/edit/
delete behavior, and its own further drill-down for anything nested inside it.
`Apply to parent` writes your changes back up to the parent object; `Back` steps
up one level without discarding; `Close` exits the nested editor entirely.
