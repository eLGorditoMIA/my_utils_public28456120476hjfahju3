import { state } from "./state.js";
import { escapeHtml, setStatus } from "./dom.js";
import { saveHistory } from "./historyStore.js";

// Set by main.js so the "Load" action can hand an entry back to the render pipeline
// without this module needing to import main.js.
let onLoadHandler = null;
export function setHistoryLoadHandler(fn) {
  onLoadHandler = fn;
}

export function renderHistory() {
  const el = document.getElementById("history");
  if (!el) return;

  const h = state.history || [];
  if (!h.length) {
    el.textContent = "(no history yet)";
    const info = document.getElementById("historyPageInfo");
    if (info) info.textContent = "Page 0 of 0";
    return;
  }

  const pageSize = Math.max(1, Number(state.historyPageSize || 6));
  const totalPages = Math.max(1, Math.ceil(h.length / pageSize));
  state.historyPageIndex = Math.max(0, Math.min(totalPages - 1, Number(state.historyPageIndex || 0)));

  const start = state.historyPageIndex * pageSize;
  const end = Math.min(h.length, start + pageSize);
  const pageItems = h.slice(start, end);

  const info = document.getElementById("historyPageInfo");
  if (info) info.textContent = "Page " + (state.historyPageIndex + 1) + " of " + totalPages;

  const prevBtn = document.getElementById("historyPrevBtn");
  const nextBtn = document.getElementById("historyNextBtn");
  if (prevBtn) prevBtn.disabled = state.historyPageIndex <= 0;
  if (nextBtn) nextBtn.disabled = state.historyPageIndex >= totalPages - 1;

  const rows = pageItems
    .map((it, localIdx) => {
      const idx = start + localIdx;
      const when = escapeHtml(it.at || "");
      const preview = escapeHtml((it.template || "").slice(0, 180));
      return `
    <div style="display:flex; gap:10px; align-items:flex-start; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.10);">
      <div style="flex: 0 0 auto; font-family: var(--mono); color: var(--muted);">${idx + 1}.</div>
      <div style="flex: 1 1 auto; min-width: 0;">
        <div class="small" style="margin-bottom: 6px;">${when}</div>
        <div style="font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,0.75); word-break: break-word;">${preview}${(it.template || "").length > 180 ? "…" : ""}</div>
        <div class="row" style="margin-top: 8px;">
          <button class="secondary" data-h-action="load" data-h-index="${idx}">Load</button>
          <button class="secondary" data-h-action="copy_template" data-h-index="${idx}">Copy template</button>
          <button class="secondary" data-h-action="copy_concat" data-h-index="${idx}">Copy CONCAT</button>
          <button class="secondary" data-h-action="copy_pretty" data-h-index="${idx}">Copy pretty</button>
          <button class="danger" data-h-action="delete" data-h-index="${idx}">Delete</button>
        </div>
      </div>
    </div>`;
    })
    .join("");

  el.innerHTML = rows;

  // Paging: no scrollbars needed
  el.style.height = "";
  el.style.maxHeight = "";
  el.style.overflowY = "visible";

  // Delegate clicks
  el.querySelectorAll("button[data-h-action]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const action = e.target.getAttribute("data-h-action");
      const index = Number(e.target.getAttribute("data-h-index"));
      const item = (state.history || [])[index];
      if (!item) return;

      if (action === "load") {
        if (onLoadHandler) onLoadHandler(item);
      } else if (action === "copy_template") {
        navigator.clipboard.writeText(item.template || "").then(
          () => setStatus("ok", "Copied template from history."),
          (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
        );
      } else if (action === "copy_concat") {
        navigator.clipboard.writeText(item.concat || "").then(
          () => setStatus("ok", "Copied CONCAT from history."),
          (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
        );
      } else if (action === "copy_pretty") {
        navigator.clipboard.writeText(item.pretty || "").then(
          () => setStatus("ok", "Copied pretty JSON from history."),
          (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
        );
      } else if (action === "delete") {
        const h = state.history || [];
        h.splice(index, 1);
        state.history = h;

        // If current page is now out of range, move back one
        const pageSize = Math.max(1, Number(state.historyPageSize || 6));
        const totalPages = Math.max(1, Math.ceil(h.length / pageSize));
        state.historyPageIndex = Math.max(0, Math.min(totalPages - 1, Number(state.historyPageIndex || 0)));

        saveHistory();
        renderHistory();
        setStatus("ok", "Deleted history entry #" + (index + 1) + ".");
      }
    });
  });
}

export function clearHistory() {
  state.history = [];
  saveHistory();
  renderHistory();
  setStatus("ok", "Cleared history.");
}

export function purgeHistory() {
  try {
    localStorage.removeItem("concat_json_viewer_history_v1");
    localStorage.removeItem("concat_json_viewer_history_limit_v1");
    localStorage.removeItem("concat_json_viewer_history_page_size_v1");
  } catch (e) {
    // ignore
  }
  state.history = [];
  state.historyLimit = 10;
  state.historyPageSize = 6;
  state.historyPageIndex = 0;

  const limitEl = document.getElementById("historyLimit");
  if (limitEl) limitEl.value = String(state.historyLimit);
  const pageSizeEl = document.getElementById("historyPageSize");
  if (pageSizeEl) pageSizeEl.value = String(state.historyPageSize);

  renderHistory();
  setStatus("ok", "Purged history storage.");
}

export function onHistoryLimitChange() {
  const el = document.getElementById("historyLimit");
  const n = Number(el ? el.value : 10);
  const limit = isNaN(n) ? 10 : Math.max(0, Math.min(200, n));
  state.historyLimit = limit;

  // Apply limit immediately
  state.history = (state.history || []).slice(0, limit);
  // Clamp page index after trimming
  const pageSize = Math.max(1, Number(state.historyPageSize || 6));
  const totalPages = Math.max(1, Math.ceil((state.history || []).length / pageSize));
  state.historyPageIndex = Math.max(0, Math.min(totalPages - 1, Number(state.historyPageIndex || 0)));

  saveHistory();
  renderHistory();
  setStatus("ok", "History max saved set to " + limit + ".");
}

export function onHistoryPageSizeChange() {
  const el = document.getElementById("historyPageSize");
  const n = Number(el ? el.value : 6);
  const size = isNaN(n) ? 6 : Math.max(1, Math.min(50, n));
  state.historyPageSize = size;
  state.historyPageIndex = 0;
  saveHistory();
  renderHistory();
  setStatus("ok", "History page size set to " + size + ".");
}

export function historyPrev() {
  state.historyPageIndex = Math.max(0, Number(state.historyPageIndex || 0) - 1);
  renderHistory();
}

export function historyNext() {
  state.historyPageIndex = Number(state.historyPageIndex || 0) + 1;
  renderHistory();
}
