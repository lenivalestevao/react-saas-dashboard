import { ROUTE_TITLES, type Route } from '../lib/router';
import type { Theme } from '../lib/theme';
import { Avatar, Icon } from './ui';

interface Props {
  route: Route;
  theme: Theme;
  onToggleTheme: () => void;
  onMenu: () => void;
}

export function Topbar({ route, theme, onToggleTheme, onMenu }: Props) {
  const { title, subtitle } = ROUTE_TITLES[route];
  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" aria-label="Open menu" onClick={onMenu}>
        <Icon name="menu" size={20} />
      </button>
      <div className="titles">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="top-actions">
        <button type="button" className="icon-btn" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={onToggleTheme}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button type="button" className="icon-btn" aria-label="Notifications">
          <Icon name="bell" />
        </button>
        <Avatar name="Leni Junior" size={34} />
      </div>
    </header>
  );
}
