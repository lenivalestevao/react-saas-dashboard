export type Point = readonly [number, number];

const STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

/** Rounds a maximum up to a "nice" axis value, e.g. 61000 -> 80000. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const n = value / magnitude;
  const step = STEPS.find((s) => s >= n) ?? 10;
  return step * magnitude;
}

/** Catmull-Rom spline converted to a cubic Bezier SVG path. */
export function smoothPath(pts: readonly Point[]): string {
  if (pts.length === 0) return '';
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0]![0])},${f(pts[0]![1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

export const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi);
