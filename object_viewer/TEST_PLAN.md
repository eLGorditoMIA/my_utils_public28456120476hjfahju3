# Test Plan

Manual regression test plan for `object_viewer`. Each case is independent —
reload `index.html` (or click **Clear**) before running one, unless the case
says it builds on a previous one. Steps are imperative and reproducible; run
them against a fresh checkout before tagging a release, and whenever you
touch the file(s) listed under "Touches".

Serve the app locally before testing:
```
cd object_viewer
python -m http.server 8000
```
then open `http://localhost:8000/index.html`.

---

## 1. Input parsing

### 1.1 CONCAT expression
Touches: `templateParser.js`, `concatBuilder.js`

1. Paste into Input:
   ```
   CONCAT("{\"id\":\"123\",\"name\":\"", @state.name, "\",\"status\":\"", @state.status, "\"}")
   ```
2. Click **Render**.
3. Verify Status bar shows "Rendered successfully." with no error.
4. Verify Pretty JSON shows `"id": "123"`, `"name": "@state.name"`, `"status": "@state.status"` (tokens unquoted-looking, no `{{}}`).
5. Verify Key/Value table shows 3 rows: `id`, `name`, `status`.
6. Verify Generated CONCAT (click **Show**) reproduces an equivalent `CONCAT("...")` expression with `@state.name`/`@state.status` as unquoted script-variable args.

### 1.2 Plain JSON object
Touches: `templateParser.js`

1. Paste: `{"id":"123","name":"Alice","status":"active"}`.
2. Click **Render**.
3. Verify it renders with no error and all three fields appear in the table in the same order as typed.

### 1.3 JS object literal with bare identifiers
Touches: `jsObjectParser.js`

1. Paste: `{ id: "123", tags: [a, 1, "z"], meta: { nested: { deep: deepVal } } }`.
2. Click **Render**.
3. Verify `tags` renders as an array `["a", 1, "z"]` (bare `a` and `deepVal` become plain strings, `1` becomes a number).
4. Verify `meta.nested.deep` is reachable via the nested editor (click the `meta` row, then `nested`) and shows `"deepVal"`.

### 1.4 Bare `@state.x` tokens
Touches: `jsObjectParser.js`, `templateParser.js`, `concatBuilder.js`

1. Paste: `{ firstName: @state.test, lastName: plain }`.
2. Click **Render**.
3. Verify Pretty JSON shows `"firstName": "@state.test"` and `"lastName": "plain"` (no `{{}}` wrapper visible).
4. Verify Generated CONCAT emits `@state.test` as an unquoted script-variable arg and `"plain"` as a quoted literal.
5. Edit the `firstName` value cell in the Key/Value table to `@state.other` and click away (or re-render). Verify it's still treated as a token (Generated CONCAT reflects the new unquoted var name).

### 1.5 Empty-value fields
Touches: `jsObjectParser.js`

1. Paste: `{ firstName: @state.test, lastName: , dateOfBirth: , memberId: , apiIdentifier: }`.
2. Click **Render**.
3. Verify no parse error, and `lastName`, `dateOfBirth`, `memberId`, `apiIdentifier` all render as empty strings `""`.

### 1.6 Comment / trailing-semicolon / trailing-comma tolerance
Touches: `jsObjectParser.js` (`sanitizeJsObjectText`)

1. Paste:
   ```
   {
     // seed data
     firstName: "Alice",
     lastName: "Smith",
   };
   ```
2. Click **Render**.
3. Verify it renders as `{ "firstName": "Alice", "lastName": "Smith" }` with no error.
4. Verify the Status bar includes a note like "Removed inline comment(s)." (and/or trailing comma/semicolon notes).
5. Regression check — paste an object with a URL value containing `//`, e.g. `{ url: "https://example.com/path" }`, and verify the `//` inside the string is **not** stripped (Status bar should not claim a comment was removed, and the URL renders intact).

### 1.7 Surrounding-code stripping
Touches: `jsObjectParser.js` (`findOutermostBracketSpan`)

1. Paste:
   ```
   object=
   {
     firstName: "Alice",
     lastName: "Smith"
   };
   gs.info(object);
   ```
2. Click **Render**.
3. Verify it renders as just `{ "firstName": "Alice", "lastName": "Smith" }` — no error, and the `object=`/`gs.info(...)` text is discarded.
4. Verify the Status bar notes "Stripped surrounding code outside the object/array literal."

### 1.8 Top-level JSON array
Touches: `templateParser.js`, `concatBuilder.js`, `table.js`

1. Paste: `[{"id":"1","name":"Alice"},{"id":"2","name":"Bob"}]`.
2. Click **Render**.
3. Verify Pretty JSON shows a top-level array of two objects, in the same order as input.
4. Verify the Key/Value table shows two rows keyed `0` and `1` (array indices), each an object value.
5. Verify Generated CONCAT preserves array order (Bob's `id` doesn't come before Alice's).
6. In the table, verify **Add field** pushes a new item (key box is ignored) and **Delete selected** removes by index.

### 1.9 Double-JSON-encoded string
Touches: `templateParser.js`

1. Paste (outer quotes included): `"[{\"id\":\"1\",\"note\":\"line1\\nline2\"}]"`.
2. Click **Render**.
3. Verify it unwraps one level of encoding and renders the inner array normally, with `note` containing a real embedded newline (not a literal `\n` control sequence corrupting the JSON) and no "Bad escaped character" error.

---

## 2. Create new object / array

Touches: `main.js` (`startNew`)

1. Click **+ {}** in the header.
2. Verify Input box clears, Key/Value table shows the empty-state row, and Status bar says "Started a new empty object...".
3. Use **Add field** to add `foo` = `bar`. Verify it appears in the table and in Pretty JSON.
4. Reload/clear, then click **+ []** instead. Verify Status bar says "Started a new empty array..." and **Add field** pushes array items (ignoring the key box).

---

## 3. Pretty JSON + filter

Touches: `pathUtils.js` (`deepFilterObject`), `dom.js` (highlighting)

1. Render: `{"id":"123","meta":{"metrics":{"config":{"allow_retry":true,"env":"prod"}}}}`.
2. Type `allow_retry` into the Pretty JSON filter box.
3. Verify only the path `meta.metrics.config.allow_retry` remains visible (sibling `env` pruned), with `allow_retry` highlighted via `<mark>`.
4. Clear the filter box. Verify the full object reappears.
5. Render an array-of-objects-with-nested-arrays case:
   ```
   [{"name":"Alice","policies":[{"policy_number":"P1"},{"policy_number":"P2"}]},
    {"name":"Bob","policies":[{"policy_number":"P3"}]}]
   ```
6. Filter for `p3`. Verify only Bob's record and only the `P3` policy item remain (Alice's record and Alice's/Bob's non-matching policy items pruned).

---

## 4. Pretty Object (no quotes)

Touches: `concatBuilder.js` (`stringifyPrettyObject`)

1. Render: `{ firstName: @state.test, lastName: plain }`.
2. Click **Show** next to Pretty Object.
3. Verify it displays with zero quote characters anywhere: `{ firstName: @state.test, lastName: plain }`-style, not `{"firstName":...}`.
4. Click **Copy pretty object**. Verify Status bar confirms copy, and verify (paste somewhere) the clipboard contains the unquoted text.
5. Type into the (shared) filter box and verify Pretty Object narrows/highlights the same way Pretty JSON does.
6. Click **Hide**. Verify the panel collapses back.

---

## 5. Generated CONCAT

Touches: `concatBuilder.js` (`objectToTemplate`)

1. Render any object with a mix of a token field and a plain field, e.g. `{ firstName: @state.test, age: 30 }`.
2. Click **Show** next to Generated CONCAT.
3. Verify a valid `CONCAT("...")` string is produced, with `@state.test` unquoted and `age`'s value quoted as part of the JSON string literal.
4. Click **Copy generated CONCAT**. Verify Status bar confirms the copy.
5. Click **Hide**. Verify the panel collapses (defaults to collapsed on page load too — reload and confirm).

---

## 6. Key/Value table

Touches: `table.js`, `pathUtils.js`

### 6.1 Add / edit / delete
1. Render `{"a":"1","b":"2"}`.
2. With **Enable editing** checked, edit `a`'s value cell to `99`. Verify Pretty JSON updates to `"a": 99` (bare number coerced) without clicking Render again.
3. Type `true` into a value cell. Verify it coerces to boolean `true`.
4. Type `{"x":1}` into a value cell. Verify it coerces to a nested object (becomes drill-into-able).
5. Use **Add field** (top button) and the inline add row (`newKey`/`newValue` + Enter or **+**) to add a new row each way. Verify both land in the table.
6. Check the `sel` box on one row and click **Delete selected**. Verify that row disappears from the table and Pretty JSON.
7. Uncheck **Enable editing**. Verify the table becomes read-only (no editable inputs).

### 6.2 Reorder (root table)
Touches: `table.js`, `pathUtils.js` (`reorderObjectKey`, `moveArrayItem`)

1. Render `{ "woottest": "test", "woottest2": "test2" }`.
2. Enable editing.
3. Verify the `order` column shows ↑/↓ buttons, with ↑ disabled on the first row (`woottest`) and ↓ disabled on the last row (`woottest2`).
4. Click ↓ on the `woottest` row.
5. Verify: table now shows `woottest2` above `woottest`; Pretty JSON shows `woottest2` before `woottest`; Generated CONCAT (Show it) also emits `woottest2` before `woottest`.
6. Click ↑ on `woottest` (now last). Verify it moves back above `woottest2`, and all three outputs (table, Pretty JSON, Generated CONCAT) revert to original order.
7. Repeat against a top-level array (e.g. `["a","b","c"]`) — verify ↑/↓ swap array elements by index the same way.

---

## 7. Nested editor

Touches: `table.js`, `main.js`, `pathUtils.js`

1. Render `{ "id": "1", "meta": { "a": "1", "b": "2" } }`.
2. Click the `meta` row's value to drill in. Verify the nested editor opens, header path shows `meta`, and its own Key/Value table shows `a`/`b`.
3. Edit, add, and delete a row inside the nested table the same way as section 6.1 — verify each works.
4. Use the ↑/↓ buttons inside the nested table — verify reordering works the same way as section 6.2, scoped to the nested object only (parent `id` row unaffected).
5. Click **Apply to parent**. Verify the root Pretty JSON/table reflect the nested edits.
6. Re-open the nested editor, make an edit, click **Back** (if nested more than one level deep, verify it steps up one level without discarding), then click **Close**. Verify the nested panel closes.

---

## 8. History

Touches: `historyStore.js`, `historyPanel.js`, `main.js`

### 8.1 Save / dedupe
1. Clear history (**Clear history** button) to start clean.
2. Render `{"a":1}`. Verify a new history entry appears at the top.
3. Click **Render** again with the exact same input/template. Verify no duplicate entry is added (dedupe on identical template).
4. Change the input slightly (`{"a":2}`) and render. Verify a second, distinct entry appears above the first.

### 8.2 Paging and limit
1. Render at least 3 distinct inputs so history has several entries.
2. Open **Settings**, note/change `Page size` (e.g. to `2`). Verify `onHistoryPageSizeChange` persists it (reload the page and confirm the value sticks).
3. Use **← Prev** / **Next →** to page through history. Verify the page info text updates and navigation disables at the first/last page.
4. Change `Max saved` (history limit input) to a smaller number than current history length. Verify old entries beyond the limit are dropped.

### 8.3 Per-entry actions
1. On any history entry, click **Load**. Verify Input box is populated and the app re-renders that entry's template.
2. Click **Copy template** / **Copy CONCAT** / **Copy pretty** on an entry. Verify Status bar confirms each copy (and spot-check clipboard contents match expectations).
3. Click **Delete** on one entry. Verify only that entry is removed, others remain in order.

### 8.4 Clear / purge
1. Click **Clear history**. Verify the history list empties but `Max saved`/`Page size` settings remain unchanged.
2. Click **Purge storage**. Verify history empties AND `Max saved`/`Page size` inputs reset to their defaults (confirms the underlying `localStorage` keys were wiped, not just in-memory state).
3. Reload the page. Verify history stays empty (persisted wipe, not just a visual clear).

---

## 9. Settings panel

Touches: `main.js`, `historyStore.js`

1. Click **Settings**. Verify the panel opens showing `Page size` (wired, functional — see 8.2) and placeholder `Editor settings` / `Output settings` sections (not yet functional — verify they don't error when interacted with, but no behavior change is expected).
2. Click the settings close button. Verify the panel closes.

---

## 10. How-to / Changelog panels

Touches: `main.js`, `dom.js`

1. Click **How to use**. Verify the panel opens showing HOWTO.md content.
2. Type a term that appears in the doc (e.g. `reorder`) into its Search box. Verify the panel narrows to matching lines, highlighted, and clearing the box restores the full doc.
3. Repeat for **What's new** (Changelog panel) with a term from a changelog entry (e.g. `trailing comma`).
4. Close both panels via their close buttons. Verify they close.

---

## 11. Copy-to-clipboard buttons (completeness sweep)

Touches: `main.js`

For a freshly rendered object, click each of the following and verify a success Status message appears (and, spot-check, clipboard content is correct and non-empty):
- **Copy extracted JSON template** (`copyExtractedTemplate`) — copies the raw `{{@state.x}}`-token-intact template, not the substituted values.
- **Copy edited JSON** (`copyEditedJson`) — copies the live edited object.
- **Copy pretty JSON** (`copyPrettyJson`).
- **Copy pretty object** (`copyPrettyObject`).
- **Copy generated CONCAT** (`copyGeneratedConcat`).

Also verify each of these fails gracefully (Status bar shows a "Nothing to copy yet" / "No CONCAT to copy yet" message, not a JS error) when clicked before ever clicking Render, on a freshly loaded page with Input cleared via **Clear**.

---

## 12. Clear

Touches: `main.js` (`clearAll`)

1. Render anything, then click **Clear**.
2. Verify Input box empties, Pretty JSON/Generated CONCAT revert to their placeholder text, and the Key/Value table shows its empty state.
