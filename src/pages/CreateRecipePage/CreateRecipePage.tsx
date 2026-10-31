import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, selectIsAnonymous } from '../../store/authStore';
import { useRecipeStore, useRecipeActions } from '../../store/recipeStore';
import { RecipeForm } from '../../components/recipe/RecipeForm/RecipeForm';
import type { RecipeInput } from '../../domain/recipe';

export function CreateRecipePage() {
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const loading = useRecipeStore((s) => s.loading);
  const error = useRecipeStore((s) => s.error);
  const { createRecipe } = useRecipeActions();
  const navigate = useNavigate();
  const location = useLocation();

  // Go straight to the new recipe after saving
  const handleSubmit = async (input: RecipeInput, image?: File) => {
    const id = await createRecipe(input, image);
    if (id) navigate(`/rezepte/${id}`);
  };

  return (
    <>
      <title>Rezept erstellen | mahlzeit</title>
      <h1>Rezept erstellen</h1>

      {/* The security rules only allow registered users to create recipes */}
      {isAnonymous ? (
        <p>
          Um eigene Rezepte zu erstellen, brauchst du ein Konto.{' '}
          {/* from: return to the form after login */}
          <Link to="/profil" state={{ from: location.pathname }}>
            Jetzt anmelden oder registrieren
          </Link>
        </p>
      ) : (
        <RecipeForm
          onSubmit={handleSubmit}
          submitLabel="Rezept speichern"
          submitting={loading}
          error={error}
        />
      )}
    </>
  );
}
