import { useEffect, useState } from 'react';

export const ROUTES = ['overview', 'customers', 'analytics', 'settings'] as const;
export type Route = (typeof ROUTES)[number];

export const ROUTE_TITLES: Record<Route, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Your business at a glance' },
  customers: { title: 'Customers', subtitle: 'Everyone using your product' },
  analytics: { title: 'Analytics', subtitle: 'Traffic, growth and conversion' },
  settings: { title: 'Settings', subtitle: 'Profile, alerts and appearance' },
};

export function parseRoute(hash: string): Route {
  const name = hash.replace(/^#\/?/, '');
  return (ROUTES as readonly string[]).includes(name) ? (name as Route) : 'overview';
}

/** Tiny hash router: no dependency, works on any static host. */
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
