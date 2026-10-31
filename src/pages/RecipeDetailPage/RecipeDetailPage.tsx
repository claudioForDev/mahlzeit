import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecipeStore, useRecipeActions } from '../../store/recipeStore';
import {
  toSrcSet,
  MEAL_TYPE_LABELS,
  SEASON_LABELS,
  DIET_LABELS,
  type Diet,
} from '../../domain/recipe';
import { IngredientList } from '../../components/recipe/IngredientList/IngredientList';
import { RecipeNotes } from '../../components/recipe/RecipeNotes/RecipeNotes';
import styles from './RecipeDetailPage.module.scss';
import { ShareButton } from '../../components/recipe/ShareButton/ShareButton';
import { FormMessage } from '../../components/ui/FormMessage/FormMessage';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { loadRecipe } = useRecipeActions();
  const currentRecipe = useRecipeStore((s) => s.currentRecipe);
  const error = useRecipeStore((s) => s.error);
  const [loaded, setLoaded] = useState(false);

  // App.tsx only renders the page once a user is signed in
  useEffect(() => {
    if (id) loadRecipe(id).then(() => setLoaded(true));
  }, [id, loadRecipe]);

  // Only show the matching recipe, not a previously loaded one
  const recipe = currentRecipe?.id === id ? currentRecipe : null;

  if (error) return <FormMessage type="error">{error}</FormMessage>;

  if (!recipe) {
    return loaded ? (
      <>
        <h1 className={styles.title}>Rezept nicht gefunden</h1>
        <Link to="/rezepte" className="btn btn--back">
          Zurück zu den Rezepten
        </Link>
      </>
    ) : (
      <p>Rezept wird geladen …</p>
    );
  }

  // diets only contains selected entries ({ vegan: true }), so the keys are enough
  const diets = Object.keys(recipe.diets) as Diet[];

  // Don't show times without a value (0 min)
  const times = [
    { name: 'Vorbereitung', minutes: recipe.prepMinutes },
    { name: 'Kochen', minutes: recipe.cookMinutes },
    { name: 'Gesamt', minutes: recipe.prepMinutes + recipe.cookMinutes },
  ].filter((time) => time.minutes > 0);

  return (
    <div className={styles.recipe}>
      <title>{`${recipe.title} | mahlzeit`}</title>

      <header className={styles.header}>
        {recipe.images?.length ? (
          <img
            className={styles.heroImage}
            src={recipe.images.at(-1)?.url}
            srcSet={toSrcSet(recipe.images)}
            sizes="100vw"
            alt=""
          />
        ) : null}

        <Link to="/rezepte" className={`btn btn--back ${styles.backBtn}`}>
          zurück
        </Link>

        {/* TODO: favorites, once the module is built */}
        <button type="button" className={`btn btn--favorite ${styles.favBtn}`}>
          Favorit
        </button>

        <div className={styles.titleArea}>
          {diets.length > 0 && (
            <ul className={styles.tagList}>
              {diets.map((diet) => (
                <li key={diet}>{DIET_LABELS[diet]}</li>
              ))}
            </ul>
          )}

          <h1 className={styles.title}>{recipe.title}</h1>
        </div>
      </header>

      <div className={styles.additionalInfos}>
        <div className={styles.times}>
          {times.map((time) => (
            <div key={time.name} className={styles.item}>
              <span className={styles.itemName}>{time.name}</span>
              <span className={styles.itemTime}>{time.minutes}</span>
              <span className={styles.itemMinutes}>Min.</span>
            </div>
          ))}
        </div>

        <div className={styles.categories}>
          <span className={styles.mealType}>
            {MEAL_TYPE_LABELS[recipe.mealType]}
          </span>

          {recipe.seasons.length > 0 && (
            <span className={styles.seasons}>
              {recipe.seasons.map((s) => SEASON_LABELS[s]).join(', ')}
            </span>
          )}
        </div>
      </div>

      {recipe.description && (
        <p className={styles.description}>{recipe.description}</p>
      )}

      {/* key: reset the components' state when switching to another recipe */}
      <IngredientList
        key={`ingredients-${recipe.id}`}
        ingredients={recipe.ingredients}
        baseServings={recipe.baseServings}
      />

      <div className={styles.preparation}>
        <h2>Zubereitung</h2>
        <ol>
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <RecipeNotes key={`notes-${recipe.id}`} recipeId={recipe.id} />
      <ShareButton title="Teilen" className="btn btn--default" />
    </div>
  );
}
