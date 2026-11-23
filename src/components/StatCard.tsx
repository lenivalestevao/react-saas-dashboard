import { Icon } from './ui';
import { Sparkline } from './charts';
import { signed } from '../lib/format';

interface Props {
  label: string;
  value: string;
  delta: number;
  /** When true, a falling number is good news (e.g. churn). */
  invert?: boolean;
  spark: readonly number[];
}

export function StatCard({ label, value, delta, invert = false, spark }: Props) {
  const good = invert ? delta <= 0 : delta >= 0;
  return (
    <article className="card stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <div className="stat-foot">
        <span className={`delta ${good ? 'good' : 'bad'}`}>
          <Icon name={delta >= 0 ? 'up' : 'down'} size={14} />
          {signed(delta)}
        </span>
        <span className="muted">vs last period</span>
      </div>
      <div className={`stat-spark ${good ? 'good' : 'bad'}`}>
        <Sparkline values={spark} />
      </div>
    </article>
  );
}
