import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { useRoute } from './lib/router';
import { useTheme } from './lib/theme';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import Overview from './pages/Overview';
import Settings from './pages/Settings';

export default function App() {
  const route = useRoute();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [route]);

  return (
    <div className="app">
      <Sidebar route={route} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <Topbar route={route} theme={theme} onToggleTheme={toggleTheme} onMenu={() => setMenuOpen(true)} />
        <main className="content">
          {route === 'overview' && <Overview />}
          {route === 'customers' && <Customers />}
          {route === 'analytics' && <Analytics />}
          {route === 'settings' && <Settings theme={theme} onToggleTheme={toggleTheme} />}
        </main>
      </div>
    </div>
  );
}
