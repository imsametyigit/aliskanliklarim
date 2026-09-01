import { icons } from "../lib/icons.js";
import { navigate } from "../router.js";

const TABS = [
  { key: "today", label: "Bugün", icon: "today" },
  { key: "calendar", label: "Takvim", icon: "calendar" },
  { key: "habits", label: "Alışkanlıklarım", icon: "habits" },
  { key: "stats", label: "İstatistik", icon: "stats" },
  { key: "profile", label: "Profil", icon: "profile" },
];

export function renderBottomNav(activeScreen) {
  const nav = document.getElementById("bottom-nav");
  const activeKey = TABS.some((t) => t.key === activeScreen) ? activeScreen : null;
  nav.innerHTML = TABS.map(
    (t) => `
    <button class="nav-item ${t.key === activeKey ? "active" : ""}" data-tab="${t.key}" type="button">
      ${icons[t.icon]}
      <span>${t.label}</span>
    </button>`
  ).join("");

  nav.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => navigate(`/${btn.dataset.tab}`));
  });
}

export const NAV_SCREENS = TABS.map((t) => t.key);
