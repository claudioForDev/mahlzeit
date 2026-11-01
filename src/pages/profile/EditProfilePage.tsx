import { useEffect, useState, type SyntheticEvent } from 'react';
import {
  useAuthStore,
  useAuthActions,
  selectIsAnonymous,
} from '../../store/authStore';
import { AuthForm } from '../../components/auth/AuthForm';
import { FormMessage } from '../../components/ui/FormMessage/FormMessage';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import styles from './EditProfilePage.module.scss';
import { BackLink } from '../../components/ui/BackLink/BackLink';

export function EditProfilePage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const displayName = useAuthStore((s) => s.displayName);
  const photoURL = useAuthStore((s) => s.photoURL);
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const error = useAuthStore((s) => s.error);
  const info = useAuthStore((s) => s.info);
  const {
    updateName,
    changePassword,
    uploadAvatar,
    deleteAvatar,
    deleteAccount,
    clearMessages,
  } = useAuthActions();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(displayName ?? '');
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Clear messages when leaving the page so they don't show up elsewhere
  useEffect(() => clearMessages, [clearMessages]);

  if (isAnonymous) {
    return (
      <div className="profile profile--anonymous">
        <p>
          Registriere dich, um ein Profil zu haben und deine Favoriten dauerhaft
          zu sichern.
        </p>
        <AuthForm />
      </div>
    );
  }

  const memberSince = currentUser?.metadata.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('de-CH')
    : null;

  const handleNameSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The form stays open on error
    if (await updateName(name)) setEditingName(false);
  };

  const handlePasswordSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await changePassword(currentPassword, newPassword)) {
      setCurrentPassword('');
      setNewPassword('');
      setEditingPassword(false);
    }
  };

  // Cancel: close the form, discard input and hide its messages
  const cancelName = () => {
    setName(displayName ?? '');
    setEditingName(false);
    clearMessages();
  };

  const cancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setEditingPassword(false);
    clearMessages();
  };

  const cancelDeleteAccount = () => {
    setDeletePassword('');
    setDeletingAccount(false);
    clearMessages();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadAvatar(file);
    e.target.value = ''; // so the same file can be picked again
  };

  const handleDeleteAccount = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await deleteAccount(deletePassword);
    setDeletePassword('');
  };

  return (
    <>
      <title>Profil bearbeiten | mahlzeit</title>

      <BackLink fallback="/profil">Zurück</BackLink>

      <h1>Profil bearbeiten</h1>

      {/* At the top so the message is visible no matter which section was changed */}
      {error && <FormMessage type="error">{error}</FormMessage>}
      {info && <FormMessage type="info">{info}</FormMessage>}

      <section className={styles.section}>
        <h2>Profilbild</h2>
        <div className={`${styles.item} ${styles.avatar}`}>
          <Avatar photoURL={photoURL} />

          <div className={styles.actions}>
            <label className="btn btn--link">
              {photoURL ? 'Bild ändern' : 'Bild hinzufügen'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="visually-hidden"
              />
            </label>
            {photoURL && (
              <button
                type="button"
                className="btn btn--link"
                onClick={deleteAvatar}
              >
                Bild löschen
              </button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Persönliche Daten</h2>

        {editingName ? (
          <form onSubmit={handleNameSave} className={`form ${styles.item}`}>
            <div className={styles.editForm}>
              <label>
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <div className={styles.actions}>
                <button type="submit" className="btn btn--default">
                  Speichern
                </button>
                <button
                  type="button"
                  className="btn btn--link"
                  onClick={cancelName}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.item}>
            <div>
              <span className={styles.label}>Name</span>
              <span>{displayName}</span>
            </div>
            <button
              type="button"
              className="btn btn--link"
              onClick={() => setEditingName(true)}
            >
              Bearbeiten
            </button>
          </div>
        )}

        <div className={styles.item}>
          <div>
            <span className={styles.label}>E-Mail</span>
            <span>{currentUser?.email}</span>
          </div>
        </div>

        {memberSince && (
          <div className={styles.item}>
            <div>
              <span className={styles.label}>Mitglied seit</span>
              <span>{memberSince}</span>
            </div>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Sicherheit</h2>

        {editingPassword ? (
          <form onSubmit={handlePasswordSave} className={`form ${styles.item}`}>
            <div className={styles.editForm}>
              <label>
                Aktuelles Passwort
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </label>
              <label>
                Neues Passwort
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mindestens 6 Zeichen"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </label>
              <div className={styles.actions}>
                <button type="submit" className="btn btn--default">
                  Speichern
                </button>
                <button
                  type="button"
                  className="btn btn--link"
                  onClick={cancelPassword}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.item}>
            <div>
              <span className={styles.label}>Passwort</span>
              <span aria-hidden="true">••••••••</span>
            </div>
            <button
              type="button"
              className="btn btn--link"
              onClick={() => setEditingPassword(true)}
            >
              Ändern
            </button>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Konto</h2>

        {deletingAccount ? (
          <form
            onSubmit={handleDeleteAccount}
            className={`form ${styles.item}`}
          >
            <div className={styles.editForm}>
              <p>
                Das Konto wird unwiderruflich gelöscht. Zur Bestätigung Passwort
                eingeben:
              </p>
              <label>
                Passwort
                <input
                  type="password"
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                />
              </label>
              <div className={styles.actions}>
                <button type="submit" className="btn btn--danger">
                  Konto endgültig löschen
                </button>
                <button
                  type="button"
                  className="btn btn--link"
                  onClick={cancelDeleteAccount}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.item}>
            <div>
              <span className={styles.label}>Konto löschen</span>
              <span>Alle Favoriten und Notizen gehen verloren.</span>
            </div>
            <button
              type="button"
              className={`btn btn--link ${styles.dangerLink}`}
              onClick={() => setDeletingAccount(true)}
            >
              Löschen
            </button>
          </div>
        )}
      </section>
    </>
  );
}
