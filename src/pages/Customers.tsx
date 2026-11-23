import { useMemo, useState } from 'react';
import { DataTable, type Column } from '../components/DataTable';
import { Avatar, Badge, Card, Icon, type Tone } from '../components/ui';
import { customers, type Customer, type Status } from '../data/mock';
import { dateShort, money } from '../lib/format';
import { toCsv } from '../lib/table';

const STATUS_TONE: Record<Status, Tone> = { active: 'good', trial: 'warn', churned: 'bad' };
type Filter = 'all' | Status;
const FILTERS: Filter[] = ['all', 'active', 'trial', 'churned'];

const columns: Column<Customer>[] = [
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
  { key: 'plan', header: 'Plan', sort: (c) => c.plan, render: (c) => c.plan },
  { key: 'status', header: 'Status', sort: (c) => c.status, render: (c) => <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge> },
  { key: 'mrr', header: 'MRR', align: 'right', sort: (c) => c.mrr, render: (c) => money(c.mrr) },
  { key: 'country', header: 'Country', sort: (c) => c.country, render: (c) => c.country },
  { key: 'joined', header: 'Joined', sort: (c) => c.joined, render: (c) => dateShort(c.joined) },
];

function downloadCsv(rows: readonly Customer[]) {
  const header = ['id', 'name', 'email', 'plan', 'status', 'mrr', 'country', 'joined'];
  const body = rows.map((c) => [c.id, c.name, c.email, c.plan, c.status, c.mrr, c.country, c.joined]);
  const url = URL.createObjectURL(new Blob([toCsv([header, ...body])], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'customers.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Customers() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => (filter === 'all' || c.status === filter) && (q === '' || c.name.toLowerCase().includes(q) || c.email.includes(q) || c.country.toLowerCase().includes(q)));
  }, [query, filter]);

  return (
    <Card>
      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={16} />
          <input type="search" placeholder="Search name, email or country" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="chips" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button key={f} type="button" className={`chip ${filter === f ? 'on' : ''}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <button type="button" className="btn" onClick={() => downloadCsv(rows)}>
          <Icon name="download" size={16} />
          Export CSV
        </button>
      </div>
      <DataTable rows={rows} columns={columns} rowKey={(c) => c.id} pageSize={8} empty="No customers match your filters." />
    </Card>
  );
}
