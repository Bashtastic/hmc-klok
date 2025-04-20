
// Meeus/Jones/Butcher algorithm for calculating Easter
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
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
};

// Add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Function to get holiday name for a given date
export const getHolidayName = (date: Date): string | null => {
  const day = date.getDate();
  const month = date.getMonth(); // 0-based
  const year = date.getFullYear();
  
  // Calculate Easter Sunday for the current year
  const easterSunday = calculateEaster(year);
  const goodFriday = addDays(easterSunday, -2);
  const easterMonday = addDays(easterSunday, 1);
  const ascensionDay = addDays(easterSunday, 39);
  const pentecostSunday = addDays(easterSunday, 49);
  const pentecostMonday = addDays(easterSunday, 50);
  
  // Function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => 
    date1.getDate() === date2.getDate() && 
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
  
  // Check fixed dates
  if (day === 1 && month === 1) return "Watersnoodramp - 1953";
  if (day === 5 && month === 4) return "Bevrijdingsdag";
  if (day === 25 && month === 11) return "Eerste Kerstdag";
  if (day === 26 && month === 11) return "Tweede Kerstdag";
  
  // Check King's Day (27th April, or 26th if 27th is Sunday)
  const kingsDate = new Date(year, 3, 27);
  if (kingsDate.getDay() === 0) { // If 27th is Sunday
    if (day === 26 && month === 3) return "Koningsdag";
  } else {
    if (day === 27 && month === 3) return "Koningsdag";
  }
  
  // Check Easter-based holidays
  if (isSameDay(date, goodFriday)) return "Goede Vrijdag";
  if (isSameDay(date, easterSunday)) return "Eerste Paasdag";
  if (isSameDay(date, easterMonday)) return "Tweede Paasdag";
  if (isSameDay(date, ascensionDay)) return "Hemelvaartsdag";
  if (isSameDay(date, pentecostSunday)) return "Eerste Pinksterdag";
  if (isSameDay(date, pentecostMonday)) return "Tweede Pinksterdag";
  
  return null;
};
