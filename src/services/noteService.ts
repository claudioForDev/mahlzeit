import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { requireUser } from './authService';

// Exactly one note per user and recipe, recipe ID = document ID
const noteRef = (uid: string, recipeId: string) =>
  doc(db, 'users', uid, 'notes', recipeId);

// Empty string if there's no note yet
export async function getNote(recipeId: string) {
  const snap = await getDoc(noteRef(requireUser().uid, recipeId));
  return snap.exists() ? (snap.data().text as string) : '';
}

export async function saveNote(recipeId: string, text: string) {
  await setDoc(noteRef(requireUser().uid, recipeId), {
    text,
    updatedAt: serverTimestamp(),
  });
}
