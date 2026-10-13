import { state } from "./state.js";
import { objectToTemplate, generateConcatFromTemplate } from "./concatBuilder.js";
import { highlightMatches } from "./dom.js";
import { deepFilterObject } from "./pathUtils.js";

export function applyJsonFilter() {
  const filter = (document.getElementById("jsonFilter")?.value || "").trim().toLowerCase();
  const obj = state.editableObject || {};
  const prettyEl = document.getElementById("pretty");
  if (!filter) {
    prettyEl.textContent = JSON.stringify(obj, null, 2);
    return;
  }
  const filtered = deepFilterObject(obj, filter, (v) => JSON.stringify(v));
  const text = JSON.stringify(filtered, null, 2);
  prettyEl.innerHTML = highlightMatches(text, filter);
}

/**
 * Re-derives the pretty JSON (filtered) and the generated CONCAT from the
 * current edited object. Called after any key/value edit in the tables.
 */
export function updateDerivedOutputs() {
  const obj = state.editableObject || {};
  applyJsonFilter();

  const template = objectToTemplate(obj);
  state.generatedConcat = generateConcatFromTemplate(template);
  document.getElementById("concatOut").textContent = state.generatedConcat || "(could not generate CONCAT)";
}
