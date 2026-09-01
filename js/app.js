import { init, subscribe, getState } from "./lib/store.js";
import { applyTheme } from "./lib/theme.js";
import { startRouter, onRoute, currentRoute } from "./router.js";
import { renderBottomNav } from "./components/bottomNav.js";

import * as TodayScreen from "./screens/today.js";
import * as CalendarScreen from "./screens/calendar.js";
import * as HabitsScreen from "./screens/habits.js";
import * as HabitDetailScreen from "./screens/habitDetail.js";
import * as AddHabitScreen from "./screens/addHabit.js";
import * as StatsScreen from "./screens/stats.js";
import * as ProfileScreen from "./screens/profile.js";
import * as SettingsScreen from "./screens/settings.js";
import * as ReflectionScreen from "./screens/reflection.js";

const NAV_TAB_FOR_SCREEN = {
  today: "today",
  calendar: "calendar",
  habits: "habits",
  "add-habit": "habits",
  stats: "stats",
  profile: "profile",
  settings: "profile",
  reflection: null,
};

function resolveScreen(route) {
  if (route.screen === "habits" && route.params.length) return HabitDetailScreen;
  switch (route.screen) {
    case "today": return TodayScreen;
    case "calendar": return CalendarScreen;
    case "habits": return HabitsScreen;
    case "add-habit": return AddHabitScreen;
    case "stats": return StatsScreen;
    case "profile": return ProfileScreen;
    case "settings": return SettingsScreen;
    case "reflection": return ReflectionScreen;
    default: return TodayScreen;
  }
}

const screenEl = document.getElementById("screen");

function render() {
  applyTheme(getState().user.settings.theme);
  const route = currentRoute();
  const mod = resolveScreen(route);
  mod.render(screenEl, route.params);
  renderBottomNav(NAV_TAB_FOR_SCREEN[route.screen] ?? null);
  screenEl.scrollTop = 0;
}

function boot() {
  init();
  subscribe(render);
  onRoute(render);
  startRouter();
}

boot();
