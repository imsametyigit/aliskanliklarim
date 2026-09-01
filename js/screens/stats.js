import { getPeriodStats, getHabitPerformance } from "../lib/selectors.js";
import { esc } from "../lib/util.js";
import { icons } from "../lib/icons.js";

let period = "week";

const PERIOD_LABEL = { today: "Bugün", week: "Bu Hafta", month: "Bu Ay" };

function renderPerfList(container) {
  const results = getHabitPerformance(period);
  const listEl = container.querySelector("#perf-list");
  if (results.length === 0) {
    listEl.innerHTML = `<div class="empty-state">${icons.stats}<div>${PERIOD_LABEL[period]} için henüz veri yok.</div></div>`;
    return;
  }
  listEl.innerHTML = results
    .map(
      (r) => `
      <div class="card perf-row">
        <div class="perf-row-top">
          <span class="perf-row-name">${esc(r.habit.name)}</span>
          <span class="perf-row-pct">%${r.percent}</span>
        </div>
        <div class="progress-track progress-thin">
          <div class="progress-fill ${r.percent >= 70 ? "success" : ""}" style="width:${r.percent}%"></div>
        </div>
      </div>`
    )
    .join("");
}

export function render(container) {
  const today = getPeriodStats("today");
  const week = getPeriodStats("week");
  const month = getPeriodStats("month");

  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <h1 class="page-title">İstatistik</h1>
        <p class="page-subtitle">Genel performansını gör</p>
      </div>

      <div class="stat-tiles" id="stat-tiles">
        <button class="stat-tile ${period === "today" ? "active" : ""}" data-p="today" type="button">
          <div class="stat-tile-label">Bugün</div>
          <div class="stat-tile-value">%${today.percent}</div>
        </button>
        <button class="stat-tile ${period === "week" ? "active" : ""}" data-p="week" type="button">
          <div class="stat-tile-label">Bu Hafta</div>
          <div class="stat-tile-value">%${week.percent}</div>
        </button>
        <button class="stat-tile ${period === "month" ? "active" : ""}" data-p="month" type="button">
          <div class="stat-tile-label">Bu Ay</div>
          <div class="stat-tile-value">%${month.percent}</div>
        </button>
      </div>

      <div class="section">
        <div class="section-head"><span class="section-title">Alışkanlık Performansı — ${PERIOD_LABEL[period]}</span></div>
        <div id="perf-list"></div>
      </div>
    </div>
  `;

  renderPerfList(container);

  container.querySelectorAll("#stat-tiles .stat-tile").forEach((btn) => {
    btn.addEventListener("click", () => {
      period = btn.dataset.p;
      render(container);
    });
  });
}
