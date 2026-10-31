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

// Returns the signed-in user or throws an error
export function requireUser() {
  const user = auth.currentUser;
  if (!user) throw new Error('Nicht angemeldet');
  return user;
}

// Firebase requires a fresh sign-in for sensitive actions (change password, delete account)
async function reauthenticate(user: User, password: string) {
  if (!user.email) throw new Error('Nicht angemeldet');
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
}

// Fixed path per user, each upload overwrites the old one
const avatarRef = (uid: string) => ref(storage, `avatars/${uid}`);

// If nobody is signed in, sign in anonymously automatically.
// That fires onAuthStateChanged again, this time with the new user.
export function watchAuth(callback: (user: User) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user) callback(user);
    else signInAnonymously(auth);
  });
}

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Triggers Firebase's password reset email flow (the link leads to a page hosted by Firebase)
export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

// Register from an existing anonymous account:
// the UID stays the same, existing data (e.g. favorites) is kept.
// If nobody was signed in anonymously, it simply creates a new account.
// The name is set right away (Firebase Auth, no separate Firestore document needed).
export async function register(email: string, password: string, name: string) {
  const current = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);
  const result = current?.isAnonymous
    ? await linkWithCredential(current, credential)
    : await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await result.user.getIdToken(true); // refresh the token, otherwise sign_in_provider is still 'anonymous'
  await sendEmailVerification(result.user);
  return result;
}

// Change the name later (edit profile)
export async function updateName(name: string) {
  await updateProfile(requireUser(), { displayName: name });
}

// Change password: Firebase requires a fresh sign-in (re-authentication)
export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const user = requireUser();
  await reauthenticate(user, currentPassword);
  await updatePassword(user, newPassword);
}

// Upload profile picture
export async function uploadAvatar(file: File) {
  const user = requireUser();
  const fileRef = avatarRef(user.uid);
  await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  await updateProfile(user, { photoURL });
  return photoURL;
}

// Delete profile picture: remove the file from Storage and reset photoURL
export async function deleteAvatar() {
  const user = requireUser();
  await deleteObject(avatarRef(user.uid));
  await updateProfile(user, { photoURL: '' }); // '' instead of null – otherwise the emulator rejects the JSON
}

// Delete the account permanently. This user's recipes stay in Firestore
// (authorId then points to a UID that no longer exists, see datenmodell.md).
export async function deleteAccount(currentPassword: string) {
  const user = requireUser();
  await reauthenticate(user, currentPassword);
  if (user.photoURL) {
    try {
      await deleteObject(avatarRef(user.uid));
    } catch {
      // no avatar or already gone
    }
  }
  await deleteUser(user);
}

export const logout = () => signOut(auth);
