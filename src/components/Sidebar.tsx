import { ROUTES, ROUTE_TITLES, type Route } from '../lib/router';
import { Icon, Logo, type IconName } from './ui';

const ICONS: Record<Route, IconName> = { overview: 'home', customers: 'users', analytics: 'chart', settings: 'settings' };

export function Sidebar({ route, open, onClose }: { route: Route; open: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <Logo />
          <span>Pulse</span>
          <button type="button" className="icon-btn close-btn" aria-label="Close menu" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Main">
          {ROUTES.map((r) => (
            <a key={r} href={`#/${r}`} className={`nav-link ${r === route ? 'active' : ''}`} aria-current={r === route ? 'page' : undefined}>
              <Icon name={ICONS[r]} />
              {ROUTE_TITLES[r].title}
            </a>
          ))}
        </nav>
        <div className="upgrade">
          <strong>Pro plan</strong>
          <p>Unlimited seats, API access and priority support.</p>
          <a href="#/settings" className="btn btn-primary">
            Manage plan
          </a>
        </div>
      </aside>
    </>
  );
}
