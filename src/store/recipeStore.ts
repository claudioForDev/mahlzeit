import { create } from 'zustand';
import type { Recipe, RecipeInput } from '../domain/recipe';
import * as recipeService from '../services/recipeService';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null; // detail view; null = not loaded or not found
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
}

export const useRecipeStore = create<RecipeState>()((set) => {
  // Shared loading and error handling, like in authStore
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

      createRecipe: (input, image) =>
        run(() => recipeService.createRecipe(input, image)),
    },
  };
});

export const useRecipeActions = () => useRecipeStore((s) => s.actions);
