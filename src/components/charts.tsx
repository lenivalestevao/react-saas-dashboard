import { useId, useState, type MouseEvent } from 'react';
import { clamp, niceMax, smoothPath, type Point } from '../lib/geometry';
import { compact } from '../lib/format';

export interface Series {
  name: string;
  values: readonly number[];
  tone: 'a' | 'b';
}

const W = 640;
const H = 240;
const PAD = { l: 46, r: 14, t: 14, b: 28 };

export function AreaChart({ labels, series, format = compact }: { labels: readonly string[]; series: readonly Series[]; format?: (n: number) => string }) {
  const gid = useId().replace(/:/g, '');
  const [hover, setHover] = useState<number | null>(null);
  const n = labels.length;
  const max = niceMax(Math.max(...series.flatMap((s) => s.values)));
  const innerW = W - PAD.l - PAD.r;
  const x = (i: number) => PAD.l + (i * innerW) / Math.max(n - 1, 1);
  const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
  const base = H - PAD.b;

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    setHover(clamp(Math.round(((px - PAD.l) / innerW) * (n - 1)), 0, n - 1));
  };

  const boxW = 120;
  const boxX = hover === null ? 0 : clamp(x(hover) - boxW / 2, PAD.l, W - PAD.r - boxW);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Line chart" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <defs>
        {series.map((s, i) => (
          <linearGradient key={s.name} id={`${gid}-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className={`stop-${s.tone}`} stopOpacity="0.28" />
            <stop offset="100%" className={`stop-${s.tone}`} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(max * f)} y2={y(max * f)} />
          <text className="axis" x={PAD.l - 8} y={y(max * f) + 4} textAnchor="end">
            {format(max * f)}
          </text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={l} className="axis" x={x(i)} y={H - 8} textAnchor="middle">
          {l}
        </text>
      ))}
      {[...series].reverse().map((s) => {
        const idx = series.indexOf(s);
        const pts: Point[] = s.values.map((v, i) => [x(i), y(v)]);
        const line = smoothPath(pts);
        return (
          <g key={s.name}>
            <path d={`${line} L${x(n - 1)},${base} L${x(0)},${base} Z`} fill={`url(#${gid}-${idx})`} />
            <path d={line} className={`line line-${s.tone}`} />
          </g>
        );
      })}
      {hover !== null && (
        <g>
          <line className="guide" x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={base} />
          {series.map((s) => (
            <circle key={s.name} className={`dot dot-${s.tone}`} cx={x(hover)} cy={y(s.values[hover]!)} r={4.5} />
          ))}
          <g transform={`translate(${boxX},${PAD.t})`}>
            <rect className="tip" width={boxW} height={22 + series.length * 16} rx={8} />
            <text className="tip-title" x={10} y={16}>
              {labels[hover]}
            </text>
            {series.map((s, i) => (
              <text key={s.name} className="tip-row" x={10} y={32 + i * 16}>
                {s.name}: {format(s.values[hover]!)}
              </text>
            ))}
          </g>
        </g>
      )}
    </svg>
  );
}

export function BarChart({ labels, values, format = compact }: { labels: readonly string[]; values: readonly number[]; format?: (n: number) => string }) {
  const max = niceMax(Math.max(...values));
  const bw = (W - PAD.l - PAD.r) / values.length;
  const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bar chart">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(max * f)} y2={y(max * f)} />
          <text className="axis" x={PAD.l - 8} y={y(max * f) + 4} textAnchor="end">
            {format(max * f)}
          </text>
        </g>
      ))}
      {values.map((v, i) => (
        <g key={labels[i]}>
          <rect className="bar" x={PAD.l + i * bw + bw * 0.2} y={y(v)} width={bw * 0.6} height={H - PAD.b - y(v)} rx={5}>
            <title>{`${labels[i]}: ${format(v)}`}</title>
          </rect>
          <text className="axis" x={PAD.l + i * bw + bw / 2} y={H - 8} textAnchor="middle">
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Donut({ data, centerLabel }: { data: readonly { label: string; value: number; color: string }[]; centerLabel: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 54;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg className="donut" viewBox="0 0 140 140" role="img" aria-label="Donut chart">
      <circle cx="70" cy="70" r={r} className="donut-track" />
      <g transform="rotate(-90 70 70)">
        {data.map((d) => {
          const len = (d.value / total) * c;
          const el = <circle key={d.label} cx="70" cy="70" r={r} className="donut-seg" style={{ stroke: d.color }} strokeDasharray={`${Math.max(len - 3, 0)} ${c - Math.max(len - 3, 0)}`} strokeDashoffset={-acc} />;
          acc += len;
          return el;
        })}
      </g>
      <text x="70" y="68" textAnchor="middle" className="donut-value">
        {total}%
      </text>
      <text x="70" y="86" textAnchor="middle" className="donut-label">
        {centerLabel}
      </text>
    </svg>
  );
}

export function Sparkline({ values }: { values: readonly number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts: Point[] = values.map((v, i) => [(i * 100) / (values.length - 1), 26 - ((v - min) / span) * 22]);
  return (
    <svg className="spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <path d={smoothPath(pts)} />
    </svg>
  );
}
