const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export const money = (n: number): string => usd.format(n);
export const compact = (n: number): string => compactNumber.format(n);
export const moneyCompact = (n: number): string => `$${compactNumber.format(n)}`;
export const percent = (n: number, digits = 1): string => `${n.toFixed(digits)}%`;
export const signed = (n: number, digits = 1): string => `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`;

export function dateShort(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}
