// src/lib/attendanceCycle.ts
//
// Shared by /api/attendance/history and /api/parent-attendance/report.
// A class's "monthly" attendance window is anchored to its actual tuition
// start date, not the calendar month — e.g. a class starting 26 Aug runs
// 26 Aug–25 Sep, 26 Sep–25 Oct, etc., not the 1st–30th of whatever the
// current calendar month happens to be.

export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatCycleLabel(startStr: string, endStrExclusive: string): string {
  const s = new Date(startStr);
  const eInclusive = new Date(endStrExclusive);
  eInclusive.setDate(eInclusive.getDate() - 1); // last actual day of the cycle, for display
  const sLabel = s.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const eLabel = eInclusive.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${sLabel} – ${eLabel}`;
}

/**
 * Returns the current cycle for an assignment.
 * As requested: The current billing cycle continues until the assignment status changes
 * to completed. Once completed, a new cycle will start based on the new assignment.
 * Therefore, we do NOT automatically advance the cycle by 1 month every 30 days.
 * The cycle starts on the assignment's startDate, and endStr for database querying extends
 * to cover all ongoing sessions until the assignment is completed.
 */
export function getCurrentCycle(startDateStr: string, today: Date): { startStr: string; endStr: string; label: string } {
  if (!startDateStr) {
    const s = new Date(today.getFullYear(), today.getMonth(), 1);
    const e = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return { startStr: toDateStr(s), endStr: toDateStr(e), label: today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) };
  }
  const start = new Date(startDateStr);
  const nominalEnd = new Date(start);
  nominalEnd.setMonth(nominalEnd.getMonth() + 1);

  const startStr = toDateStr(start);
  const nominalEndStr = toDateStr(nominalEnd);

  // For querying: keep the current billing cycle active and continuing so any sessions
  // conducted while this assignment is active are never cut off.
  const queryEnd = new Date(Math.max(nominalEnd.getTime(), today.getTime() + 86400000 * 60));
  const endStr = toDateStr(queryEnd);

  return { startStr, endStr, label: formatCycleLabel(startStr, nominalEndStr) };
}