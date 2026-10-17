// src/components/layout/Navigation/Navigation.tsx
import { NavLink } from 'react-router-dom';
import { Home, CookingPot, Flame, Sprout, Egg } from 'lucide-react';
import styles from './Navigation.module.scss';

const items = [
  { to: '/', label: 'Start', icon: Home },
  { to: '/rezepte', label: 'Rezepte', icon: CookingPot },
  { to: '/favoriten', label: 'Favoriten', icon: Flame },
  { to: '/erstellen', label: 'Erstellen', icon: Sprout },
  { to: '/profil', label: 'Profil', icon: Egg },
];

export function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              end={to === '/'}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
