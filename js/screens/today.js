import { todayStr, formatLong } from "../lib/date.js";
import { getDayEntries, getDailyProgress } from "../lib/selectors.js";
import { getState, toggleDailyHabit, addManualHabitToDate, removeDailyHabit, isHabitAddedToday } from "../lib/store.js";
import { icons } from "../lib/icons.js";
import { esc } from "../lib/util.js";
import { navigate } from "../router.js";
import { openSheet, closeSheet } from "../components/sheet.js";
import { showToast } from "../components/toast.js";

function habitRowHtml(entry, { removable }) {
  return `
    <div class="habit-row ${entry.completed ? "is-done" : ""}" data-habit-id="${entry.habit.id}">
      <button class="checkbox ${entry.completed ? "checked" : ""}" type="button" data-action="toggle" aria-label="Tamamlandı işaretle">
        ${icons.check}
      </button>
      <div class="habit-row-label">
        <div class="habit-row-name ${entry.completed ? "done" : ""}">${esc(entry.habit.name)}</div>
      </div>
      ${removable ? `<button class="habit-row-remove" type="button" data-action="remove" aria-label="Kaldır">${icons.x}</button>` : ""}
    </div>`;
}

function openAddToTodaySheet(date, rerenderScreen) {
  const state = getState();
  const eligible = state.habits.filter((h) => !h.isFixed && h.isActive);

  const bodyHtml = `
    ${eligible.length === 0
      ? `<div class="empty-state">${icons.habits}<div>Eklenebilecek sabit olmayan aktif alışkanlığınız yok.<br/>Önce "Alışkanlıklarım" ekranından bir tane oluşturun.</div></div>`
      : `<ul class="stack-sm" id="add-today-list"></ul>`
    }
  `;

  openSheet({
    title: "Bugüne Alışkanlık Ekle",
    bodyHtml,
    onMount: (body) => {
      const list = body.querySelector("#add-today-list");
      if (!list) return;
      const renderList = () => {
        list.innerHTML = eligible
          .map((h) => {
            const added = isHabitAddedToday(h.id, date);
            return `
            <li class="lib-item ${added ? "added" : ""}">
              <span class="lib-item-name">${esc(h.name)}</span>
              <button class="lib-item-add ${added ? "added-icon" : ""}" type="button" data-id="${h.id}" ${added ? "disabled" : ""} aria-label="Ekle">
                ${added ? icons.check : icons.plus}
              </button>
            </li>`;
          })
          .join("");
        list.querySelectorAll("[data-id]").forEach((btn) => {
          btn.addEventListener("click", () => {
            addManualHabitToDate(btn.dataset.id, date);
            renderList();
            rerenderScreen();
            showToast("Bugüne eklendi");
          });
        });
      };
      renderList();
    },
  });
}

export function render(container) {
  const date = todayStr();
  const state = getState();
  const { fixed, manual } = getDayEntries(date);
  const progress = getDailyProgress(date);
  const reflection = state.reflections.find((r) => r.date === date);

  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <h1 class="page-title">Merhaba, ${esc(state.user.name)}</h1>
        <p class="page-subtitle">${formatLong(date)}</p>
      </div>

      <div class="card">
        <div class="section-head" style="margin-bottom:14px;">
          <span class="card-title">Günlük İlerleme</span>
          <span class="card-title" style="color:var(--color-primary);">%${progress.percent}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${progress.percent}%"></div>
        </div>
        <p class="text-tertiary" style="font-size:13px;margin-top:10px;">${progress.completed} / ${progress.total} tamamlandı</p>
      </div>

      <div class="section">
        <div class="section-head">
          <span class="section-title">Sabit Alışkanlıklar</span>
        </div>
        <div id="fixed-list">
          ${fixed.length ? fixed.map((e) => habitRowHtml(e, { removable: false })).join("") : `<div class="empty-state">${icons.habits}<div>Henüz sabit alışkanlığınız yok.</div></div>`}
        </div>
      </div>

      <div class="section">
        <div class="section-head">
          <span class="section-title">Bugüne Eklenenler</span>
          <button class="add-btn" type="button" id="add-today-btn">${icons.plus}Bugüne Ekle</button>
        </div>
        <div id="manual-list">
          ${manual.length ? manual.map((e) => habitRowHtml(e, { removable: true })).join("") : `<div class="empty-state" style="padding:24px 4px;">Bugüne özel eklenmiş bir alışkanlık yok.</div>`}
        </div>
      </div>

      <div class="section">
        <button class="card card-tap reflect-card" type="button" id="reflect-card" style="width:100%;text-align:left;border:1px solid var(--color-primary-soft-2);">
          <div class="reflect-icon">${icons.note}</div>
          <div class="reflect-body">
            <div class="reflect-title">Günümü Değerlendir</div>
            <div class="reflect-sub">${reflection ? "Bugün için bir notunuz var — görüntülemek için dokunun." : "Bugün nasıl geçti? Günün hakkında notlarını ve düşüncelerini yaz."}</div>
          </div>
          <div class="reflect-chev">${icons.chevronRight}</div>
        </button>
      </div>
    </div>
  `;

  const rerender = () => render(container);

  container.querySelectorAll("#fixed-list .habit-row, #manual-list .habit-row").forEach((row) => {
    const habitId = row.dataset.habitId;
    row.querySelector('[data-action="toggle"]').addEventListener("click", () => {
      toggleDailyHabit(habitId, date);
    });
    const removeBtn = row.querySelector('[data-action="remove"]');
    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const entry = manual.find((m) => m.habit.id === habitId);
        if (entry) removeDailyHabit(entry.dailyHabitId);
      });
    }
  });

  container.querySelector("#add-today-btn").addEventListener("click", () => openAddToTodaySheet(date, rerender));
  container.querySelector("#reflect-card").addEventListener("click", () => navigate(`/reflection/${date}`));
}
