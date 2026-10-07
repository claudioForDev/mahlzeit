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
  createdAt: unknown; // Firestore Timestamp, Typ kommt beim Einbinden von firebase/firestore
}
