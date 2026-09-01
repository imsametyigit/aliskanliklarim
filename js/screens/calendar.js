import {
  todayStr, formatMonthYear, formatLong, buildMonthGrid, GUNLER_KISA, fromDateStr, addMonths, isFutureDate,
} from "../lib/date.js";
import { getDayEntries, getDailyProgress, getCalendarDayStatus } from "../lib/selectors.js";
import { getState, toggleDailyHabit } from "../lib/store.js";
import { icons } from "../lib/icons.js";
import { esc } from "../lib/util.js";
import { navigate } from "../router.js";

const today = fromDateStr(todayStr());
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selectedDate = todayStr();

function dotClass(status) {
  if (status === "full") return "full";
  if (status === "partial") return "partial";
  if (status === "low") return "low";
  return "";
}

function renderGrid() {
  const cells = buildMonthGrid(viewYear, viewMonth);
  return cells
    .map((c) => {
      const status = getCalendarDayStatus(c.dateStr);
      const isToday = c.dateStr === todayStr();
      const isSelected = c.dateStr === selectedDate;
      const dayNum = fromDateStr(c.dateStr).getDate();
      const showDot = status !== "future" && status !== "none";
      return `
      <div class="cal-cell">
        <button type="button" class="cal-day ${!c.inMonth ? "muted" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" data-date="${c.dateStr}">
          <span>${dayNum}</span>
          <span class="cal-dot ${showDot ? dotClass(status) : ""}" style="${showDot ? "" : "background:transparent;"}"></span>
        </button>
      </div>`;
    })
    .join("");
}

function renderDayDetail(date) {
  if (isFutureDate(date)) {
    return `
      <div class="card" style="margin-top:var(--space-6);">
        <div class="card-title">${formatLong(date)}</div>
        <div class="empty-state">${icons.calendar}<div>Bu gün henüz gelmedi. Veriler günü geldiğinde görünecek.</div></div>
      </div>
    `;
  }

  const state = getState();
  const { fixed, manual } = getDayEntries(date);
  const all = [...fixed, ...manual];
  const progress = getDailyProgress(date);
  const reflection = state.reflections.find((r) => r.date === date);

  if (all.length === 0) {
    return `
      <div class="card" style="margin-top:var(--space-6);">
        <div class="card-title">${formatLong(date)}</div>
        <div class="empty-state">${icons.calendar}<div>Bu güne ait planlanmış alışkanlık bulunmuyor.</div></div>
      </div>
      ${reflectionBlock(date, reflection)}
    `;
  }

  return `
    <div class="card" style="margin-top:var(--space-6);">
      <div class="card-title">${formatLong(date)}</div>
      <p class="text-tertiary" style="font-size:14px;margin-top:6px;">Başarı: ${progress.completed} / ${progress.total} — %${progress.percent}</p>
      <div class="progress-track" style="margin-top:12px;">
        <div class="progress-fill success" style="width:${progress.percent}%"></div>
      </div>
    </div>
    <div id="day-habit-list" style="margin-top:var(--space-4);">
      ${all
        .map(
          (e) => `
        <div class="habit-row ${e.completed ? "is-done" : ""}" data-habit-id="${e.habit.id}" data-date="${date}">
          <button class="checkbox ${e.completed ? "checked" : ""}" type="button" data-action="toggle">${icons.check}</button>
          <div class="habit-row-label">
            <div class="habit-row-name ${e.completed ? "done" : ""}">${esc(e.habit.name)}</div>
            <div class="habit-row-meta">${e.source === "fixed" ? "Sabit" : "Sabit değil"}</div>
          </div>
        </div>`
        )
        .join("")}
    </div>
    ${reflectionBlock(date, reflection)}
  `;
}

function reflectionBlock(date, reflection) {
  return `
    <button class="card card-tap reflect-card" type="button" id="cal-reflect-card" style="width:100%;text-align:left;margin-top:var(--space-4);border:1px solid var(--color-primary-soft-2);">
      <div class="reflect-icon">${icons.note}</div>
      <div class="reflect-body">
        <div class="reflect-title">${reflection ? "Günlük değerlendirme mevcut" : "Günlük değerlendirme yok"}</div>
        <div class="reflect-sub">${reflection ? "Notu görüntülemek veya düzenlemek için dokunun." : "Bu gün için bir değerlendirme notu ekleyin."}</div>
      </div>
      <div class="reflect-chev">${icons.chevronRight}</div>
    </button>
  `;
}

export function render(container) {
  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <h1 class="page-title">Takvim</h1>
        <p class="page-subtitle">Geçmiş performansını incele</p>
      </div>

      <div class="cal-header">
        <button class="icon-btn" id="prev-month" type="button" aria-label="Önceki ay">${icons.chevronLeft}</button>
        <span class="cal-header-title">${formatMonthYear(viewYear, viewMonth)}</span>
        <button class="icon-btn" id="next-month" type="button" aria-label="Sonraki ay">${icons.chevronRight}</button>
      </div>

      <div class="cal-weekdays">${GUNLER_KISA.map((g) => `<span>${g}</span>`).join("")}</div>
      <div class="cal-grid" id="cal-grid">${renderGrid()}</div>

      <div class="legend">
        <div class="legend-item"><span class="cal-dot full"></span>Tam başarı</div>
        <div class="legend-item"><span class="cal-dot partial"></span>Kısmi başarı</div>
        <div class="legend-item"><span class="cal-dot low"></span>Düşük başarı</div>
      </div>

      <div id="day-detail">${renderDayDetail(selectedDate)}</div>
    </div>
  `;

  const rerender = () => render(container);

  container.querySelector("#prev-month").addEventListener("click", () => {
    const r = addMonths(viewYear, viewMonth, -1);
    viewYear = r.year;
    viewMonth = r.monthIndex;
    rerender();
  });
  container.querySelector("#next-month").addEventListener("click", () => {
    const r = addMonths(viewYear, viewMonth, 1);
    viewYear = r.year;
    viewMonth = r.monthIndex;
    rerender();
  });

  container.querySelectorAll(".cal-day").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedDate = btn.dataset.date;
      const d = fromDateStr(selectedDate);
      viewYear = d.getFullYear();
      viewMonth = d.getMonth();
      rerender();
    });
  });

  container.querySelectorAll("#day-habit-list .habit-row").forEach((row) => {
    row.querySelector('[data-action="toggle"]').addEventListener("click", () => {
      toggleDailyHabit(row.dataset.habitId, row.dataset.date);
    });
  });

  const reflectCard = container.querySelector("#cal-reflect-card");
  if (reflectCard) {
    reflectCard.addEventListener("click", () => navigate(`/reflection/${selectedDate}`));
  }
}
