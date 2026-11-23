import { describe, expect, it } from 'vitest';
import { compact, initials, money, signed } from './format';
import { niceMax, smoothPath } from './geometry';
import { parseRoute } from './router';
import { paginate, sortRows, toCsv } from './table';

describe('format', () => {
  it('formats money, compact numbers and signed percentages', () => {
    expect(money(1234)).toBe('$1,234');
    expect(compact(12500)).toBe('12.5K');
    expect(signed(3.14)).toBe('+3.1%');
    expect(signed(-2)).toBe('-2.0%');
  });
  it('builds initials from the first two words', () => {
    expect(initials('ada lovelace byron')).toBe('AL');
    expect(initials('Grace')).toBe('G');
  });
});

describe('geometry', () => {
  it('rounds the axis maximum up to a nice value', () => {
    expect(niceMax(61000)).toBe(80000);
    expect(niceMax(100)).toBe(100);
    expect(niceMax(0)).toBe(1);
  });
  it('builds a smooth path through every point', () => {
    const d = smoothPath([[0, 0], [10, 10], [20, 0]]);
    expect(d.startsWith('M0.0,0.0')).toBe(true);
    expect(d.match(/C/g)).toHaveLength(2);
    expect(smoothPath([])).toBe('');
  });
});

describe('table', () => {
  const rows = [{ n: 'b', v: 2 }, { n: 'a', v: 10 }, { n: 'C', v: 1 }];
  it('sorts numbers numerically and text case-insensitively', () => {
    expect(sortRows(rows, (r) => r.v, 'desc').map((r) => r.n)).toEqual(['a', 'b', 'C']);
    expect(sortRows(rows, (r) => r.n, 'asc').map((r) => r.n)).toEqual(['a', 'b', 'C']);
  });
  it('does not mutate the input', () => {
    const copy = [...rows];
    sortRows(rows, (r) => r.v, 'asc');
    expect(rows).toEqual(copy);
  });
  it('paginates and clamps the page', () => {
    const p = paginate([1, 2, 3, 4, 5], 9, 2);
    expect(p).toMatchObject({ items: [5], page: 2, pageCount: 3, from: 5, to: 5 });
    expect(paginate([], 0, 5)).toMatchObject({ pageCount: 1, from: 0, to: 0 });
  });
  it('escapes CSV cells', () => {
    expect(toCsv([['a,b', 'say "hi"', 3]])).toBe('"a,b","say ""hi""",3');
  });
});

describe('router', () => {
  it('falls back to overview for unknown hashes', () => {
    expect(parseRoute('#/customers')).toBe('customers');
    expect(parseRoute('#settings')).toBe('settings');
    expect(parseRoute('#/nope')).toBe('overview');
    expect(parseRoute('')).toBe('overview');
  });
});
