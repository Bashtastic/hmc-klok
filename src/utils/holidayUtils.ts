// holidays.ts – Dutch public‑holiday helper
//------------------------------------------------------------
//  Meeus/Jones/Butcher algorithm for calculating Easter
//------------------------------------------------------------
const calculateEaster = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // March = 3, April = 4 (1‑based)
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day); // JS Date month is 0‑based
};

//------------------------------------------------------------
//  Small utilities
//------------------------------------------------------------
/** Returns a new Date that is `days` days offset from `date` */
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/** Checks if two Date objects represent the same calendar day */
const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth()    === d2.getMonth()    &&
  d1.getDate()     === d2.getDate();

/** Returns the date of the nth (1‑based) occurrence of a given weekday (0 = Sunday) in a month */
const nthWeekdayOfMonth = (year: number, month: number, weekday: number, nth: number): Date => {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekdayOffset = (7 + weekday - firstOfMonth.getDay()) % 7;
  const date = 1 + firstWeekdayOffset + 7 * (nth - 1);
  return new Date(year, month, date);
};

//------------------------------------------------------------
//  Main API
//------------------------------------------------------------
/**
 * Returns the Dutch public/commemorative holiday for the given date, if any.
 *
 * Implements:
 *  • Fixed‑date holidays (Christmas, Liberation Day, etc.)
 *  • Koningsdag (27 April, shifted to 26 April when the 27th is a Sunday)
 *  • Moederdag (tweede zondag in mei) en Vaderdag (derde zondag in juni)
 *  • Easter‑dependent holidays via the Meeus/Jones/Butcher algorithm
 *
 * @param date – Date to check (local time zone)
 * @returns Holiday name or `null` when none applies
 */
export const getHolidayName = (date: Date): string | null => {
  const day   = date.getDate();      // 1‑31
  const month = date.getMonth();     // 0‑based (0 = January)
  const year  = date.getFullYear();

  //----------------------------------------------------------
  //  Fixed‑date holidays
  //----------------------------------------------------------
  if (day === 1  && month === 1)  return "watersnoodramp - 1953";    // 1 Feb – example commemorative date
  if (day === 5  && month === 4)  return "Bevrijdingsdag 🇳🇱";        // 5 May
  if (day === 22 && month === 3)  return "World Earth Day 🌍";        // 22 April
  if (day === 25 && month === 11) return "1ᵉ Kerstdag 🎄";             // 25 Dec
  if (day === 26 && month === 11) return "2ᵉ Kerstdag 🎄";             // 26 Dec

  //----------------------------------------------------------
  //  Koningsdag – 27 April (or 26 April if 27th is a Sunday)
  //----------------------------------------------------------
  const kingsDay       = new Date(year, 3, 27); // 27 Apr (month index 3)
  const observedIs26th = kingsDay.getDay() === 0; // 0 = Sunday
  if ((observedIs26th && month === 3 && day === 26) ||
      (!observedIs26th && month === 3 && day === 27)) {
    return "Koningsdag 👑🇳🇱";
  }

  //----------------------------------------------------------
  //  Moederdag – tweede zondag in mei
  //  Vaderdag  – derde zondag in juni
  //----------------------------------------------------------
  const mothersDay = nthWeekdayOfMonth(year, 4, 0, 2); // May is month 4
  const fathersDay = nthWeekdayOfMonth(year, 5, 0, 3); // June is month 5

  if (isSameDay(date, mothersDay)) return "Moederdag 💐";
  if (isSameDay(date, fathersDay)) return "Vaderdag 🛠️";

  //----------------------------------------------------------
  //  Easter‑based moveable feasts
  //----------------------------------------------------------
  const easterSunday     = calculateEaster(year);
  const goodFriday       = addDays(easterSunday, -2);
  const easterMonday     = addDays(easterSunday, 1);
  const ascensionDay     = addDays(easterSunday, 39);
  const pentecostSunday  = addDays(easterSunday, 49);
  const pentecostMonday  = addDays(easterSunday, 50);

  if (isSameDay(date, goodFriday))      return "Goede Vrijdag ✝️";
  if (isSameDay(date, easterSunday))    return "1ᵉ Paasdag";
  if (isSameDay(date, easterMonday))    return "2ᵉ Paasdag";
  if (isSameDay(date, ascensionDay))    return "Hemelvaartsdag ☁️";
  if (isSameDay(date, pentecostSunday)) return "1ᵉ Pinksterdag 🔥";
  if (isSameDay(date, pentecostMonday)) return "2ᵉ Pinksterdag 🔥";

  //----------------------------------------------------------
  //  No holiday – return null
  //----------------------------------------------------------
  return null;
};
