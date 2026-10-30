import {
  useAuthStore,
  useAuthActions,
  selectIsAnonymous,
} from '../../store/authStore';
import { AuthForm } from '../../components/auth/AuthForm';
import styles from './ProfilePage.module.scss';
import { CircleUser } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pencil, Bell, LifeBuoy, LogOut } from 'lucide-react';

export function ProfilePage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const displayName = useAuthStore((s) => s.displayName);
  const photoURL = useAuthStore((s) => s.photoURL);
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const info = useAuthStore((s) => s.info);
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  // Kam der User über einen "Anmelden"-Link von einer anderen Seite,
  // nach erfolgreichem Login/Registrieren dorthin zurück
  const from = (location.state as { from?: string } | null)?.from;
  useEffect(() => {
    if (!isAnonymous && from) navigate(from, { replace: true });
  }, [isAnonymous, from, navigate]);

  if (isAnonymous) {
    return (
      <>
        <title>Profil | mahlzeit</title>

        <h1>Profil</h1>
        <div className="profile profile--anonymous">
          {info && <p className="form__info">{info}</p>}
          <p>
            Registriere dich, um ein Profil zu haben und deine Favoriten
            dauerhaft zu sichern.
          </p>
          <AuthForm />
        </div>
      </>
    );
  }

  const memberSince = currentUser?.metadata.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('de-CH')
    : null;

  return (
    <>
      <h1>Profil</h1>
      <div className={styles.profile}>
        <div className={styles.user}>
          {photoURL ? (
            <img
              src={photoURL}
              alt="Profilbild"
              className={styles.profileImg}
            />
          ) : (
            <span className={`${styles.profileImg} ${styles.empty}`}>
              <CircleUser size={40} strokeWidth={1.5} />
            </span>
          )}

          <div>
            <h2>{displayName}</h2>
            <p>{currentUser?.email}</p>
            {memberSince && <p>Mitglied seit {memberSince}</p>}
          </div>
        </div>

        <ul className={styles.stats}>
          <li className={styles.statItem}>
            Rezepte
            <span className={styles.statCount}>Anzahl</span>
          </li>
          <li className={styles.statItem}>
            Favoriten
            <span className={styles.statCount}>Anzahl</span>
          </li>
        </ul>

        <ul className={styles.menuList}>
          <li>
            <Link to="/profil/bearbeiten" className={styles.menuItem}>
              <Pencil size={20} strokeWidth={1.75} />
              <span>Profil bearbeiten</span>
            </Link>
          </li>
          <li>
            <Link to="/benachrichtigungen" className={styles.menuItem}>
              <Bell size={20} strokeWidth={1.75} />
              <span>Benachrichtigungen</span>
            </Link>
          </li>
          <li>
            <Link to="/hilfe" className={styles.menuItem}>
              <LifeBuoy size={20} strokeWidth={1.75} />
              <span>Hilfe & Support</span>
            </Link>
          </li>
          <li>
            <button onClick={logout} className={styles.menuItem}>
              <LogOut size={20} strokeWidth={1.75} />
              <span>Abmelden</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
