import { AreaChart, Donut } from '../components/charts';
import { DataTable, type Column } from '../components/DataTable';
import { StatCard } from '../components/StatCard';
import { Avatar, Badge, Card } from '../components/ui';
import { activity, activeUsers, customers, MONTHS, revenue, sparkChurn, sparkConversion, sparkRevenue, sparkUsers, trafficSources, type Customer } from '../data/mock';
import { money, moneyCompact } from '../lib/format';

const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
const change = (now: number, before: number) => ((now - before) / before) * 100;

const topColumns: Column<Customer>[] = [
  {
    key: 'name',
    header: 'Customer',
    sort: (c) => c.name,
    render: (c) => (
      <div className="who">
        <Avatar name={c.name} />
        <div>
          <strong>{c.name}</strong>
          <span className="muted">{c.email}</span>
        </div>
      </div>
    ),
  },
  { key: 'plan', header: 'Plan', sort: (c) => c.plan, render: (c) => <Badge tone="accent">{c.plan}</Badge> },
  { key: 'mrr', header: 'MRR', align: 'right', sort: (c) => c.mrr, render: (c) => money(c.mrr) },
];

const topCustomers = [...customers].filter((c) => c.status === 'active').sort((a, b) => b.mrr - a.mrr).slice(0, 12);

export default function Overview() {
  const total = sum(revenue.current);
  const prev = sum(revenue.previous);
  return (
    <div className="stack">
      <div className="grid-4">
        <StatCard label="Revenue (YTD)" value={moneyCompact(total)} delta={change(total, prev)} spark={sparkRevenue} />
        <StatCard label="Active users" value={activeUsers[11]!.toLocaleString('en-US')} delta={change(activeUsers[11]!, activeUsers[0]!)} spark={sparkUsers} />
        <StatCard label="Conversion" value="4.4%" delta={12.8} spark={sparkConversion} />
        <StatCard label="Churn" value="2.2%" delta={-8.3} invert spark={sparkChurn} />
      </div>

      <div className="grid-main">
        <Card title="Revenue" action={<span className="legend"><i className="lg lg-a" />This year<i className="lg lg-b" />Last year</span>}>
          <AreaChart
            labels={MONTHS}
            format={moneyCompact}
            series={[
              { name: 'This year', values: revenue.current, tone: 'a' },
              { name: 'Last year', values: revenue.previous, tone: 'b' },
            ]}
          />
        </Card>
        <Card title="Traffic sources">
          <div className="donut-row">
            <Donut data={trafficSources} centerLabel="of visits" />
            <ul className="legend-list">
              {trafficSources.map((s) => (
                <li key={s.label}>
                  <i className="lg" style={{ background: s.color }} />
                  {s.label}
                  <strong>{s.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid-main">
        <Card title="Top customers">
          <DataTable rows={topCustomers} columns={topColumns} rowKey={(c) => c.id} pageSize={5} initialSort={{ key: 'mrr', dir: 'desc' }} />
        </Card>
        <Card title="Recent activity">
          <ul className="feed">
            {activity.map((a) => (
              <li key={a.who}>
                <Avatar name={a.who} size={36} />
                <div>
                  <p>
                    <strong>{a.who}</strong> {a.what}
                  </p>
                  <span className="muted">{a.when}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
