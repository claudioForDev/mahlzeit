import { useState } from 'react';
import { scaleAmount, type Ingredient } from '../../../domain/recipe';
import styles from './IngredientList.module.scss';

interface IngredientListProps {
  ingredients: Ingredient[];
  baseServings: number;
}

// Zutaten mit Portionenrechner; die Mengen werden aus den Originalwerten berechnet, nie gespeichert.
// Mit key={recipe.id} einbinden, damit die gewählten Portionen beim Rezeptwechsel zurückgesetzt werden.
export function IngredientList({
  ingredients,
  baseServings,
}: IngredientListProps) {
  const [servings, setServings] = useState(baseServings);

  return (
    <div className={styles.ingredients}>
      <div className={styles.ingredientsHeader}>
        <h2>Zutaten</h2>

        <div className={styles.amount}>
          <button
            type="button"
            onClick={() => setServings(servings - 1)}
            disabled={servings <= 1}
            aria-label="Eine Portion weniger"
          >
            −
          </button>
          <span className={styles.servings}>{servings} Portionen</span>
          <button
            type="button"
            onClick={() => setServings(servings + 1)}
            aria-label="Eine Portion mehr"
          >
            +
          </button>
        </div>
      </div>

      <table>
        <tbody>
          {ingredients.map((ing, index) => (
            <tr key={index}>
              <td>{ing.name}</td>
              <td>
                {ing.amount > 0 &&
                  `${scaleAmount(ing.amount, baseServings, servings)} ${ing.unit}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
