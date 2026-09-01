export function uid(prefix = "id") {
  const rnd = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now().toString(36)}${rnd}`;
}

const ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function pct(completed, total) {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
}

export function initials(name) {
  return (name || "?").trim().slice(0, 1).toUpperCase();
}

export function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
