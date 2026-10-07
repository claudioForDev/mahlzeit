import {
  useAuthStore,
  useAuthActions,
  selectIsAnonymous,
} from '../store/auth-store';
import { Link } from 'react-router-dom';

export function Header() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const displayName = useAuthStore((s) => s.displayName);
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const { logout } = useAuthActions();

  if (!currentUser) return null; // noch am Laden

  return (
    <header>
      <Link to="/">Rezepte</Link>
      {isAnonymous ? (
        <span>Anonym angemeldet</span>
      ) : (
        <>
          <span>{displayName}</span>
          <button onClick={logout}>Abmelden</button>
          <Link to="/profile">Profil</Link>
        </>
      )}
    </header>
  );
}
