export type SortDir = 'asc' | 'desc';

export function sortRows<T>(rows: readonly T[], get: (row: T) => string | number, dir: SortDir): T[] {
  const m = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = get(a);
    const y = get(b);
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * m;
    return String(x).localeCompare(String(y), undefined, { sensitivity: 'base' }) * m;
  });
}

export function paginate<T>(rows: readonly T[], page: number, size: number) {
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const p = Math.min(Math.max(page, 0), pageCount - 1);
  return {
    items: rows.slice(p * size, p * size + size),
    page: p,
    pageCount,
    total: rows.length,
    from: rows.length === 0 ? 0 : p * size + 1,
    to: Math.min(rows.length, (p + 1) * size),
  };
}

export function toCsv(rows: readonly (readonly (string | number)[])[]): string {
  const cell = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  return rows.map((r) => r.map(cell).join(',')).join('\n');
}
