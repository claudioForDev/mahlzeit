import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { requireUser } from './authService';

// Pro User und Rezept genau eine Notiz, Rezept-ID = Dokument-ID
const noteRef = (uid: string, recipeId: string) =>
  doc(db, 'users', uid, 'notes', recipeId);

// Leerer String, wenn noch keine Notiz existiert
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
