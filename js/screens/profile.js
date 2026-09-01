import { getState } from "../lib/store.js";
import { getTotalCompletedAllTime, getOverallSuccessRate } from "../lib/selectors.js";
import { icons } from "../lib/icons.js";
import { esc, initials } from "../lib/util.js";
import { navigate } from "../router.js";

export function render(container) {
  const state = getState();
  const total = getTotalCompletedAllTime();
  const rate = getOverallSuccessRate();

  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <h1 class="page-title">Profil</h1>
      </div>

      <div class="profile-head">
        <div class="avatar-lg">${initials(state.user.name)}</div>
        <div>
          <div class="profile-name">${esc(state.user.name)}</div>
          <div class="profile-sub">Kişisel hesap</div>
        </div>
      </div>

      <div class="stat-pair">
        <div class="card">
          <div class="stat-pair-value">${total.toLocaleString("tr-TR")}</div>
          <div class="stat-pair-label">Toplam Tamamlanan</div>
        </div>
        <div class="card">
          <div class="stat-pair-value accent">%${rate}</div>
          <div class="stat-pair-label">Genel Başarı</div>
        </div>
      </div>

      <div class="section">
        <button class="link-row card-tap" id="settings-btn" type="button" style="width:100%;">
          <span style="display:flex;align-items:center;gap:10px;font-weight:500;">${icons.settings}Ayarlar</span>
          ${icons.chevronRight}
        </button>
      </div>
    </div>
  `;

  container.querySelector("#settings-btn").addEventListener("click", () => navigate("/settings"));
}
