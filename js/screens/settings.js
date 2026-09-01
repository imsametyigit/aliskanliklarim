import { getState, updateSettings, updateUser, resetAllData, exportBackupJSON, exportCSV } from "../lib/store.js";
import { icons } from "../lib/icons.js";
import { esc } from "../lib/util.js";
import { navigate } from "../router.js";
import { openSheet, confirmSheet } from "../components/sheet.js";
import { showToast } from "../components/toast.js";
import { applyTheme } from "../lib/theme.js";
import { todayStr } from "../lib/date.js";

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openAccountSheet(rerender) {
  const state = getState();
  openSheet({
    title: "Hesap Ayarları",
    bodyHtml: `
      <div class="field">
        <label class="field-label" for="acc-name">Kullanıcı adı</label>
        <input class="input" id="acc-name" type="text" value="${esc(state.user.name)}" maxlength="40" />
      </div>
      <button class="btn btn-primary" id="acc-save" type="button" style="margin-top:var(--space-5);">Kaydet</button>
    `,
    onMount: (body, close) => {
      const input = body.querySelector("#acc-name");
      input.focus();
      body.querySelector("#acc-save").addEventListener("click", () => {
        const val = input.value.trim();
        if (!val) return;
        updateUser({ name: val });
        close();
        rerender();
        showToast("Hesap bilgileri güncellendi");
      });
    },
  });
}

export function render(container) {
  const state = getState();
  const { theme, notifications } = state.user.settings;
  const rerender = () => render(container);

  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <div class="top-header-row">
          <button class="back-btn" id="back-btn" type="button">${icons.chevronLeft}</button>
          <h1 class="card-title" style="font-size:19px;">Ayarlar</h1>
          <span style="width:36px;"></span>
        </div>
      </div>

      <div class="settings-row">
        <span class="settings-row-label"><span class="settings-row-icon">${theme === "dark" ? icons.moon : icons.sun}</span>Koyu Tema</span>
        <button class="switch ${theme === "dark" ? "on" : ""}" id="theme-switch" type="button" aria-label="Koyu temayı aç/kapat"></button>
      </div>

      <div class="settings-row">
        <span class="settings-row-label"><span class="settings-row-icon">${icons.bell}</span>Bildirimler</span>
        <button class="switch ${notifications ? "on" : ""}" id="notif-switch" type="button" aria-label="Bildirimleri aç/kapat"></button>
      </div>

      <div class="settings-row card-tap" id="backup-btn" style="cursor:pointer;">
        <span class="settings-row-label"><span class="settings-row-icon">${icons.download}</span>Verileri Yedekle</span>
        ${icons.chevronRight}
      </div>

      <div class="settings-row card-tap" id="export-btn" style="cursor:pointer;">
        <span class="settings-row-label"><span class="settings-row-icon">${icons.upload}</span>Verileri Dışa Aktar</span>
        ${icons.chevronRight}
      </div>

      <div class="settings-row card-tap" id="account-btn" style="cursor:pointer;">
        <span class="settings-row-label"><span class="settings-row-icon">${icons.user}</span>Hesap Ayarları</span>
        ${icons.chevronRight}
      </div>

      <div class="settings-row card-tap danger-row" id="reset-btn" style="cursor:pointer;">
        <span class="settings-row-label"><span class="settings-row-icon danger">${icons.reset}</span>Verileri Sıfırla</span>
        ${icons.chevronRight}
      </div>
    </div>
  `;

  container.querySelector("#back-btn").addEventListener("click", () => navigate("/profile"));

  container.querySelector("#theme-switch").addEventListener("click", () => {
    const next = theme === "dark" ? "light" : "dark";
    updateSettings({ theme: next });
    applyTheme(next);
    rerender();
  });

  container.querySelector("#notif-switch").addEventListener("click", () => {
    updateSettings({ notifications: !notifications });
    rerender();
    showToast(!notifications ? "Bildirimler açıldı" : "Bildirimler kapatıldı");
  });

  container.querySelector("#backup-btn").addEventListener("click", () => {
    downloadFile(`aliskanliklarim-yedek-${todayStr()}.json`, exportBackupJSON(), "application/json");
    showToast("Yedek indirildi");
  });

  container.querySelector("#export-btn").addEventListener("click", () => {
    downloadFile(`aliskanliklarim-disa-aktarim-${todayStr()}.csv`, exportCSV(), "text/csv");
    showToast("Veriler dışa aktarıldı");
  });

  container.querySelector("#account-btn").addEventListener("click", () => openAccountSheet(rerender));

  container.querySelector("#reset-btn").addEventListener("click", () => {
    confirmSheet({
      title: "Verileri Sıfırla",
      message: "Tüm alışkanlıklarınız, kayıtlarınız ve değerlendirme notlarınız kalıcı olarak silinecek. Bu işlem geri alınamaz.",
      confirmLabel: "Sıfırla",
      onConfirm: () => {
        resetAllData();
        showToast("Veriler sıfırlandı");
        navigate("/today");
      },
    });
  });
}
