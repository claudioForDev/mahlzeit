import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, selectIsAnonymous } from '../../store/auth-store';
import { useRecipeStore, useRecipeActions } from '../../store/recipe-store';
import { RecipeForm } from '../../components/recipe/RecipeForm/RecipeForm';
import type { RecipeInput } from '../../domain/recipe';

export function CreateRecipePage() {
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const loading = useRecipeStore((s) => s.loading);
  const error = useRecipeStore((s) => s.error);
  const { createRecipe } = useRecipeActions();
  const navigate = useNavigate();

  // Nach dem Speichern direkt zum neuen Rezept
  const handleSubmit = async (input: RecipeInput) => {
    const id = await createRecipe(input);
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
          <Link to="/profil">Jetzt anmelden oder registrieren</Link>
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
