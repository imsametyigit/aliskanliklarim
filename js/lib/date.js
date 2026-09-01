// Türkçe tarih yardımcıları — bağımlılık yok, yerel tarih (saat dilimi kaymasız) mantığıyla çalışır.

export const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export const GUNLER_UZUN = [
  "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar",
];

export const GUNLER_KISA = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function pad(n) { return String(n).padStart(2, "0"); }

/** Date -> "YYYY-MM-DD" (yerel saat, UTC kaymasız) */
export function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "YYYY-MM-DD" -> Date (yerel saat, 00:00) */
export function fromDateStr(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayStr() {
  return toDateStr(new Date());
}

/** Pazartesi=0 ... Pazar=6 döner */
function isoDow(d) {
  return (d.getDay() + 6) % 7;
}

export function formatLong(dateStr, withWeekday = true) {
  const d = fromDateStr(dateStr);
  const base = `${d.getDate()} ${AYLAR[d.getMonth()]} ${d.getFullYear()}`;
  return withWeekday ? `${base}, ${GUNLER_UZUN[isoDow(d)]}` : base;
}

export function formatShort(dateStr) {
  const d = fromDateStr(dateStr);
  return `${d.getDate()} ${AYLAR[d.getMonth()]}`;
}

export function formatMonthYear(year, monthIndex) {
  return `${AYLAR[monthIndex]} ${year}`;
}

export function addDays(dateStr, n) {
  const d = fromDateStr(dateStr);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function addMonths(year, monthIndex, delta) {
  const d = new Date(year, monthIndex + delta, 1);
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}

export function compareDateStr(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isFutureDate(dateStr) {
  return compareDateStr(dateStr, todayStr()) > 0;
}

export function isToday(dateStr) {
  return dateStr === todayStr();
}

/** Pazartesi başlangıçlı, o tarihi içeren haftanın Pazartesi tarihi */
export function startOfWeek(dateStr) {
  const d = fromDateStr(dateStr);
  const dow = isoDow(d);
  d.setDate(d.getDate() - dow);
  return toDateStr(d);
}

export function startOfMonth(dateStr) {
  const d = fromDateStr(dateStr);
  return toDateStr(new Date(d.getFullYear(), d.getMonth(), 1));
}

/** [startInclusive, endInclusive] içindeki tüm "YYYY-MM-DD" günlerini döndürür */
export function eachDateInRange(startStr, endStr) {
  const out = [];
  let cur = startStr;
  while (compareDateStr(cur, endStr) <= 0) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

/**
 * Takvim ızgarası: Pazartesi başlangıçlı, 6 satırlık (42 hücre) matris.
 * Her hücre { dateStr, inMonth } içerir.
 */
export function buildMonthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const firstDow = isoDow(first);
  const gridStart = new Date(year, monthIndex, 1 - firstDow);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push({
      dateStr: toDateStr(d),
      inMonth: d.getMonth() === monthIndex,
    });
  }
  return cells;
}
