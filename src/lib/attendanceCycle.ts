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

/** Finds whichever start-date-anchored cycle contains "today" for one class. */
export function getCurrentCycle(startDateStr: string, today: Date): { startStr: string; endStr: string; label: string } {
  if (!startDateStr) {
    const s = new Date(today.getFullYear(), today.getMonth(), 1);
    const e = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return { startStr: toDateStr(s), endStr: toDateStr(e), label: today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) };
  }
  const start = new Date(startDateStr);
  let cycleStart = new Date(start);
  while (true) {
    const next = new Date(cycleStart);
    next.setMonth(next.getMonth() + 1);
    if (next > today) break;
    cycleStart = next;
  }
  const cycleEnd = new Date(cycleStart);
  cycleEnd.setMonth(cycleEnd.getMonth() + 1);
  const startStr = toDateStr(cycleStart);
  const endStr = toDateStr(cycleEnd);
  return { startStr, endStr, label: formatCycleLabel(startStr, endStr) };
}