/**
 * Utility functions for detecting and displaying DST (Daylight Saving Time) transitions in the Netherlands
 */

/**
 * Get the last Sunday of a given month
 */
function getLastSundayOfMonth(year: number, month: number): Date {
  // Start with the last day of the month
  const lastDay = new Date(year, month + 1, 0);
  const lastDayOfWeek = lastDay.getDay();
  
  // Calculate how many days to subtract to get to Sunday (0)
  const daysToSubtract = lastDayOfWeek === 0 ? 0 : lastDayOfWeek;
  
  return new Date(year, month, lastDay.getDate() - daysToSubtract);
}

/**
 * Get the DST transition dates for a given year in the Netherlands
 * - Spring: Last Sunday of March at 02:00 → 03:00 (clocks go forward)
 * - Autumn: Last Sunday of October at 03:00 → 02:00 (clocks go back)
 */
function getDSTTransitionDates(year: number): { spring: Date; autumn: Date } {
  return {
    spring: getLastSundayOfMonth(year, 2), // March (0-indexed)
    autumn: getLastSundayOfMonth(year, 9), // October (0-indexed)
  };
}

/**
 * Check if the given date is in a DST transition week
 * Returns the transition type if in transition week, null otherwise
 */
export function isInDSTTransitionWeek(date: Date): { inWeek: boolean; isSpring: boolean } | null {
  const year = date.getFullYear();
  const transitions = getDSTTransitionDates(year);
  
  // Get Monday of the current week
  const dayOfWeek = date.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  
  // Get Sunday of the current week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  // Check if spring transition falls in this week
  if (transitions.spring >= monday && transitions.spring <= sunday) {
    return { inWeek: true, isSpring: true };
  }
  
  // Check if autumn transition falls in this week
  if (transitions.autumn >= monday && transitions.autumn <= sunday) {
    return { inWeek: true, isSpring: false };
  }
  
  return null;
}

/**
 * Get the DST transition message for the current date
 * Returns null if not in a transition week
 */
export function getDSTTransitionMessage(date: Date): string | null {
  const transitionInfo = isInDSTTransitionWeek(date);
  
  if (!transitionInfo) {
    return null;
  }
  
  if (transitionInfo.isSpring) {
    return "Dit weekend gaat de zomertijd in";
  } else {
    return "Dit weekend gaat de wintertijd in";
  }
}
