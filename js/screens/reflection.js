import { getReflection, saveReflection } from "../lib/store.js";
import { formatLong, isFutureDate, todayStr } from "../lib/date.js";
import { icons } from "../lib/icons.js";
import { esc } from "../lib/util.js";
import { navigate } from "../router.js";
import { showToast } from "../components/toast.js";

export function render(container, params) {
  const date = params[0] || todayStr();
  const existing = getReflection(date);
  const future = isFutureDate(date);

  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <div class="top-header-row">
          <button class="back-btn" id="back-btn" type="button">${icons.chevronLeft}</button>
          <h1 class="card-title" style="font-size:19px;">Günümü Değerlendir</h1>
          <span style="width:36px;"></span>
        </div>
        <p class="page-subtitle" style="margin-top:12px;">${formatLong(date)}</p>
      </div>

      ${future
        ? `<div class="empty-state">${icons.note}<div>Henüz gelmemiş bir gün için değerlendirme yazılamaz.</div></div>`
        : `
        <div class="field">
          <label class="field-label" for="reflect-text">Bugün nasıl geçti?</label>
          <textarea class="textarea" id="reflect-text" placeholder="Günün hakkında notlarını ve düşüncelerini yaz...">${esc(existing?.content || "")}</textarea>
        </div>
        <button class="btn btn-primary" id="save-reflect" type="button" style="margin-top:var(--space-5);">Kaydet</button>
      `}
    </div>
  `;

  container.querySelector("#back-btn").addEventListener("click", () => history.back());

  const saveBtn = container.querySelector("#save-reflect");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const text = container.querySelector("#reflect-text").value;
      saveReflection(date, text);
      showToast("Değerlendirme kaydedildi");
      history.back();
    });
  }
}
