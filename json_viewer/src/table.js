import { state } from "./state.js";
import { setStatus } from "./dom.js";
import { coerceValue } from "./concatBuilder.js";
import { isObjectLike, formatPath, getAtPath, renameKeyAtPath } from "./pathUtils.js";
import { updateDerivedOutputs } from "./derived.js";

/**
 * Build a key/value table from a parsed object.
 * @param {Record<string, any>} obj
 */
export function renderKvTable(obj) {
  const tbody = document.querySelector("#kvTable tbody");
  tbody.innerHTML = "";

  const keys = Object.keys(obj || {});
  if (!keys.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.style.color = "rgba(255,255,255,0.55)";
    td.textContent = "(no keys found)";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  keys.sort((a, b) => a.localeCompare(b));
  for (const k of keys) {
    const tr = document.createElement("tr");

    const tdSel = document.createElement("td");
    tdSel.style.width = "44px";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "rowSelect";
    cb.dataset.key = k;
    tdSel.appendChild(cb);

    const th = document.createElement("th");
    const td = document.createElement("td");
    const v = obj[k];

    const editEnabled = document.getElementById("editModeToggle")?.checked;
    if (editEnabled) {
      const keyInp = document.createElement("input");
      keyInp.type = "text";
      keyInp.value = k;
      keyInp.dataset.key = k;
      keyInp.style.width = "100%";
      keyInp.style.boxSizing = "border-box";
      keyInp.style.padding = "7px 8px";
      keyInp.style.borderRadius = "8px";
      keyInp.style.border = "1px solid rgba(255,255,255,0.16)";
      keyInp.style.background = "rgba(15, 23, 48, 0.65)";
      keyInp.style.color = "var(--text)";
      keyInp.style.fontFamily = "var(--mono)";
      keyInp.style.fontSize = "12px";
      keyInp.addEventListener("change", onKeyEdit);
      th.appendChild(keyInp);

      if (v && typeof v === "object") {
        // Nested object/array: show preview + Open button
        const wrap = document.createElement("div");
        wrap.style.display = "flex";
        wrap.style.gap = "8px";
        wrap.style.alignItems = "center";

        const preview = document.createElement("div");
        preview.className = "small";
        preview.style.flex = "1";
        preview.style.minWidth = "0";
        const isArr = Array.isArray(v);
        preview.textContent = isArr ? `Array(${v.length})` : "Object";

        const openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "secondary";
        openBtn.textContent = "Open";
        openBtn.dataset.key = k;
        openBtn.addEventListener("click", onOpenNested);

        wrap.appendChild(preview);
        wrap.appendChild(openBtn);
        td.appendChild(wrap);
      } else {
        const inp = document.createElement("input");
        inp.type = "text";
        inp.value = typeof v === "string" ? v : JSON.stringify(v);
        inp.dataset.key = k;
        inp.style.width = "100%";
        inp.style.boxSizing = "border-box";
        inp.style.padding = "7px 8px";
        inp.style.borderRadius = "8px";
        inp.style.border = "1px solid rgba(255,255,255,0.16)";
        inp.style.background = "rgba(15, 23, 48, 0.65)";
        inp.style.color = "var(--text)";
        inp.style.fontFamily = "var(--mono)";
        inp.style.fontSize = "12px";
        inp.addEventListener("input", onValueEdit);
        td.appendChild(inp);
      }
    } else {
      th.textContent = k;
      td.textContent = typeof v === "string" ? v : JSON.stringify(v, null, 2);
    }

    tr.appendChild(tdSel);
    tr.appendChild(th);
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

function onKeyEdit(e) {
  const oldKey = e?.target?.dataset?.key;
  if (!oldKey) return;

  const newKeyRaw = e?.target?.value;
  const newKey = String(newKeyRaw || "").trim();
  if (!newKey) {
    setStatus("bad", "Key cannot be blank.");
    // Re-render to restore old value
    renderKvTable(state.editableObject || {});
    return;
  }

  const obj = state.editableObject || {};
  if (!Object.prototype.hasOwnProperty.call(obj, oldKey)) {
    setStatus("bad", `Original key not found: ${oldKey}`);
    renderKvTable(obj);
    return;
  }

  if (newKey !== oldKey && Object.prototype.hasOwnProperty.call(obj, newKey)) {
    setStatus("bad", `Key already exists: ${newKey}`);
    renderKvTable(obj);
    return;
  }

  // Rename key
  const val = obj[oldKey];
  delete obj[oldKey];
  obj[newKey] = val;
  state.editableObject = obj;

  updateDerivedOutputs();
  renderKvTable(obj);
  setStatus("ok", `Renamed key: ${oldKey} → ${newKey}`);
}

function onValueEdit(e) {
  const key = e?.target?.dataset?.key;
  if (!key) return;

  const obj = state.editableObject || {};
  const raw = e.target.value;
  obj[key] = coerceValue(raw);
  state.editableObject = obj;

  updateDerivedOutputs();
}

export function addField() {
  // Backwards compatible (button still exists): route to inline add
  addFieldInline();
}

export function addFieldInline() {
  const keyEl = document.getElementById("newKey");
  const valEl = document.getElementById("newValue");
  const key = keyEl && keyEl.value ? keyEl.value : "";
  const k = String(key).trim();
  if (!k) {
    setStatus("bad", "Enter a key to add.");
    return;
  }

  const obj = state.editableObject || {};
  if (Object.prototype.hasOwnProperty.call(obj, k)) {
    setStatus("bad", `Key already exists: ${k}`);
    return;
  }

  const value = valEl ? valEl.value : "";
  obj[k] = coerceValue(value);
  state.editableObject = obj;

  if (keyEl) keyEl.value = "";
  if (valEl) valEl.value = "";

  // If user typed an expression (like @state.foo) without token braces, normalize it to a STRING token by default.
  // Use {{{...}}} when you need RAW output (booleans/numbers).
  if (typeof obj[k] === "string") {
    const s = obj[k].trim();
    const isStrToken = /^\{\{[^}]+\}\}$/.test(s);
    const isRawToken = /^\{\{\{[^}]+\}\}\}$/.test(s);
    if (s.startsWith("@") && !isStrToken && !isRawToken) obj[k] = "{{" + s + "}}";
  }

  updateDerivedOutputs();
  renderKvTable(state.editableObject);
  setStatus("ok", `Added field: ${k}`);
}

export function deleteSelected() {
  const obj = state.editableObject || {};
  const checks = Array.from(document.querySelectorAll("input.rowSelect:checked"));
  if (!checks.length) {
    setStatus("bad", "No rows selected.");
    return;
  }
  for (const cb of checks) {
    const k = cb.dataset.key;
    if (k && Object.prototype.hasOwnProperty.call(obj, k)) delete obj[k];
  }
  state.editableObject = obj;
  updateDerivedOutputs();
  renderKvTable(state.editableObject);
  setStatus("ok", `Deleted ${checks.length} field(s).`);
}

export function rerenderTableOnly() {
  renderKvTable(state.editableObject || {});
}

// --- Nested editor (drill into objects/arrays found inside the root table) ---

function showNestedEditor(path) {
  state.nestedPath = path || [];
  const panel = document.getElementById("nestedEditor");
  panel.style.display = "block";
  document.getElementById("nestedPath").textContent = formatPath(state.nestedPath);
  renderNestedTable();
}

export function hideNestedEditor() {
  const panel = document.getElementById("nestedEditor");
  panel.style.display = "none";
  state.nestedPath = [];
}

function onOpenNested(e) {
  const k = e?.target?.dataset?.key;
  if (!k) return;
  const obj = state.editableObject || {};
  const v = obj[k];
  if (!isObjectLike(v)) return;
  showNestedEditor([k]);
}

export function renderNestedTable() {
  const tbody = document.querySelector("#nestedKvTable tbody");
  tbody.innerHTML = "";

  const root = state.editableObject || {};
  const node = getAtPath(root, state.nestedPath || []);

  if (!isObjectLike(node)) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.style.color = "rgba(255,255,255,0.55)";
    td.textContent = "(not an object/array)";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  const editEnabled = document.getElementById("editModeToggle")?.checked;

  // Build rows for object keys or array indices
  const entries = [];
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) entries.push([i, node[i]]);
  } else {
    const ks = Object.keys(node);
    ks.sort((a, b) => a.localeCompare(b));
    for (const k of ks) entries.push([k, node[k]]);
  }

  if (!entries.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.style.color = "rgba(255,255,255,0.55)";
    td.textContent = "(empty)";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const [k, v] of entries) {
    const tr = document.createElement("tr");

    const tdSel = document.createElement("td");
    tdSel.style.width = "44px";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "nestedRowSelect";
    cb.dataset.key = String(k);
    cb.dataset.keyType = typeof k === "number" ? "number" : "string";
    tdSel.appendChild(cb);

    const th = document.createElement("th");
    const td = document.createElement("td");

    // Key cell
    if (editEnabled && !Array.isArray(node)) {
      const keyInp = document.createElement("input");
      keyInp.type = "text";
      keyInp.value = String(k);
      keyInp.dataset.key = String(k);
      keyInp.style.width = "100%";
      keyInp.style.boxSizing = "border-box";
      keyInp.style.padding = "7px 8px";
      keyInp.style.borderRadius = "8px";
      keyInp.style.border = "1px solid rgba(255,255,255,0.16)";
      keyInp.style.background = "rgba(15, 23, 48, 0.65)";
      keyInp.style.color = "var(--text)";
      keyInp.style.fontFamily = "var(--mono)";
      keyInp.style.fontSize = "12px";
      keyInp.addEventListener("change", (ev) => {
        const oldKey = ev?.target?.dataset?.key;
        const newKey = String(ev?.target?.value || "").trim();
        if (!newKey) {
          setStatus("bad", "Key cannot be blank.");
          renderNestedTable();
          return;
        }
        renameKeyAtPath(state.editableObject, state.nestedPath, oldKey, newKey);
        updateDerivedOutputs();
        renderNestedTable();
      });
      th.appendChild(keyInp);
    } else {
      th.textContent = String(k);
    }

    // Value cell
    if (editEnabled) {
      if (isObjectLike(v)) {
        const wrap = document.createElement("div");
        wrap.style.display = "flex";
        wrap.style.gap = "8px";
        wrap.style.alignItems = "center";

        const preview = document.createElement("div");
        preview.className = "small";
        preview.style.flex = "1";
        preview.style.minWidth = "0";
        preview.textContent = Array.isArray(v) ? `Array(${v.length})` : "Object";

        const openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "secondary";
        openBtn.textContent = "Open";
        openBtn.addEventListener("click", () => {
          const nextPath = (state.nestedPath || []).slice();
          nextPath.push(k);
          showNestedEditor(nextPath);
        });

        wrap.appendChild(preview);
        wrap.appendChild(openBtn);
        td.appendChild(wrap);
      } else {
        const inp = document.createElement("input");
        inp.type = "text";
        inp.value = typeof v === "string" ? v : JSON.stringify(v);
        inp.style.width = "100%";
        inp.style.boxSizing = "border-box";
        inp.style.padding = "7px 8px";
        inp.style.borderRadius = "8px";
        inp.style.border = "1px solid rgba(255,255,255,0.16)";
        inp.style.background = "rgba(15, 23, 48, 0.65)";
        inp.style.color = "var(--text)";
        inp.style.fontFamily = "var(--mono)";
        inp.style.fontSize = "12px";
        inp.addEventListener("input", (ev) => {
          const raw = ev.target.value;
          const coerced = coerceValue(raw);
          const node2 = getAtPath(state.editableObject, state.nestedPath);
          if (Array.isArray(node2) && typeof k === "number") node2[k] = coerced;
          else if (node2 && typeof node2 === "object") node2[k] = coerced;
          updateDerivedOutputs();
        });
        td.appendChild(inp);
      }
    } else {
      td.textContent = typeof v === "string" ? v : JSON.stringify(v, null, 2);
    }

    tr.appendChild(tdSel);
    tr.appendChild(th);
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

export function nestedBack() {
  const p = state.nestedPath || [];
  if (p.length <= 1) {
    hideNestedEditor();
    return;
  }
  showNestedEditor(p.slice(0, -1));
}

export function nestedClose() {
  hideNestedEditor();
}

export function nestedApply() {
  // No-op: edits are live on state.editableObject; just refresh main table.
  updateDerivedOutputs();
  renderKvTable(state.editableObject || {});
  setStatus("ok", "Applied nested changes.");
}

export function nestedAdd() {
  const root = state.editableObject || {};
  const node = getAtPath(root, state.nestedPath || []);
  if (!isObjectLike(node)) return;

  if (Array.isArray(node)) {
    node.push("");
  } else {
    const key = prompt("New field key (for this nested object):");
    if (!key) return;
    const k = key.trim();
    if (!k) return;
    if (Object.prototype.hasOwnProperty.call(node, k)) {
      setStatus("bad", "Key already exists: " + k);
      return;
    }
    const value = prompt("Value (true/false, number, JSON, token, or text):", "");
    node[k] = coerceValue(value);
  }

  updateDerivedOutputs();
  renderNestedTable();
}

export function nestedDeleteSelected() {
  const root = state.editableObject || {};
  const node = getAtPath(root, state.nestedPath || []);
  if (!isObjectLike(node)) return;

  const checks = Array.from(document.querySelectorAll("input.nestedRowSelect:checked"));
  if (!checks.length) {
    setStatus("bad", "No nested rows selected.");
    return;
  }

  // Delete from end to start for arrays
  const keys = checks.map((cb) => (cb.dataset.keyType === "number" ? Number(cb.dataset.key) : cb.dataset.key));
  if (Array.isArray(node)) {
    keys.sort((a, b) => b - a);
    for (const idx of keys) node.splice(idx, 1);
  } else {
    for (const k of keys) delete node[k];
  }

  updateDerivedOutputs();
  renderNestedTable();
}
