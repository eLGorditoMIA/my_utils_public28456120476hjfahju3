import { state } from "./state.js";

export function saveHistory() {
  try {
    localStorage.setItem("concat_json_viewer_history_v1", JSON.stringify(state.history || []));
    localStorage.setItem("concat_json_viewer_history_limit_v1", String(state.historyLimit ?? 10));
    localStorage.setItem("concat_json_viewer_history_page_size_v1", String(state.historyPageSize ?? 6));
  } catch (e) {
    // ignore storage errors
  }
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem("concat_json_viewer_history_v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function loadHistoryLimit() {
  try {
    const raw = localStorage.getItem("concat_json_viewer_history_limit_v1");
    if (raw === null) return 10;
    const n = Number(raw);
    if (isNaN(n)) return 10;
    return Math.max(0, Math.min(200, n));
  } catch (e) {
    return 10;
  }
}

export function loadHistoryPageSize() {
  try {
    const raw = localStorage.getItem("concat_json_viewer_history_page_size_v1");
    if (raw === null) return 6;
    const n = Number(raw);
    if (isNaN(n)) return 6;
    return Math.max(1, Math.min(50, n));
  } catch (e) {
    return 6;
  }
}
