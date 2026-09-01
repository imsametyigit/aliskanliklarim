import { icons } from "../lib/icons.js";
import { esc } from "../lib/util.js";

const root = () => document.getElementById("sheet-root");

let closeCurrent = null;

export function closeSheet() {
  if (closeCurrent) closeCurrent();
}

export function openSheet({ title, bodyHtml, onMount, onClose, closeOnOverlay = true }) {
  closeSheet();

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <h2 class="sheet-title">${esc(title)}</h2>
      <button class="sheet-close" type="button" aria-label="Kapat">${icons.close}</button>
    </div>
    <div class="sheet-body">${bodyHtml}</div>
  `;

  root().appendChild(overlay);
  root().appendChild(sheet);
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    overlay.classList.add("show");
    sheet.classList.add("show");
  });

  let closed = false;
  const doClose = () => {
    if (closed) return;
    closed = true;
    overlay.classList.remove("show");
    sheet.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => {
      overlay.remove();
      sheet.remove();
    }, 260);
    closeCurrent = null;
    if (onClose) onClose();
  };

  closeCurrent = doClose;
  sheet.querySelector(".sheet-close").addEventListener("click", doClose);
  if (closeOnOverlay) overlay.addEventListener("click", doClose);

  if (onMount) onMount(sheet.querySelector(".sheet-body"), doClose);
  return doClose;
}

export function confirmSheet({ title, message, confirmLabel = "Onayla", cancelLabel = "Vazgeç", danger = true, onConfirm }) {
  openSheet({
    title,
    bodyHtml: `
      <div class="confirm-sheet-body">
        <div class="confirm-sheet-icon">${icons.trash}</div>
        <p class="confirm-sheet-text">${esc(message)}</p>
      </div>
      <div class="btn-block-row" style="padding: 0 4px;">
        <button class="btn btn-outline" data-act="cancel">${esc(cancelLabel)}</button>
        <button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-act="confirm">${esc(confirmLabel)}</button>
      </div>
    `,
    onMount: (body, close) => {
      body.querySelector('[data-act="cancel"]').addEventListener("click", close);
      body.querySelector('[data-act="confirm"]').addEventListener("click", () => {
        close();
        onConfirm && onConfirm();
      });
    },
  });
}
