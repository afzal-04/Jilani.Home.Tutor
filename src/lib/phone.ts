/** Normalize phone input to digits only (keeps leading + stripped). */
export function digitsOnly(phone: string): string {
  return String(phone || '').replace(/\D/g, '');
}

/** Indian mobile: last 10 digits, or 12 starting with 91. */
export function isValidIndianMobile(phone: string): boolean {
  const d = digitsOnly(phone);
  if (d.length === 10) return /^[6-9]/.test(d);
  if (d.length === 12 && d.startsWith('91')) return /^[6-9]/.test(d.slice(2));
  return false;
}

export function cleanPhoneForStorage(phone: string): string {
  const d = digitsOnly(phone);
  if (d.length === 12 && d.startsWith('91')) return d.slice(2);
  return d;
}
