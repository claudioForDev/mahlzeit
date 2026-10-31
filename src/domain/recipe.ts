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

// Display labels; the order also defines the order in the UI
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

// One size of the recipe image, for srcset
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
  images?: RecipeImage[]; // ascending by width
  imageFolder?: string; // Storage folder with all sizes, for deleting
  authorId: string;
  createdAt: Timestamp;
}

// Scale an amount to a different number of servings
export function scaleAmount(
  amount: number,
  baseServings: number,
  servings: number,
) {
  return Math.round(((amount * servings) / baseServings) * 10) / 10;
}

// What the user enters in the form; the service sets derived fields and metadata
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

// Widths in which recipe images are stored
export const IMAGE_WIDTHS = [400, 800, 1200, 1600, 2000];

// Which widths to generate from an original: never upscale,
// a smaller original is stored at its own width
export function targetWidths(
  originalWidth: number,
  widths: number[] = IMAGE_WIDTHS,
): number[] {
  const result = widths.filter((w) => w < originalWidth);
  if (originalWidth <= Math.max(...widths)) result.push(originalWidth);
  return result;
}

// srcset attribute, e.g. "url400 400w, url800 800w"
export const toSrcSet = (images: RecipeImage[]) =>
  images.map((i) => `${i.url} ${i.width}w`).join(', ');

// Firestore can't search case-insensitively, so we also store the title in lowercase
export const toSearchTitle = (title: string) => title.toLowerCase();

// Cumulative flags so a simple where('within.max30', '==', true) query can filter
export function computeWithin(
  totalMinutes: number,
): Partial<Record<Within, true>> {
  const within: Partial<Record<Within, true>> = {};
  if (totalMinutes <= 15) within.max15 = true;
  if (totalMinutes <= 30) within.max30 = true;
  if (totalMinutes <= 60) within.max60 = true;
  return within;
}

// Returns the error messages; empty array = valid
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
