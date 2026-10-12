export function setStatus(kind, msg) {
  const el = document.getElementById("status");
  el.classList.remove("ok", "bad");
  if (kind === "ok") el.classList.add("ok");
  if (kind === "bad") el.classList.add("bad");
  el.textContent = msg;
}

export function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
