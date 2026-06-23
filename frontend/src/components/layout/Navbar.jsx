import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const NAV_LINKS = [
  { to: '/tickets',    label: '🎟 Browse Tickets' },
  { to: '/my-tickets', label: '📋 My Tickets' },
  { to: '/wallet',     label: '💰 Wallet' },
  { to: '/results',    label: '🏆 Results' },
];

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = user?.role === 'admin'
    ? [...NAV_LINKS, { to: '/admin/tickets', label: '⚙️ Admin' }]
    : NAV_LINKS;

  function logout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/tickets" className="navbar-brand">🎟 Thai Lottery</Link>

        <div className="navbar-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar-link ${location.pathname.startsWith(l.to) ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <span className="navbar-user">{user?.name}</span>
          <button className="btn btn--ghost btn--sm" onClick={logout}>
            Logout
          </button>
          <button className="navbar-hamburger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`navbar-drawer ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`navbar-link ${location.pathname.startsWith(l.to) ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <div className="divider" style={{ margin: '0.5rem 0' }} />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', padding: '0 1rem' }}>
          {user?.name}
        </span>
        <button className="btn btn--ghost btn--sm" onClick={logout} style={{ marginTop: '0.5rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}