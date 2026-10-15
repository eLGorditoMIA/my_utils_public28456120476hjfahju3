export function setStatus(kind, msg, elementId = "status") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.remove("ok", "bad");
  if (kind === "ok") el.classList.add("ok");
  if (kind === "bad") el.classList.add("bad");
  el.textContent = msg;
}

export function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * Escapes text for HTML, then wraps any case-insensitive occurrence of
 * `filter` in <mark> tags so matches can be highlighted in place without
 * pruning away their surrounding structure.
 */
export function highlightMatches(text, filter) {
  const escaped = escapeHtml(text);
  if (!filter) return escaped;
  const escapedFilter = escapeHtml(filter).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escapedFilter) return escaped;
  const re = new RegExp(escapedFilter, "gi");
  return escaped.replace(re, (m) => "<mark>" + m + "</mark>");
}
