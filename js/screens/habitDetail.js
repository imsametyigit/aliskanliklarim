import { getHabit, updateHabit, archiveHabit } from "../lib/store.js";
import { icons } from "../lib/icons.js";
import { esc } from "../lib/util.js";
import { navigate } from "../router.js";
import { openSheet, confirmSheet } from "../components/sheet.js";
import { showToast } from "../components/toast.js";

function openEditNameSheet(habit, rerender) {
  openSheet({
    title: "Alışkanlığı Düzenle",
    bodyHtml: `
      <div class="field">
        <label class="field-label" for="edit-habit-name">Alışkanlık adı</label>
        <input class="input" id="edit-habit-name" type="text" value="${esc(habit.name)}" maxlength="60" />
      </div>
      <button class="btn btn-primary" id="save-habit-name" type="button" style="margin-top:var(--space-5);">Kaydet</button>
    `,
    onMount: (body, close) => {
      const input = body.querySelector("#edit-habit-name");
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      body.querySelector("#save-habit-name").addEventListener("click", () => {
        const val = input.value.trim();
        if (!val) return;
        updateHabit(habit.id, { name: val });
        close();
        rerender();
        showToast("Alışkanlık güncellendi");
      });
    },
  });
}

export function render(container, params) {
  const id = params[0];
  const habit = getHabit(id);

  if (!habit) {
    container.innerHTML = `
      <div class="top-header">
        <button class="back-btn" id="back-btn" type="button">${icons.chevronLeft}</button>
      </div>
      <div class="empty-state">${icons.habits}<div>Alışkanlık bulunamadı.</div></div>
    `;
    container.querySelector("#back-btn").addEventListener("click", () => navigate("/habits"));
    return;
  }

  const rerender = () => render(container, params);

  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <button class="back-btn" id="back-btn" type="button">${icons.chevronLeft}</button>
      </div>

      <h1 class="detail-name">${esc(habit.name)}</h1>

      <div class="detail-block-label">Durum</div>
      <div class="pill-row">
        <button class="pill-toggle ${habit.isActive ? "active" : ""}" data-status="active" type="button">Aktif</button>
        <button class="pill-toggle ${!habit.isActive ? "active" : ""}" data-status="inactive" type="button">Pasif</button>
      </div>

      <div class="detail-block-label" style="margin-top:var(--space-6);">Tür</div>
      <div class="pill-row">
        <button class="pill-toggle ${habit.isFixed ? "active" : ""}" data-fixed="1" type="button">Sabit</button>
        <button class="pill-toggle ${!habit.isFixed ? "active" : ""}" data-fixed="0" type="button">Sabit değil</button>
      </div>

      <div class="hint-banner" style="margin-top:var(--space-6);">
        ${icons.info}
        <span>${habit.isFixed
          ? "Aktif + Sabit alışkanlıklar her güne otomatik eklenir. Pasif olursa yeni günlere eklenmez."
          : "Sabit olmayan alışkanlıklar yalnızca eklediğiniz günlerde görünür."}</span>
      </div>

      <div class="detail-block-label" style="margin-top:var(--space-6);">Aksiyonlar</div>
      <div class="stack-sm">
        <button class="link-row card-tap" id="edit-btn" type="button" style="width:100%;">
          <span style="display:flex;align-items:center;gap:10px;font-weight:500;">${icons.edit}Düzenle</span>
          ${icons.chevronRight}
        </button>
        <button class="link-row card-tap" id="remove-btn" type="button" style="width:100%;color:var(--color-danger);">
          <span style="display:flex;align-items:center;gap:10px;font-weight:500;">${icons.archive}Kaldır</span>
          ${icons.chevronRight}
        </button>
      </div>

      <p class="text-tertiary" style="font-size:12.5px;margin-top:var(--space-5);line-height:1.5;">
        Bir alışkanlığı kaldırdığınızda geçmiş kayıtları silinmez; alışkanlık arşivlenir ve istatistikleriniz korunur.
      </p>
    </div>
  `;

  container.querySelector("#back-btn").addEventListener("click", () => navigate("/habits"));

  container.querySelectorAll("[data-status]").forEach((btn) => {
    btn.addEventListener("click", () => {
      updateHabit(habit.id, { isActive: btn.dataset.status === "active" });
      rerender();
    });
  });
  container.querySelectorAll("[data-fixed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      updateHabit(habit.id, { isFixed: btn.dataset.fixed === "1" });
      rerender();
    });
  });

  container.querySelector("#edit-btn").addEventListener("click", () => openEditNameSheet(habit, rerender));
  container.querySelector("#remove-btn").addEventListener("click", () => {
    confirmSheet({
      title: "Alışkanlığı Kaldır",
      message: `"${habit.name}" alışkanlığını kaldırmak istediğinize emin misiniz? Geçmiş kayıtlar korunacaktır.`,
      confirmLabel: "Kaldır",
      onConfirm: () => {
        archiveHabit(habit.id);
        showToast("Alışkanlık kaldırıldı");
        navigate("/habits");
      },
    });
  });
}
