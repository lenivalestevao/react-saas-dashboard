import { useEffect, useState, type FormEvent } from 'react';
import { Card, Icon, Switch } from '../components/ui';
import type { Theme } from '../lib/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Settings({ theme, onToggleTheme }: Props) {
  const [name, setName] = useState('Leni Junior');
  const [email, setEmail] = useState('leni@example.com');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saved, setSaved] = useState(false);
  const [alerts, setAlerts] = useState({ signups: true, churn: true, weekly: false });

  useEffect(() => {
    if (!saved) return;
    const id = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(id);
  }, [saved]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Enter your full name.';
    if (!EMAIL.test(email)) next.email = 'Enter a valid email address.';
    setErrors(next);
    setSaved(Object.keys(next).length === 0);
  };

  return (
    <div className="stack narrow">
      <Card title="Profile">
        <form className="form" onSubmit={submit} noValidate>
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
            {saved && (
              <span className="saved" role="status">
                <Icon name="check" size={16} /> Saved
              </span>
            )}
          </div>
        </form>
      </Card>

      <Card title="Email alerts">
        <ul className="prefs">
          <li>
            <div>
              <strong>New sign-ups</strong>
              <span className="muted">Get notified when someone joins.</span>
            </div>
            <Switch label="New sign-ups" checked={alerts.signups} onChange={(v) => setAlerts({ ...alerts, signups: v })} />
          </li>
          <li>
            <div>
              <strong>Churn warnings</strong>
              <span className="muted">Alert me when an account cancels.</span>
            </div>
            <Switch label="Churn warnings" checked={alerts.churn} onChange={(v) => setAlerts({ ...alerts, churn: v })} />
          </li>
          <li>
            <div>
              <strong>Weekly summary</strong>
              <span className="muted">A digest every Monday morning.</span>
            </div>
            <Switch label="Weekly summary" checked={alerts.weekly} onChange={(v) => setAlerts({ ...alerts, weekly: v })} />
          </li>
        </ul>
      </Card>

      <Card title="Appearance">
        <ul className="prefs">
          <li>
            <div>
              <strong>Dark mode</strong>
              <span className="muted">Easier on the eyes at night.</span>
            </div>
            <Switch label="Dark mode" checked={theme === 'dark'} onChange={onToggleTheme} />
          </li>
        </ul>
      </Card>
    </div>
  );
}
