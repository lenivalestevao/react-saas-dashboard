import { useState } from 'react';
import { AreaChart, BarChart } from '../components/charts';
import { Card } from '../components/ui';
import { activeUsers, funnel, MONTHS, signups } from '../data/mock';
import { compact, percent } from '../lib/format';

const RANGES = [
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '12M', months: 12 },
] as const;

export default function Analytics() {
  const [months, setMonths] = useState<number>(12);
  const labels = MONTHS.slice(-months);

  return (
    <div className="stack">
      <div className="toolbar">
        <div className="chips" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button key={r.label} type="button" className={`chip ${months === r.months ? 'on' : ''}`} aria-pressed={months === r.months} onClick={() => setMonths(r.months)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-main">
        <Card title="Active users">
          <AreaChart labels={labels} series={[{ name: 'Active users', values: activeUsers.slice(-months), tone: 'a' }]} />
        </Card>
        <Card title="New sign-ups">
          <BarChart labels={labels} values={signups.slice(-months)} />
        </Card>
      </div>

      <Card title="Conversion funnel">
        <ul className="funnel">
          {funnel.map((step, i) => {
            const width = (step.value / funnel[0]!.value) * 100;
            const rate = i === 0 ? null : (step.value / funnel[i - 1]!.value) * 100;
            return (
              <li key={step.label}>
                <div className="funnel-meta">
                  <strong>{step.label}</strong>
                  <span className="muted">
                    {compact(step.value)}
                    {rate !== null && ` · ${percent(rate)} of previous step`}
                  </span>
                </div>
                <div className="funnel-track">
                  <div className="funnel-bar" style={{ width: `${Math.max(width, 2)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
