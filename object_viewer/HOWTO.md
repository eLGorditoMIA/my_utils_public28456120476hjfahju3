# How to use each section

## Create a new object

The **+ {}** / **+ []** buttons in the header (next to the title) start a blank
object/array instead of pasting CONCAT/JSON into Input. This clears the Input
box and resets the Key/Value table to empty — use `Add field` (or the nested
editor's `Add field`, once you've added a nested object/array) to build it up
field by field. Handy for building a brand-new payload from scratch rather than
editing an existing one.

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
  treated specially: it's recognized as a script variable token instead of a
  plain string, so you don't need to type the `{{...}}` wrapper yourself — and
  Pretty JSON / the Key/Value table show it back to you exactly as typed, bare,
  with no `{{...}}` wrapper:
  ```
  { firstName: @state.test, lastName: plain }
  ```
  parses the same as `{ firstName: {{@state.test}}, lastName: plain }` — `plain`
  becomes the string `"plain"`, while `@state.test` becomes an unquoted script
  variable in Generated CONCAT. This works no matter how the token gets in —
  typed bare, typed with `{{...}}`, pasted as quoted plain JSON
  (`{"firstName":"@state.test"}`), or edited directly in the Key/Value table.
  The `{{...}}`/`{{{...}}}` wrapper is still stored under the hood (that's how
  Generated CONCAT and `Copy edited JSON` know it's a token, not a literal
  string) — it's just hidden from the Pretty JSON / table display for
  readability. A field left empty (nothing between `:` and the
  next `,`/`}`) becomes an empty string instead of failing to parse:
  ```
  { firstName: @state.test, lastName: , dateOfBirth: , memberId: , apiIdentifier: }
  ```
  is handy for loading a mostly-blank template into the editor so you can fill
  in the remaining fields by hand afterward.
- A top-level JSON **array** of objects:
  ```
  [{"id":"1","name":"Alice"},{"id":"2","name":"Bob"}]
  ```
  works the same as an object — Pretty JSON/filter, the key/value table (rows
  are array indices), and Generated CONCAT all adapt automatically. In the
  table, `Add field` pushes a new item (the key box is ignored) and
  `Delete selected` removes items by index instead of by key.
- A **double-JSON-encoded** string — a quoted, backslash-escaped JSON document,
  as you'd get copying a field value that was already `JSON.stringify`'d once
  (e.g. `"[{\"id\":\"1\",\"note\":\"line1\\nline2\"}]"`, outer quotes and all):
  pasting the whole thing, outer quotes included, unwraps one level of
  encoding and renders the inner array/object normally.

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

This pruning also drills into arrays of objects, not just nested objects —
non-matching items inside a nested array get pruned the same way non-matching
sibling keys do. Example:
```
[{"name":"Alice","policies":[{"policy_number":"P1"},{"policy_number":"P2"}]},
 {"name":"Bob","policies":[{"policy_number":"P3"}]}]
```
Filtering for `p3` shows only the record and array item that matched:
```
[
  {
    "policies": [
      {
        "policy_number": "P3"
      }
    ]
  }
]
```

## Pretty Object (no quotes)

A second view of the same data as Pretty JSON, but with **zero quote
characters anywhere** — keys, string values, and tokens are all shown bare,
the way you'd type a plain JS object literal (e.g. `{ firstName: @state.test,
lastName: plain }` instead of `{"firstName":"@state.test","lastName":"plain"}`).
Collapsed by default — click `Show` to expand it, `Copy pretty object` to copy
its text. Uses the same filter box as Pretty JSON, so narrowing/highlighting
behaves identically between the two panels. This is a display-only view: the
underlying value, Generated CONCAT, and `Copy edited JSON` are unaffected.

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
