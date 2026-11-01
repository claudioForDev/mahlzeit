import { create } from 'zustand';
import type { Recipe, RecipeInput } from '../domain/recipe';
import * as recipeService from '../services/recipeService';
import { getErrorMessage } from '../domain/errors';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null; // detail view; null = not loaded or not found
  userRecipeCount: number | null; // profile; null = not loaded yet
  loading: boolean;
  error: string | null;
  actions: RecipeActions;
}

interface RecipeActions {
  loadRecipes: () => Promise<void>;
  loadRecipe: (id: string) => Promise<void>;
  createRecipe: (
    input: RecipeInput,
    image?: File,
  ) => Promise<string | undefined>; // new ID, undefined on error
  loadUserRecipeCount: () => Promise<void>;
}

export const useRecipeStore = create<RecipeState>()((set) => {
  // Shared loading and error handling, like in authStore
  const run = async <T>(fn: () => Promise<T>) => {
    set({ loading: true, error: null });
    try {
      return await fn();
    } catch (e) {
      set({ error: getErrorMessage(e) });
    } finally {
      set({ loading: false });
    }
  };

  return {
    recipes: [],
    currentRecipe: null,
    userRecipeCount: null,
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

      createRecipe: (input, image) =>
        run(() => recipeService.createRecipe(input, image)),

      loadUserRecipeCount: () =>
        run(async () => {
          set({ userRecipeCount: await recipeService.countUserRecipes() });
        }),
    },
  };
});

export const useRecipeActions = () => useRecipeStore((s) => s.actions);
