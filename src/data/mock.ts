// Deterministic demo data: the same numbers on every load, so screenshots and tests are stable.
export type Plan = 'Free' | 'Pro' | 'Business' | 'Enterprise';
export type Status = 'active' | 'trial' | 'churned';

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  status: Status;
  mrr: number;
  country: string;
  joined: string;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2026);
const pick = <T,>(items: readonly T[]): T => items[Math.floor(rand() * items.length)]!;

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const series = (start: number, rate: number, noise: number): number[] =>
  MONTHS.map((_, i) => Math.round(start * (1 + rate) ** i * (1 + (rand() - 0.5) * noise)));

export const revenue = { current: series(38000, 0.045, 0.08), previous: series(29000, 0.035, 0.08) };
export const activeUsers = series(8200, 0.04, 0.05);
export const signups = series(640, 0.03, 0.2);
export const sparkRevenue = revenue.current.slice(-8);
export const sparkUsers = activeUsers.slice(-8);
export const sparkConversion = [3.1, 3.4, 3.3, 3.8, 3.7, 4.1, 4.0, 4.4];
export const sparkChurn = [2.9, 2.8, 3.0, 2.6, 2.5, 2.6, 2.3, 2.2];

export const trafficSources = [
  { label: 'Organic search', value: 42, color: 'var(--c1)' },
  { label: 'Direct', value: 27, color: 'var(--c2)' },
  { label: 'Referral', value: 18, color: 'var(--c3)' },
  { label: 'Social', value: 13, color: 'var(--c4)' },
];

export const funnel = [
  { label: 'Visitors', value: 48200 },
  { label: 'Sign-ups', value: 3120 },
  { label: 'Activated', value: 1890 },
  { label: 'Paying', value: 742 },
];

export const activity = [
  { who: 'Marta Oliveira', what: 'upgraded to Business', when: '12 min ago' },
  { who: 'Kenji Watanabe', what: 'started a 14-day trial', when: '48 min ago' },
  { who: 'Priya Nair', what: 'invited 6 teammates', when: '2 h ago' },
  { who: 'Lucas Ferreira', what: 'cancelled Pro plan', when: '5 h ago' },
  { who: 'Amelia Brown', what: 'upgraded to Enterprise', when: 'Yesterday' },
];

const FIRST = ['Marta', 'Kenji', 'Priya', 'Lucas', 'Amelia', 'Diego', 'Sofia', 'Noah', 'Aiko', 'Omar', 'Elena', 'Tomás', 'Chloe', 'Ravi', 'Ingrid', 'Mateus', 'Zoe', 'Hugo', 'Layla', 'Felix'] as const;
const LAST = ['Oliveira', 'Watanabe', 'Nair', 'Ferreira', 'Brown', 'Alvarez', 'Rossi', 'Fischer', 'Tanaka', 'Haddad', 'Petrova', 'Costa', 'Martin', 'Iyer', 'Larsen', 'Souza', 'Khan', 'Silva', 'Novak', 'Meyer'] as const;
const COUNTRIES = ['Brazil', 'United States', 'Japan', 'Germany', 'India', 'Spain', 'Canada', 'United Kingdom', 'Mexico', 'Portugal'] as const;
const PLANS: readonly Plan[] = ['Free', 'Pro', 'Pro', 'Business', 'Business', 'Enterprise'];
const PRICE: Record<Plan, number> = { Free: 0, Pro: 29, Business: 99, Enterprise: 399 };

function isoDaysAfter(base: string, days: number): string {
  const d = new Date(`${base}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const customers: Customer[] = Array.from({ length: 48 }, (_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  const plan = pick(PLANS);
  const r = rand();
  const status: Status = r < 0.62 ? 'active' : r < 0.82 ? 'trial' : 'churned';
  const seats = 1 + Math.floor(rand() * 3);
  return {
    id: `cus_${String(1000 + i)}`,
    name: `${first} ${last}`,
    email: `${first}.${last}@example.com`.toLowerCase(),
    plan,
    status,
    mrr: status === 'churned' ? 0 : PRICE[plan] * (plan === 'Free' ? 0 : seats),
    country: pick(COUNTRIES),
    joined: isoDaysAfter('2025-01-01', Math.floor(rand() * 600)),
  };
});
