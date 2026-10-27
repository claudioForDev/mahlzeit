import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { requireUser } from './authService';
import {
  computeWithin,
  toSearchTitle,
  type Recipe,
  type RecipeInput,
} from '../domain/recipe';

const recipesCol = collection(db, 'recipes');

// Vorläufige Seitengrösse; richtige Seitenaufteilung kommt mit dem Modul Filterung und Suche
const PAGE_SIZE = 20;

const toRecipe = (snap: DocumentSnapshot) =>
  ({ id: snap.id, ...snap.data() }) as Recipe;

// Legt ein Rezept an und gibt die neue ID zurück.
// Abgeleitete Felder (searchTitle, within) werden hier berechnet, nicht im Formular.
export async function createRecipe(input: RecipeInput) {
  const user = requireUser();
  const title = input.title.trim();
  const ref = await addDoc(recipesCol, {
    ...input,
    title,
    searchTitle: toSearchTitle(title),
    within: computeWithin(input.prepMinutes + input.cookMinutes),
    authorId: user.uid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Neueste Rezepte zuerst
export async function listRecipes() {
  const snap = await getDocs(
    query(recipesCol, orderBy('createdAt', 'desc'), limit(PAGE_SIZE)),
  );
  return snap.docs.map(toRecipe);
}

// Gibt null zurück, wenn es das Rezept nicht (mehr) gibt
export async function getRecipe(id: string) {
  const snap = await getDoc(doc(recipesCol, id));
  return snap.exists() ? toRecipe(snap) : null;
}
