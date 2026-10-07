import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithCredential,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  EmailAuthProvider,
  signOut,
  type User,
} from 'firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { auth, storage } from '../firebase';

// Ist niemand angemeldet, wird automatisch anonym angemeldet.
// Das feuert danach onAuthStateChanged erneut, diesmal mit dem neuen User.
export function watchAuth(callback: (user: User) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user) callback(user);
    else signInAnonymously(auth);
  });
}

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Löst den "Passwort zurücksetzen"-Mail-Flow von Firebase aus (Link führt zu einer von Firebase gehosteten Seite)
export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

// Registrieren aus einem bestehenden anonymen Konto heraus:
// die UID bleibt gleich, vorhandene Daten (z. B. Favoriten) bleiben erhalten.
// War niemand anonym angemeldet, legt es einfach ein neues Konto an.
// Der Name wird direkt mitgesetzt (Firebase Auth, kein eigenes Firestore-Dokument nötig).
export async function register(email: string, password: string, name: string) {
  const current = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);
  const result = current?.isAnonymous
    ? await linkWithCredential(current, credential)
    : await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await result.user.getIdToken(true); // Token neu holen, sonst steht sign_in_provider noch auf 'anonymous'
  await sendEmailVerification(result.user);
  return result;
}

// Name nachträglich ändern (Profil bearbeiten)
export async function updateName(name: string) {
  if (!auth.currentUser) throw new Error('Nicht angemeldet');
  await updateProfile(auth.currentUser, { displayName: name });
}

// Passwort ändern: Firebase verlangt dafür eine frische Anmeldung (Re-Authentifizierung)
export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('Nicht angemeldet');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

// Profilbild hochladen: fester Pfad pro User, jeder Upload überschreibt den alten
export async function uploadAvatar(file: File) {
  const user = auth.currentUser;
  if (!user) throw new Error('Nicht angemeldet');
  const avatarRef = ref(storage, `avatars/${user.uid}`);
  await uploadBytes(avatarRef, file);
  const photoURL = await getDownloadURL(avatarRef);
  await updateProfile(user, { photoURL });
  return photoURL;
}

// Profilbild löschen: Datei aus Storage entfernen und photoURL zurücksetzen
export async function deleteAvatar() {
  const user = auth.currentUser;
  if (!user) throw new Error('Nicht angemeldet');
  const avatarRef = ref(storage, `avatars/${user.uid}`);
  await deleteObject(avatarRef);
  await updateProfile(user, { photoURL: null });
}

// Konto endgültig löschen. Rezepte dieses Users bleiben in Firestore stehen
// (authorId zeigt dann auf eine nicht mehr existierende UID, siehe datenmodell.md).
export async function deleteAccount(currentPassword: string) {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('Nicht angemeldet');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  if (user.photoURL) {
    try {
      await deleteObject(ref(storage, `avatars/${user.uid}`));
    } catch {
      // kein Avatar vorhanden oder schon weg
    }
  }
  await deleteUser(user);
}

export const logout = () => signOut(auth);
