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
  imageUrl?: string;
  imagePath?: string;
  authorId: string;
  createdAt: Timestamp;
}

// Was der User im Formular erfasst; abgeleitete Felder und Metadaten setzt der Service
export type RecipeInput = Omit<
  Recipe,
  | 'id'
  | 'searchTitle'
  | 'within'
  | 'authorId'
  | 'createdAt'
  | 'imageUrl'
  | 'imagePath'
>;

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
