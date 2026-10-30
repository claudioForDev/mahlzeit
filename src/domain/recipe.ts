import type { Timestamp } from 'firebase/firestore';

export type Season = 'fruehling' | 'sommer' | 'herbst' | 'winter';
export type MealType =
  | 'fruehstueck'
  | 'snack'
  | 'vorspeise'
  | 'hauptgericht'
  | 'nachspeise'
  | 'getraenke';
export type Diet =
  'vegetarisch' | 'vegan' | 'laktosefrei' | 'glutenfrei' | 'gesund';
export type Within = 'max15' | 'max30' | 'max60';

// Anzeigetexte; die Reihenfolge bestimmt auch die Reihenfolge im UI
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  fruehstueck: 'Frühstück',
  snack: 'Snack',
  vorspeise: 'Vorspeise',
  hauptgericht: 'Hauptgericht',
  nachspeise: 'Dessert',
  getraenke: 'Getränk',
};

export const SEASON_LABELS: Record<Season, string> = {
  fruehling: 'Frühling',
  sommer: 'Sommer',
  herbst: 'Herbst',
  winter: 'Winter',
};

export const DIET_LABELS: Record<Diet, string> = {
  vegetarisch: 'Vegetarisch',
  vegan: 'Vegan',
  laktosefrei: 'Laktosefrei',
  glutenfrei: 'Glutenfrei',
  gesund: 'Gesund',
};

export const UNITS = [
  'g',
  'kg',
  'ml',
  'dl',
  'l',
  'EL',
  'TL',
  'Stück',
  'Prise',
  'Bund',
  'Blätter',
  'Rolle',
] as const;
export type Unit = (typeof UNITS)[number];

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
}

// Eine Grösse des Rezeptbilds, für srcset
export interface RecipeImage {
  width: number;
  url: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepMinutes: number;
  cookMinutes: number;
  mealType: MealType;
  seasons: Season[];
  diets: Partial<Record<Diet, true>>;
  within: Partial<Record<Within, true>>;
  searchTitle: string;
  ingredients: Ingredient[];
  steps: string[];
  baseServings: number;
  images?: RecipeImage[]; // aufsteigend nach Breite
  imageFolder?: string; // Storage-Ordner mit allen Grössen, zum Löschen
  authorId: string;
  createdAt: Timestamp;
}

//Menge auf eine andere Portionenzahl umrechnen
export function scaleAmount(
  amount: number,
  baseServings: number,
  servings: number,
) {
  return Math.round(((amount * servings) / baseServings) * 10) / 10;
}

// Was der User im Formular erfasst; abgeleitete Felder und Metadaten setzt der Service
export type RecipeInput = Omit<
  Recipe,
  | 'id'
  | 'searchTitle'
  | 'within'
  | 'authorId'
  | 'createdAt'
  | 'images'
  | 'imageFolder'
>;

// Breiten, in denen Rezeptbilder gespeichert werden
export const IMAGE_WIDTHS = [400, 800, 1200, 1600, 2000];

// Welche Breiten aus einem Original erzeugt werden: nie hochskalieren,
// ein kleineres Original wird in seiner eigenen Breite gespeichert
export function targetWidths(
  originalWidth: number,
  widths: number[] = IMAGE_WIDTHS,
): number[] {
  const result = widths.filter((w) => w < originalWidth);
  if (originalWidth <= Math.max(...widths)) result.push(originalWidth);
  return result;
}

// srcset-Attribut, z. B. "url400 400w, url800 800w"
export const toSrcSet = (images: RecipeImage[]) =>
  images.map((i) => `${i.url} ${i.width}w`).join(', ');

// Firestore kann nicht case-insensitive suchen, darum speichern wir den Titel zusätzlich klein geschrieben
export const toSearchTitle = (title: string) => title.toLowerCase();

// Kumulative Flags, damit sich mit einer einfachen where('within.max30', '==', true)-Abfrage filtern lässt
export function computeWithin(
  totalMinutes: number,
): Partial<Record<Within, true>> {
  const within: Partial<Record<Within, true>> = {};
  if (totalMinutes <= 15) within.max15 = true;
  if (totalMinutes <= 30) within.max30 = true;
  if (totalMinutes <= 60) within.max60 = true;
  return within;
}

// Gibt die Fehlermeldungen zurück; leeres Array = gültig
export function validateRecipeInput(input: RecipeInput): string[] {
  const errors: string[] = [];
  if (!input.title.trim()) errors.push('Titel fehlt.');
  if (input.prepMinutes < 0 || input.cookMinutes < 0)
    errors.push('Zeiten dürfen nicht negativ sein.');
  if (input.baseServings < 1) errors.push('Mindestens eine Portion angeben.');
  if (!input.ingredients.some((i) => i.name.trim()))
    errors.push('Mindestens eine Zutat angeben.');
  if (input.ingredients.some((i) => i.amount < 0))
    errors.push('Mengen dürfen nicht negativ sein.');
  if (!input.steps.some((s) => s.trim()))
    errors.push('Mindestens einen Zubereitungsschritt angeben.');
  return errors;
}
