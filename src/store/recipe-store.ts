import { create } from 'zustand';
import type { Recipe, RecipeInput } from '../domain/recipe';
import * as recipeService from '../services/recipeService';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null; // Detailansicht; null = nicht geladen oder nicht gefunden
  loading: boolean;
  error: string | null;
  actions: RecipeActions;
}

interface RecipeActions {
  loadRecipes: () => Promise<void>;
  loadRecipe: (id: string) => Promise<void>;
  createRecipe: (input: RecipeInput) => Promise<string | undefined>; // neue ID, undefined bei Fehler
}

export const useRecipeStore = create<RecipeState>()((set) => {
  // Gemeinsames Loading- und Error-Handling, analog zum auth-store
  const run = async <T>(fn: () => Promise<T>) => {
    set({ loading: true, error: null });
    try {
      return await fn();
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  };

  return {
    recipes: [],
    currentRecipe: null,
    loading: false,
    error: null,
    actions: {
      loadRecipes: () =>
        run(async () => {
          set({ recipes: await recipeService.listRecipes() });
        }),

      loadRecipe: (id) =>
        run(async () => {
          set({ currentRecipe: null });
          set({ currentRecipe: await recipeService.getRecipe(id) });
        }),

      createRecipe: (input) => run(() => recipeService.createRecipe(input)),
    },
  };
});

export const useRecipeActions = () => useRecipeStore((s) => s.actions);
