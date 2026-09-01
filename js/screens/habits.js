import { getState } from "../lib/store.js";
import { icons } from "../lib/icons.js";
import { esc } from "../lib/util.js";
import { navigate } from "../router.js";

function habitLinkRow(h) {
  return `
    <button class="habit-link-row card-tap" type="button" data-id="${h.id}" style="width:100%;border:1px solid var(--color-border);${!h.isActive ? "opacity:0.55;" : ""}">
      <span class="habit-link-row-name">${esc(h.name)} ${!h.isActive ? `<span class="badge">Pasif</span>` : ""}</span>
      <span class="habit-link-row-chev">${icons.chevronRight}</span>
    </button>`;
}

export function render(container) {
  const state = getState();
  const active = state.habits.filter((h) => !h.archivedAt);
  const fixed = active.filter((h) => h.isFixed);
  const nonFixed = active.filter((h) => !h.isFixed);

  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <div class="top-header-row">
          <h1 class="page-title">Alışkanlıklarım</h1>
          <button class="add-btn" type="button" id="add-habit-btn">${icons.plus}Alışkanlık Ekle</button>
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="section-title">Sabit Alışkanlıklar</span></div>
        <div class="stack-sm">
          ${fixed.length ? fixed.map(habitLinkRow).join("") : `<div class="empty-state">${icons.habits}<div>Henüz sabit alışkanlığınız yok.</div></div>`}
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="section-title">Sabit Olmayan Alışkanlıklar</span></div>
        <div class="stack-sm">
          ${nonFixed.length ? nonFixed.map(habitLinkRow).join("") : `<div class="empty-state">${icons.habits}<div>Henüz sabit olmayan alışkanlığınız yok.</div></div>`}
        </div>
      </div>
    </div>
  `;

  container.querySelector("#add-habit-btn").addEventListener("click", () => navigate("/add-habit"));
  container.querySelectorAll(".habit-link-row").forEach((btn) => {
    btn.addEventListener("click", () => navigate(`/habits/${btn.dataset.id}`));
  });
}
