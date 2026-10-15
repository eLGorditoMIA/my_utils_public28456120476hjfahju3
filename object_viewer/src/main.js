import { state } from "./state.js";
import { setStatus, escapeHtml, highlightMatches } from "./dom.js";
import { extractJsonTemplate, parseJsonTemplate } from "./templateParser.js";
import { generateConcatFromTemplate } from "./concatBuilder.js";
import { applyJsonFilter, updateDerivedOutputs } from "./derived.js";
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
  hideNestedEditor,
} from "./table.js";

function openSettings() {
  const p = document.getElementById("settingsPanel");
  if (p) p.style.display = "block";
}

function closeSettings() {
  const p = document.getElementById("settingsPanel");
  if (p) p.style.display = "none";
}

function makeFetchedDocPanel(panelId, contentId, fileName, searchId) {
  let loaded = false;
  let rawText = "";

  function render() {
    const contentEl = document.getElementById(contentId);
    const searchEl = document.getElementById(searchId);
    const filter = searchEl ? searchEl.value.trim() : "";
    if (!filter) {
      contentEl.innerHTML = escapeHtml(rawText);
      return;
    }
    const lower = filter.toLowerCase();
    const matchingLines = rawText.split("\n").filter((line) => line.toLowerCase().includes(lower));
    if (!matchingLines.length) {
      contentEl.textContent = "No matches.";
      return;
    }
    contentEl.innerHTML = highlightMatches(matchingLines.join("\n"), filter);
  }

  const searchEl = document.getElementById(searchId);
  if (searchEl) searchEl.addEventListener("input", render);

  return {
    open() {
      const p = document.getElementById(panelId);
      if (p) p.style.display = "block";
      if (loaded) return;
      loaded = true;
      fetch(fileName)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then((text) => {
          rawText = text;
          render();
        })
        .catch((err) => {
          loaded = false;
          document.getElementById(contentId).textContent = `Could not load ${fileName}: ` + err.message;
        });
    },
    close() {
      const p = document.getElementById(panelId);
      if (p) p.style.display = "none";
    },
  };
}

const howtoPanel = makeFetchedDocPanel("howtoPanel", "howtoContent", "HOWTO.md", "howtoSearch");
const changelogPanel = makeFetchedDocPanel("changelogPanel", "changelogContent", "CHANGELOG.md", "changelogSearch");

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

  // Generate CONCAT from extracted template (preserves {{...}} tokens).
  // When the input was a JS-literal with bare identifiers, the raw template text
  // itself isn't valid JSON (unquoted keys/identifiers), so regenerate CONCAT from
  // the normalized/parsed object instead of echoing the raw text back out.
  const templateForConcat = parseMode === "js_literal_coerced" ? JSON.stringify(parsed) : template;
  state.generatedConcat = generateConcatFromTemplate(templateForConcat);
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

function copyPrettyObject() {
  const text = document.getElementById("objectOut")?.textContent || "";
  if (!text || text.includes("(pretty object will appear here)")) {
    setStatus("bad", "Nothing to copy yet — click Render first.");
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => setStatus("ok", "Copied pretty object to clipboard."),
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

function startNew(isArray) {
  hideNestedEditor();
  document.getElementById("input").value = "";
  state.lastTemplate = "";
  state.editableObject = isArray ? [] : {};

  renderKvTable(state.editableObject);
  updateDerivedOutputs();

  setStatus("ok", isArray ? "Started a new empty array. Use Add field below to push items." : "Started a new empty object. Use Add field below to add keys.");

  document.getElementById("newKey")?.focus();
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
document.getElementById("newObjectBtn").addEventListener("click", () => startNew(false));
document.getElementById("newArrayBtn").addEventListener("click", () => startNew(true));
document.getElementById("copyTemplateBtn").addEventListener("click", copyExtractedTemplate);
document.getElementById("settingsBtn").addEventListener("click", openSettings);
document.getElementById("settingsCloseBtn").addEventListener("click", closeSettings);
document.getElementById("howtoBtn").addEventListener("click", howtoPanel.open);
document.getElementById("howtoCloseBtn").addEventListener("click", howtoPanel.close);
document.getElementById("changelogBtn").addEventListener("click", changelogPanel.open);
document.getElementById("changelogCloseBtn").addEventListener("click", changelogPanel.close);

document.getElementById("copyPrettyBtn").addEventListener("click", copyPrettyJson);
document.getElementById("jsonFilter").addEventListener("input", applyJsonFilter);
document.getElementById("copyEditedJsonBtn").addEventListener("click", copyEditedJson);
document.getElementById("copyConcatBtn").addEventListener("click", copyGeneratedConcat);
document.getElementById("toggleConcatBtn").addEventListener("click", () => {
  const body = document.getElementById("concatBody");
  const btn = document.getElementById("toggleConcatBtn");
  const collapsed = body.style.display === "none";
  body.style.display = collapsed ? "block" : "none";
  btn.textContent = collapsed ? "Hide" : "Show";
});
document.getElementById("copyObjectBtn").addEventListener("click", copyPrettyObject);
document.getElementById("toggleObjectBtn").addEventListener("click", () => {
  const body = document.getElementById("objectBody");
  const btn = document.getElementById("toggleObjectBtn");
  const collapsed = body.style.display === "none";
  body.style.display = collapsed ? "block" : "none";
  btn.textContent = collapsed ? "Hide" : "Show";
});
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

// Seed with a generic example for convenience
document.getElementById("input").value =
  'CONCAT("{\\"id\\":\\"123\\",\\"name\\":\\"", @state.name, "\\",\\"status\\":\\"", @state.status, "\\",\\"code\\":\\"", @state.code, "\\",\\"count\\":\\"", @state.count, "\\",\\"flag_a\\":\\"", @state.flag_a, "\\",\\"flag_b\\":\\"", @state.flag_b, "\\"}")';
