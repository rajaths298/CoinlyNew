// Local-calendar day keys for streak / daily-goal logic.
//
// Keys are 'YYYY-MM-DD' derived from the device's LOCAL date — never
// toISOString(), which uses UTC and flips to "tomorrow" at 4-8pm for users in
// the Americas (wrong "studied today" answers, double streak increments).

export function getLocalDayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDayKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  // new Date(y, m-1, d) is local midnight; new Date('YYYY-MM-DD') would parse as UTC.
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function isConsecutiveDayKey(prev: string, curr: string): boolean {
  const prevDate = parseDayKey(prev);
  const currDate = parseDayKey(curr);
  if (!prevDate || !currDate) return false;
  // Compare calendar days, not elapsed ms — DST days are 23/25 hours long.
  const next = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() + 1);
  return next.getTime() === currDate.getTime();
}
