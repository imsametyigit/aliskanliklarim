import { getState } from "./store.js";
import { todayStr, startOfWeek, startOfMonth, eachDateInRange, compareDateStr } from "./date.js";
import { pct } from "./util.js";

/** Bir alışkanlık (Sabit), belirtilen tarihte otomatik olarak günün listesine dahil mi? */
export function isFixedPlannedOnDate(habit, date) {
  if (!habit.isFixed) return false;
  const createdDate = habit.createdAt.slice(0, 10);
  if (compareDateStr(createdDate, date) > 0) return false;
  if (habit.archivedAt && compareDateStr(habit.archivedAt.slice(0, 10), date) <= 0) return false;
  if (!habit.isActive) return false;
  return true;
}

/**
 * Belirli bir günün alışkanlık girişlerini döndürür.
 * { habit, completed, dailyHabitId, source } listesi — sabitler önce, sonra manuel eklenenler.
 */
export function getDayEntries(date) {
  const state = getState();
  const byId = Object.fromEntries(state.habits.map((h) => [h.id, h]));
  const fixed = state.habits
    .filter((h) => isFixedPlannedOnDate(h, date))
    .map((h) => {
      const rec = state.dailyHabits.find((dh) => dh.habitId === h.id && dh.date === date);
      return { habit: h, completed: !!rec?.completed, dailyHabitId: rec?.id || null, source: "fixed" };
    });

  const manual = state.dailyHabits
    .filter((dh) => dh.date === date && dh.source === "manual")
    .map((dh) => ({
      habit: byId[dh.habitId],
      completed: dh.completed,
      dailyHabitId: dh.id,
      source: "manual",
    }))
    .filter((e) => e.habit);

  return { fixed, manual };
}

export function getDailyProgress(date) {
  const { fixed, manual } = getDayEntries(date);
  const all = [...fixed, ...manual];
  const completed = all.filter((e) => e.completed).length;
  const total = all.length;
  return { completed, total, percent: pct(completed, total) };
}

export function getWeekRange(refDate = todayStr()) {
  const start = startOfWeek(refDate);
  const today = todayStr();
  const cappedEnd = compareDateStr(refDate, today) >= 0 ? today : refDate;
  return { start, end: compareDateStr(cappedEnd, start) < 0 ? start : cappedEnd };
}

export function getMonthRange(refDate = todayStr()) {
  const start = startOfMonth(refDate);
  const today = todayStr();
  const cappedEnd = compareDateStr(refDate, today) >= 0 ? today : refDate;
  return { start, end: compareDateStr(cappedEnd, start) < 0 ? start : cappedEnd };
}

export function getPeriodRange(period, refDate = todayStr()) {
  if (period === "today") return { start: refDate, end: refDate };
  if (period === "week") return getWeekRange(refDate);
  return getMonthRange(refDate);
}

/** Genel dönem başarı yüzdesi (tüm alışkanlıklar toplamı) */
export function getPeriodStats(period, refDate = todayStr()) {
  const { start, end } = getPeriodRange(period, refDate);
  const days = eachDateInRange(start, end).filter((d) => compareDateStr(d, todayStr()) <= 0);
  let completed = 0;
  let total = 0;
  days.forEach((d) => {
    const p = getDailyProgress(d);
    completed += p.completed;
    total += p.total;
  });
  return { completed, total, percent: pct(completed, total) };
}

/** Aktif alışkanlıkların, verilen dönemdeki tekil başarı yüzdesi */
export function getHabitPerformance(period, refDate = todayStr()) {
  const state = getState();
  const { start, end } = getPeriodRange(period, refDate);
  const days = eachDateInRange(start, end).filter((d) => compareDateStr(d, todayStr()) <= 0);

  const activeHabits = state.habits.filter((h) => h.isActive);
  const results = activeHabits.map((h) => {
    let completed = 0;
    let total = 0;
    days.forEach((d) => {
      if (h.isFixed) {
        if (isFixedPlannedOnDate(h, d)) {
          total++;
          const rec = state.dailyHabits.find((dh) => dh.habitId === h.id && dh.date === d);
          if (rec?.completed) completed++;
        }
      } else {
        const rec = state.dailyHabits.find((dh) => dh.habitId === h.id && dh.date === d);
        if (rec) {
          total++;
          if (rec.completed) completed++;
        }
      }
    });
    return { habit: h, completed, total, percent: pct(completed, total) };
  });

  return results.filter((r) => r.total > 0).sort((a, b) => b.percent - a.percent);
}

/** Takvim günü göstergesi: 'none' | 'future' | 'zero' | 'low' | 'partial' | 'full' */
export function getCalendarDayStatus(date) {
  if (compareDateStr(date, todayStr()) > 0) return "future";
  const { completed, total, percent } = getDailyProgress(date);
  if (total === 0) return "none";
  if (percent === 100) return "full";
  if (percent >= 40) return "partial";
  return "low";
}

export function getTotalCompletedAllTime() {
  const state = getState();
  return state.dailyHabits.filter((dh) => dh.completed).length;
}

export function getOverallSuccessRate() {
  const state = getState();
  const dates = Array.from(new Set(state.dailyHabits.map((dh) => dh.date)));
  let completed = 0;
  let total = 0;
  dates.forEach((d) => {
    const p = getDailyProgress(d);
    completed += p.completed;
    total += p.total;
  });
  return pct(completed, total);
}
