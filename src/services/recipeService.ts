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

// Temporary page size; real pagination comes with the filter and search module
const PAGE_SIZE = 20;

const toRecipe = (snap: DocumentSnapshot) =>
  ({ id: snap.id, ...snap.data() }) as Recipe;

// Upload the image in several widths to recipes/{uid}/{recipeId}/{width}.webp.
// imageFolder is needed later to remove all sizes when deleting.
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
    bitmap.close(); // free the memory of the decoded image
  }
}

// Creates a recipe and returns the new ID.
// Derived fields (searchTitle, within) are computed here, not in the form.
export async function createRecipe(input: RecipeInput, image?: File) {
  const user = requireUser();
  const title = input.title.trim();
  // Create the ID up front so the image knows its path before saving
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

// Newest recipes first
export async function listRecipes() {
  const snap = await getDocs(
    query(recipesCol, orderBy('createdAt', 'desc'), limit(PAGE_SIZE)),
  );
  return snap.docs.map(toRecipe);
}

// Returns null if the recipe doesn't exist (anymore)
export async function getRecipe(id: string) {
  const snap = await getDoc(doc(recipesCol, id));
  return snap.exists() ? toRecipe(snap) : null;
}
