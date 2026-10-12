import { state } from "./state.js";
import { objectToTemplate, generateConcatFromTemplate } from "./concatBuilder.js";

export function applyJsonFilter() {
  const filter = (document.getElementById("jsonFilter")?.value || "").trim().toLowerCase();
  const obj = state.editableObject || {};
  if (!filter) {
    document.getElementById("pretty").textContent = JSON.stringify(obj, null, 2);
    return;
  }
  const results = {};
  Object.entries(obj).forEach(([k, v]) => {
    const t = JSON.stringify(v);
    if (k.toLowerCase().includes(filter) || t.toLowerCase().includes(filter)) results[k] = v;
  });
  document.getElementById("pretty").textContent = JSON.stringify(results, null, 2);
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
