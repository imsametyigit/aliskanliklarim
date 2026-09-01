import { uid } from "./util.js";
import { todayStr, addDays } from "./date.js";
import { HABIT_LIBRARY, CATEGORIES } from "../data/library.js";

const STORAGE_KEY = "aliskanliklarim:v1";

let state = null;
const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  persist();
  listeners.forEach((fn) => fn(state));
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Veri kaydedilemedi", e);
  }
}

function byName(name) {
  return HABIT_LIBRARY.find((h) => h.name === name);
}

function seed() {
  const now = new Date();
  const createdAt = addDays(todayStr(), -35) + "T08:00:00.000Z";

  const user = {
    id: uid("user"),
    name: "Samet",
    profileImage: null,
    createdAt: new Date().toISOString(),
    settings: { theme: "light", notifications: true },
  };

  const fixedSeed = ["Kitap okumak", "Spor yapmak", "İngilizce çalışmak", "Meditasyon yapmak"];
  const nonFixedSeed = ["2 saat derin çalışma", "Proje üzerinde çalışmak", "Soğuk duş"];

  const habits = [];
  fixedSeed.forEach((name) => {
    const lib = byName(name);
    habits.push({
      id: uid("habit"),
      name,
      category: lib?.category || null,
      source: "library",
      isFixed: true,
      isActive: true,
      createdAt,
      updatedAt: createdAt,
      archivedAt: null,
    });
  });
  nonFixedSeed.forEach((name) => {
    const lib = byName(name);
    habits.push({
      id: uid("habit"),
      name,
      category: lib?.category || null,
      source: lib ? "library" : "custom",
      isFixed: false,
      isActive: true,
      createdAt,
      updatedAt: createdAt,
      archivedAt: null,
    });
  });

  // 35 günlük geçmiş — gerçekçi, deterministik veri üret
  const dailyHabits = [];
  const reflections = [];
  let seedRand = 42;
  const rand = () => {
    seedRand = (seedRand * 1103515245 + 12345) % 2147483648;
    return seedRand / 2147483648;
  };

  for (let i = 35; i >= 1; i--) {
    const d = addDays(todayStr(), -i);
    habits.filter((h) => h.isFixed).forEach((h, idx) => {
      const chance = 0.55 + idx * 0.08; // her alışkanlık için farklı başarı eğilimi
      if (rand() < chance) {
        dailyHabits.push({
          id: uid("dh"),
          date: d,
          habitId: h.id,
          completed: true,
          completedAt: d + "T20:00:00.000Z",
          source: "fixed",
        });
      }
    });
    // ara sıra manuel alışkanlık ekle
    if (rand() < 0.2) {
      const manual = habits.find((h) => !h.isFixed);
      if (manual) {
        dailyHabits.push({
          id: uid("dh"),
          date: d,
          habitId: manual.id,
          completed: rand() < 0.6,
          completedAt: rand() < 0.6 ? d + "T20:00:00.000Z" : null,
          source: "manual",
        });
      }
    }
    if (rand() < 0.25) {
      reflections.push({
        id: uid("ref"),
        date: d,
        content: "Bugün genel olarak verimli bir gündü. Planladığım işlerin çoğunu tamamladım.",
        createdAt: d + "T21:00:00.000Z",
        updatedAt: d + "T21:00:00.000Z",
      });
    }
  }

  state = { user, habits, dailyHabits, reflections };
  persist();
}

export function init() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
      return;
    }
  } catch (e) {
    console.error("Veri okunamadı", e);
  }
  seed();
}

export function getState() {
  return state;
}

/* ---------------- Habits ---------------- */

export function addHabit({ name, category = null, source = "custom", isFixed, isActive }) {
  const now = new Date().toISOString();
  const habit = {
    id: uid("habit"),
    name: name.trim(),
    category,
    source,
    isFixed: !!isFixed,
    isActive: isActive !== false,
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
  };
  state.habits.push(habit);
  notify();
  return habit;
}

export function updateHabit(id, patch) {
  const h = state.habits.find((x) => x.id === id);
  if (!h) return;
  Object.assign(h, patch, { updatedAt: new Date().toISOString() });
  notify();
}

export function archiveHabit(id) {
  const h = state.habits.find((x) => x.id === id);
  if (!h) return;
  h.archivedAt = new Date().toISOString();
  h.isActive = false;
  notify();
}

export function getHabit(id) {
  return state.habits.find((x) => x.id === id) || null;
}

export function isHabitAddedToday(habitId, date) {
  return state.dailyHabits.some((dh) => dh.habitId === habitId && dh.date === date);
}

/* ---------------- Daily habits (günlük kayıt) ---------------- */

export function addManualHabitToDate(habitId, date) {
  const exists = state.dailyHabits.find((dh) => dh.habitId === habitId && dh.date === date);
  if (exists) return exists;
  const rec = {
    id: uid("dh"),
    date,
    habitId,
    completed: false,
    completedAt: null,
    source: "manual",
  };
  state.dailyHabits.push(rec);
  notify();
  return rec;
}

export function removeDailyHabit(dailyHabitId) {
  state.dailyHabits = state.dailyHabits.filter((dh) => dh.id !== dailyHabitId);
  notify();
}

export function toggleDailyHabit(habitId, date) {
  const habit = getHabit(habitId);
  let rec = state.dailyHabits.find((dh) => dh.habitId === habitId && dh.date === date);
  if (rec) {
    rec.completed = !rec.completed;
    rec.completedAt = rec.completed ? new Date().toISOString() : null;
  } else {
    rec = {
      id: uid("dh"),
      date,
      habitId,
      completed: true,
      completedAt: new Date().toISOString(),
      source: habit?.isFixed ? "fixed" : "manual",
    };
    state.dailyHabits.push(rec);
  }
  notify();
  return rec;
}

/* ---------------- Reflections ---------------- */

export function getReflection(date) {
  return state.reflections.find((r) => r.date === date) || null;
}

export function saveReflection(date, content) {
  const trimmed = content.trim();
  let r = state.reflections.find((x) => x.date === date);
  if (!trimmed) {
    if (r) state.reflections = state.reflections.filter((x) => x.date !== date);
    notify();
    return null;
  }
  const now = new Date().toISOString();
  if (r) {
    r.content = trimmed;
    r.updatedAt = now;
  } else {
    r = { id: uid("ref"), date, content: trimmed, createdAt: now, updatedAt: now };
    state.reflections.push(r);
  }
  notify();
  return r;
}

/* ---------------- User / settings ---------------- */

export function updateUser(patch) {
  Object.assign(state.user, patch);
  notify();
}

export function updateSettings(patch) {
  Object.assign(state.user.settings, patch);
  notify();
}

/* ---------------- Data yönetimi ---------------- */

export function resetAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  seed();
  notify();
}

export function exportBackupJSON() {
  return JSON.stringify(state, null, 2);
}

export function exportCSV() {
  const rows = [["Tarih", "Alışkanlık", "Tür", "Tamamlandı"]];
  const byId = Object.fromEntries(state.habits.map((h) => [h.id, h]));
  state.dailyHabits
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .forEach((dh) => {
      const h = byId[dh.habitId];
      rows.push([
        dh.date,
        h ? h.name : "(silinmiş)",
        dh.source === "fixed" ? "Sabit" : "Sabit değil",
        dh.completed ? "Evet" : "Hayır",
      ]);
    });
  return rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export { HABIT_LIBRARY, CATEGORIES };
