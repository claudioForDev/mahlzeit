import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { requireUser } from './authService';
import { readImage, resizeImage } from './imageService';
import {
  computeWithin,
  targetWidths,
  toSearchTitle,
  type Recipe,
  type RecipeInput,
} from '../domain/recipe';

const recipesCol = collection(db, 'recipes');

// Vorläufige Seitengrösse; richtige Seitenaufteilung kommt mit dem Modul Filterung und Suche
const PAGE_SIZE = 20;

const toRecipe = (snap: DocumentSnapshot) =>
  ({ id: snap.id, ...snap.data() }) as Recipe;

// Bild in mehreren Breiten unter recipes/{uid}/{recipeId}/{breite}.webp hochladen.
// imageFolder brauchen wir später, um beim Löschen alle Grössen zu entfernen.
async function uploadRecipeImages(uid: string, recipeId: string, image: File) {
  const imageFolder = `recipes/${uid}/${recipeId}`;
  const bitmap = await readImage(image);
  try {
    const images = await Promise.all(
      targetWidths(bitmap.width).map(async (width) => {
        const blob = await resizeImage(bitmap, width);
        const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
        const fileRef = ref(storage, `${imageFolder}/${width}.${extension}`);
        await uploadBytes(fileRef, blob, { contentType: blob.type });
        return { width, url: await getDownloadURL(fileRef) };
      }),
    );
    return { imageFolder, images };
  } finally {
    bitmap.close(); // Speicher des dekodierten Bilds freigeben
  }
}

// Legt ein Rezept an und gibt die neue ID zurück.
// Abgeleitete Felder (searchTitle, within) werden hier berechnet, nicht im Formular.
export async function createRecipe(input: RecipeInput, image?: File) {
  const user = requireUser();
  const title = input.title.trim();
  // ID vorab erzeugen, damit das Bild schon vor dem Speichern ihren Pfad kennt
  const recipeRef = doc(recipesCol);
  const imageFields = image
    ? await uploadRecipeImages(user.uid, recipeRef.id, image)
    : {};
  await setDoc(recipeRef, {
    ...input,
    ...imageFields,
    title,
    searchTitle: toSearchTitle(title),
    within: computeWithin(input.prepMinutes + input.cookMinutes),
    authorId: user.uid,
    createdAt: serverTimestamp(),
  });
  return recipeRef.id;
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
