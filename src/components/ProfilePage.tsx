import { useState, type SyntheticEvent } from 'react';
import {
  useAuthStore,
  useAuthActions,
  selectIsAnonymous,
} from '../store/auth-store';

export function ProfilePage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const displayName = useAuthStore((s) => s.displayName);
  const photoURL = useAuthStore((s) => s.photoURL);
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const error = useAuthStore((s) => s.error);
  const info = useAuthStore((s) => s.info);
  const {
    logout,
    updateName,
    changePassword,
    uploadAvatar,
    deleteAvatar,
    deleteAccount,
  } = useAuthActions();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(displayName ?? '');
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  if (isAnonymous) {
    return (
      <div className="profile profile--anonymous">
        {info && <p className="form__info">{info}</p>}
        <p>
          Registriere dich, um ein Profil zu haben und deine Favoriten dauerhaft
          zu sichern.
        </p>
      </div>
    );
  }

  const memberSince = currentUser?.metadata.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('de-CH')
    : null;

  const handleNameSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateName(name);
    setEditingName(false);
  };

  const handlePasswordSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await changePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setEditingPassword(false);
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
    <div className="profile">
      {photoURL && (
        <img src={photoURL} alt="Profilbild" className="profile__avatar" />
      )}
      <label className="btn btn--default">
        Profilbild ändern
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
            onClick={() => setEditingName(false)}
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

      <div className="profile__stats">
        {/* TODO: Werte aus recipe-store / favorite-store, sobald Rezept CRUD und Favorisieren gebaut sind */}
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
            onClick={() => setEditingPassword(false)}
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

      {error && <p className="form__error">{error}</p>}
      {info && <p className="form__info">{info}</p>}

      <button onClick={logout}>Abmelden</button>

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
            onClick={() => setDeletingAccount(false)}
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
    </div>
  );
}
