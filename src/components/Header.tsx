import {
  useAuthStore,
  useAuthActions,
  selectIsAnonymous,
} from '../store/auth-store';

export function Header() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const displayName = useAuthStore((s) => s.displayName);
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const { logout } = useAuthActions();

  if (!currentUser) return null;

  return (
    <header>
      {isAnonymous ? (
        <span>Anonym angemeldet</span>
      ) : (
        <>
          <span>{displayName}</span>
          <button onClick={logout}>Abmelden</button>
        </>
      )}
    </header>
  );
}
