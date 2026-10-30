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

  // Nach dem Speichern direkt zum neuen Rezept
  const handleSubmit = async (input: RecipeInput, image?: File) => {
    const id = await createRecipe(input, image);
    if (id) navigate(`/rezepte/${id}`);
  };

  return (
    <>
      <title>Rezept erstellen | mahlzeit</title>
      <h1>Rezept erstellen</h1>

      {/* Die Security Rules erlauben das Erstellen nur registrierten Usern */}
      {isAnonymous ? (
        <p>
          Um eigene Rezepte zu erstellen, brauchst du ein Konto.{' '}
          {/* from: nach dem Anmelden zurück zum Formular */}
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
