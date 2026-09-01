import { HABIT_LIBRARY, CATEGORIES, getState, addHabit } from "../lib/store.js";
import { icons } from "../lib/icons.js";
import { esc } from "../lib/util.js";
import { navigate } from "../router.js";
import { openSheet } from "../components/sheet.js";
import { showToast } from "../components/toast.js";

let query = "";
let activeCategory = "Tümü";

function isAlreadyAdded(name) {
  return getState().habits.some((h) => !h.archivedAt && h.name.toLowerCase() === name.toLowerCase());
}

function openConfigureSheet({ name, category, source }) {
  let isFixed = false;
  let isActive = true;

  const bodyHtml = `
    <p class="card-title" style="margin-bottom:var(--space-5);">${esc(name)}</p>
    <div class="detail-block-label">Tür</div>
    <div class="pill-row" id="cfg-fixed">
      <button class="pill-toggle" data-v="0" type="button">Sabit değil</button>
      <button class="pill-toggle" data-v="1" type="button">Sabit</button>
    </div>
    <div class="detail-block-label" style="margin-top:var(--space-5);">Durum</div>
    <div class="pill-row" id="cfg-active">
      <button class="pill-toggle" data-v="1" type="button">Aktif</button>
      <button class="pill-toggle" data-v="0" type="button">Pasif</button>
    </div>
    <button class="btn btn-primary" id="cfg-add" type="button" style="margin-top:var(--space-6);">Alışkanlığıma Ekle</button>
  `;

  openSheet({
    title: "Alışkanlık Ekle",
    bodyHtml,
    onMount: (body, close) => {
      const syncFixed = () => body.querySelectorAll("#cfg-fixed .pill-toggle").forEach((b) => b.classList.toggle("active", b.dataset.v === String(isFixed ? 1 : 0)));
      const syncActive = () => body.querySelectorAll("#cfg-active .pill-toggle").forEach((b) => b.classList.toggle("active", b.dataset.v === String(isActive ? 1 : 0)));
      syncFixed();
      syncActive();
      body.querySelectorAll("#cfg-fixed .pill-toggle").forEach((b) => b.addEventListener("click", () => { isFixed = b.dataset.v === "1"; syncFixed(); }));
      body.querySelectorAll("#cfg-active .pill-toggle").forEach((b) => b.addEventListener("click", () => { isActive = b.dataset.v === "1"; syncActive(); }));
      body.querySelector("#cfg-add").addEventListener("click", () => {
        addHabit({ name, category, source, isFixed, isActive });
        close();
        showToast("Alışkanlık eklendi");
        navigate("/habits");
      });
    },
  });
}

function openCustomSheet() {
  const bodyHtml = `
    <div class="field">
      <label class="field-label" for="custom-name">Alışkanlık adı</label>
      <input class="input" id="custom-name" type="text" maxlength="60" placeholder="Örn. Günlük dil pratiği" />
    </div>
    <div class="detail-block-label" style="margin-top:var(--space-5);">Tür</div>
    <div class="pill-row" id="cfg-fixed">
      <button class="pill-toggle" data-v="0" type="button">Sabit değil</button>
      <button class="pill-toggle" data-v="1" type="button">Sabit</button>
    </div>
    <div class="detail-block-label" style="margin-top:var(--space-5);">Durum</div>
    <div class="pill-row" id="cfg-active">
      <button class="pill-toggle" data-v="1" type="button">Aktif</button>
      <button class="pill-toggle" data-v="0" type="button">Pasif</button>
    </div>
    <button class="btn btn-primary" id="cfg-add" type="button" style="margin-top:var(--space-6);" disabled>Alışkanlığı Ekle</button>
  `;

  openSheet({
    title: "Kendi Alışkanlığını Oluştur",
    bodyHtml,
    onMount: (body, close) => {
      let isFixed = false;
      let isActive = true;
      const nameInput = body.querySelector("#custom-name");
      const addBtn = body.querySelector("#cfg-add");
      const syncFixed = () => body.querySelectorAll("#cfg-fixed .pill-toggle").forEach((b) => b.classList.toggle("active", b.dataset.v === String(isFixed ? 1 : 0)));
      const syncActive = () => body.querySelectorAll("#cfg-active .pill-toggle").forEach((b) => b.classList.toggle("active", b.dataset.v === String(isActive ? 1 : 0)));
      syncFixed();
      syncActive();
      nameInput.focus();
      nameInput.addEventListener("input", () => { addBtn.disabled = !nameInput.value.trim(); });
      body.querySelectorAll("#cfg-fixed .pill-toggle").forEach((b) => b.addEventListener("click", () => { isFixed = b.dataset.v === "1"; syncFixed(); }));
      body.querySelectorAll("#cfg-active .pill-toggle").forEach((b) => b.addEventListener("click", () => { isActive = b.dataset.v === "1"; syncActive(); }));
      addBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) return;
        addHabit({ name, category: null, source: "custom", isFixed, isActive });
        close();
        showToast("Alışkanlık eklendi");
        navigate("/habits");
      });
    },
  });
}

function filteredLibrary() {
  const q = query.trim().toLowerCase();
  return HABIT_LIBRARY.filter((h) => {
    const matchesCategory = activeCategory === "Tümü" || h.category === activeCategory;
    const matchesQuery = !q || h.name.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

function renderList(listEl) {
  const items = filteredLibrary();
  if (items.length === 0) {
    listEl.innerHTML = `<div class="empty-state">${icons.search}<div>Aramanızla eşleşen alışkanlık bulunamadı.</div></div>`;
    return;
  }

  if (activeCategory !== "Tümü") {
    listEl.innerHTML = items.map((h) => libItemHtml(h)).join("");
  } else {
    const groups = CATEGORIES.map((cat) => ({ cat, items: items.filter((h) => h.category === cat) })).filter((g) => g.items.length);
    listEl.innerHTML = groups
      .map((g) => `<div class="lib-category-title">${esc(g.cat)}</div>${g.items.map((h) => libItemHtml(h)).join("")}`)
      .join("");
  }

  listEl.querySelectorAll("[data-lib-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lib = HABIT_LIBRARY.find((h) => h.id === btn.dataset.libId);
      if (!lib || isAlreadyAdded(lib.name)) return;
      openConfigureSheet({ name: lib.name, category: lib.category, source: "library" });
    });
  });
}

function libItemHtml(h) {
  const added = isAlreadyAdded(h.name);
  return `
    <div class="lib-item ${added ? "added" : ""}">
      <span class="lib-item-name">${esc(h.name)}</span>
      <button class="lib-item-add ${added ? "added-icon" : ""}" type="button" data-lib-id="${h.id}" ${added ? "disabled" : ""} aria-label="Ekle">
        ${added ? icons.check : icons.plus}
      </button>
    </div>`;
}

export function render(container) {
  container.innerHTML = `
    <div class="screen-enter">
      <div class="top-header">
        <div class="top-header-row">
          <button class="back-btn" id="back-btn" type="button">${icons.chevronLeft}</button>
          <h1 class="card-title" style="font-size:19px;">Alışkanlık Ekle</h1>
          <span style="width:36px;"></span>
        </div>
      </div>

      <div class="search-input-wrap">
        ${icons.search}
        <input class="input" id="search-input" type="text" placeholder="Alışkanlık ara..." value="${esc(query)}" />
      </div>

      <button class="btn btn-secondary" id="custom-btn" type="button" style="margin-top:var(--space-4);">
        ${icons.plus} Kendi Alışkanlığını Oluştur
      </button>

      <div class="section">
        <div class="section-head"><span class="section-title">Hazır Alışkanlıklar</span></div>
        <div class="chip-row" id="chip-row">
          <button class="chip ${activeCategory === "Tümü" ? "active" : ""}" data-cat="Tümü" type="button">Tümü</button>
          ${CATEGORIES.map((c) => `<button class="chip ${activeCategory === c ? "active" : ""}" data-cat="${esc(c)}" type="button">${esc(c)}</button>`).join("")}
        </div>
        <div id="lib-list" style="margin-top:var(--space-4);"></div>
      </div>
    </div>
  `;

  const listEl = container.querySelector("#lib-list");
  renderList(listEl);

  container.querySelector("#back-btn").addEventListener("click", () => navigate("/habits"));
  container.querySelector("#custom-btn").addEventListener("click", openCustomSheet);

  container.querySelector("#search-input").addEventListener("input", (e) => {
    query = e.target.value;
    renderList(listEl);
  });

  container.querySelectorAll("#chip-row .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.cat;
      container.querySelectorAll("#chip-row .chip").forEach((c) => c.classList.toggle("active", c === chip));
      renderList(listEl);
    });
  });
}
