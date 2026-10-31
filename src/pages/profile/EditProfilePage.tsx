import { useEffect, useState, type SyntheticEvent } from 'react';
import {
  useAuthStore,
  useAuthActions,
  selectIsAnonymous,
} from '../../store/authStore';
import { AuthForm } from '../../components/auth/AuthForm';
import { FormMessage } from '../../components/ui/FormMessage/FormMessage';
import styles from './ProfilePage.module.scss';
import { CircleUser } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  };

  const handleDeleteAccount = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await deleteAccount(deletePassword);
    setDeletePassword('');
  };

  return (
    <>
      <title>Profil bearbeiten | mahlzeit</title>

      <h1>Profil</h1>
      <Link to="/profil">zurück</Link>

      <div className={styles.profile}>
        <div>
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

          <label className="btn btn--default">
            {photoURL ? 'Profilbild ändern' : 'Profilbild hinzufügen'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />
          </label>
          {photoURL && (
            <button className="btn btn--default" onClick={deleteAvatar}>
              Profilbild löschen
            </button>
          )}
        </div>
        <div>
          {editingName ? (
            <form onSubmit={handleNameSave} className="form form--profile">
              <label>
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Speichern</button>
              <button
                type="button"
                className="btn btn--default"
                onClick={cancelName}
              >
                Abbrechen
              </button>
            </form>
          ) : (
            <>
              <h2>{displayName}</h2>
              <button
                className="btn btn--default"
                onClick={() => setEditingName(true)}
              >
                Name bearbeiten
              </button>
            </>
          )}

          <p>{currentUser?.email}</p>
          {memberSince && <p>Mitglied seit {memberSince}</p>}
        </div>
      </div>

      <div className="profile__stats">
        {/* TODO: values from recipeStore / favoriteStore once recipe CRUD and favorites are built */}
        <p>Rezepte: –</p>
        <p>Favoriten: –</p>
      </div>

      {editingPassword ? (
        <form onSubmit={handlePasswordSave} className="form form--profile">
          <label>
            Aktuelles Passwort
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Neues Passwort
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
          <button type="submit">Speichern</button>
          <button
            type="button"
            className="btn btn--default"
            onClick={cancelPassword}
          >
            Abbrechen
          </button>
        </form>
      ) : (
        <button
          className="btn btn--default"
          onClick={() => setEditingPassword(true)}
        >
          Passwort ändern
        </button>
      )}

      {error && <FormMessage type="error">{error}</FormMessage>}
      {info && <FormMessage type="info">{info}</FormMessage>}

      {deletingAccount ? (
        <form onSubmit={handleDeleteAccount} className="form form--profile">
          <p>
            Das Konto wird unwiderruflich gelöscht. Zur Bestätigung Passwort
            eingeben:
          </p>
          <label>
            Passwort
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Konto endgültig löschen</button>
          <button
            type="button"
            className="btn btn--default"
            onClick={cancelDeleteAccount}
          >
            Abbrechen
          </button>
        </form>
      ) : (
        <button
          className="btn btn--default"
          onClick={() => setDeletingAccount(true)}
        >
          Konto löschen
        </button>
      )}
    </>
  );
}
