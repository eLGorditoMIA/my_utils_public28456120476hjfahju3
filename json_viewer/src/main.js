import { state } from "./state.js";
import { setStatus } from "./dom.js";
import { extractJsonTemplate, parseJsonTemplate } from "./templateParser.js";
import { generateConcatFromTemplate } from "./concatBuilder.js";
import { applyJsonFilter } from "./derived.js";
import { saveHistory, loadHistory, loadHistoryLimit, loadHistoryPageSize } from "./historyStore.js";
import {
  renderHistory,
  clearHistory,
  purgeHistory,
  onHistoryLimitChange,
  onHistoryPageSizeChange,
  historyPrev,
  historyNext,
  setHistoryLoadHandler,
} from "./historyPanel.js";
import {
  renderKvTable,
  addField,
  addFieldInline,
  deleteSelected,
  rerenderTableOnly,
  nestedBack,
  nestedClose,
  nestedApply,
  nestedAdd,
  nestedDeleteSelected,
} from "./table.js";

function openSettings() {
  const p = document.getElementById("settingsPanel");
  if (p) p.style.display = "block";
}

function closeSettings() {
  const p = document.getElementById("settingsPanel");
  if (p) p.style.display = "none";
}

function render() {
  const input = document.getElementById("input").value;
  const { template, notes } = extractJsonTemplate(input);

  if (!template) {
    document.getElementById("pretty").textContent = "(rendered JSON will appear here)";
    document.getElementById("concatOut").textContent = "(generated CONCAT will appear here)";
    state.generatedConcat = "";
    state.editableObject = {};
    renderKvTable(state.editableObject);
    setStatus("bad", "No JSON template extracted.");
    return;
  }

  // Pretty print (even if parse fails, show template)
  let parsed;
  let parseMode = "";
  try {
    const r = parseJsonTemplate(template);
    parsed = r.parsed;
    parseMode = r.parseMode;
  } catch (e) {
    document.getElementById("pretty").textContent = template;
    document.getElementById("concatOut").textContent = "(generated CONCAT will appear here)";
    state.generatedConcat = "";
    state.editableObject = {};
    renderKvTable(state.editableObject);
    setStatus("bad", `Extracted template but JSON parse failed: ${e.message}. Notes: ${notes.join(" | ")}`);
    return;
  }

  // Keep a working copy that you can edit/add/delete
  state.editableObject = JSON.parse(JSON.stringify(parsed));

  applyJsonFilter();
  renderKvTable(state.editableObject);

  // Generate CONCAT from extracted template (preserves {{...}} tokens)
  state.generatedConcat = generateConcatFromTemplate(template);
  document.getElementById("concatOut").textContent = state.generatedConcat || "(could not generate CONCAT)";

  const noteText = notes.length ? ` Notes: ${notes.join(" | ")}` : "";
  const modeText = parseMode ? ` Parse mode: ${parseMode}.` : "";
  setStatus("ok", `Rendered successfully.${modeText}${noteText}`);

  // Store last extracted template for copy button
  state.lastTemplate = template;

  // History (last N renders)
  state.history = state.history || [];
  const entry = {
    at: new Date().toISOString(),
    input: (input || "").trim(),
    template: template,
    pretty: JSON.stringify(state.editableObject, null, 2),
    concat: state.generatedConcat || "",
  };
  // De-dupe consecutive identical templates
  const last = state.history.length ? state.history[0] : null;
  if (!last || last.template !== entry.template) {
    state.history.unshift(entry);
    const limit = Number(state.historyLimit);
    if (!isNaN(limit) && limit >= 0) {
      state.history = state.history.slice(0, limit);
    } else {
      state.history = state.history.slice(0, 10);
    }
  }
  saveHistory();
  renderHistory();
}

function copyExtractedTemplate() {
  const t = state.lastTemplate || "";
  if (!t) {
    setStatus("bad", "Nothing to copy yet — click Render first.");
    return;
  }
  navigator.clipboard.writeText(t).then(
    () => setStatus("ok", "Copied extracted JSON template to clipboard."),
    (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
  );
}

function copyEditedJson() {
  const obj = state.editableObject || {};
  const text = JSON.stringify(obj, null, 2);
  navigator.clipboard.writeText(text).then(
    () => setStatus("ok", "Copied edited JSON to clipboard."),
    (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
  );
}

function copyPrettyJson() {
  const text = document.getElementById("pretty")?.textContent || "";
  if (!text || text.includes("(rendered JSON will appear here)")) {
    setStatus("bad", "Nothing to copy yet — click Render first.");
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => setStatus("ok", "Copied pretty JSON to clipboard."),
    (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
  );
}

function copyGeneratedConcat() {
  const t = state.generatedConcat || "";
  if (!t) {
    setStatus("bad", "No CONCAT to copy yet — click Render first.");
    return;
  }
  navigator.clipboard.writeText(t).then(
    () => setStatus("ok", "Copied generated CONCAT to clipboard."),
    (err) => setStatus("bad", "Clipboard copy failed: " + (err && err.message ? err.message : String(err)))
  );
}

function clearAll() {
  document.getElementById("input").value = "";
  document.getElementById("pretty").textContent = "(rendered JSON will appear here)";
  document.getElementById("concatOut").textContent = "(generated CONCAT will appear here)";
  renderKvTable({});
  state.lastTemplate = "";
  state.generatedConcat = "";
  state.editableObject = {};
  setStatus("ok", "Cleared.");
}

// Wire up
document.getElementById("renderBtn").addEventListener("click", render);
document.getElementById("copyTemplateBtn").addEventListener("click", copyExtractedTemplate);
document.getElementById("settingsBtn").addEventListener("click", openSettings);
document.getElementById("settingsCloseBtn").addEventListener("click", closeSettings);

document.getElementById("copyPrettyBtn").addEventListener("click", copyPrettyJson);
document.getElementById("jsonFilter").addEventListener("input", applyJsonFilter);
document.getElementById("copyEditedJsonBtn").addEventListener("click", copyEditedJson);
document.getElementById("copyConcatBtn").addEventListener("click", copyGeneratedConcat);
document.getElementById("addFieldBtn").addEventListener("click", addField);
document.getElementById("addInlineBtn").addEventListener("click", addFieldInline);
document.getElementById("newKey").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addFieldInline();
});
document.getElementById("newValue").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addFieldInline();
});
document.getElementById("deleteSelectedBtn").addEventListener("click", deleteSelected);
document.getElementById("editModeToggle").addEventListener("change", rerenderTableOnly);
document.getElementById("clearBtn").addEventListener("click", clearAll);
document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);

// Nested editor wire-up
document.getElementById("nestedBackBtn").addEventListener("click", nestedBack);
document.getElementById("nestedCloseBtn").addEventListener("click", nestedClose);
document.getElementById("nestedApplyBtn").addEventListener("click", nestedApply);
document.getElementById("nestedAddBtn").addEventListener("click", nestedAdd);
document.getElementById("nestedDeleteBtn").addEventListener("click", nestedDeleteSelected);
document.getElementById("purgeHistoryBtn").addEventListener("click", purgeHistory);
document.getElementById("historyLimit").addEventListener("change", onHistoryLimitChange);
document.getElementById("historyPageSize").addEventListener("change", onHistoryPageSizeChange);
document.getElementById("historyPrevBtn").addEventListener("click", historyPrev);
document.getElementById("historyNextBtn").addEventListener("click", historyNext);

// History's "Load" button hands an entry back here to re-run it through render()
setHistoryLoadHandler((item) => {
  document.getElementById("input").value = item.input || item.template || "";
  state.lastTemplate = item.template || "";
  state.generatedConcat = item.concat || "";
  render();
});

// Load history on startup
state.historyLimit = loadHistoryLimit();
document.getElementById("historyLimit").value = String(state.historyLimit);

state.historyPageSize = loadHistoryPageSize();
document.getElementById("historyPageSize").value = String(state.historyPageSize);
state.historyPageIndex = 0;

state.history = loadHistory();
// Enforce limit in case stored history is bigger
state.history = state.history.slice(0, state.historyLimit);
saveHistory();
renderHistory();

// Seed with an example for convenience
document.getElementById("input").value =
  'CONCAT("{\\"searchType\\":\\"", @state.searchType, "\\",\\"client_id\\":\\"", @state.clientIdTemp, "\\",\\"client_name\\":\\"", @state.clientNameTemp, "\\",\\"customer_search_value\\":\\"", @state.cust_pln_value_temp, "\\",\\"by_customer_payer_id\\":\\"", @state.checkbox_customer_health_plan_id_state, "\\",\\"by_customer_payer_name\\":\\"", @state.checkbox_customer_health_plan_name_state, "\\",\\"allow_partial_search\\":\\"", @state.allow_partial_search, "\\"}")';
