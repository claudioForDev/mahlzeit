import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';
import { Plus, X } from 'lucide-react';
import {
  UNITS,
  MEAL_TYPE_LABELS,
  SEASON_LABELS,
  DIET_LABELS,
  validateRecipeInput,
  type RecipeInput,
  type Season,
  type Diet,
  type Unit,
} from '../../../domain/recipe';
import { ChipGroup } from '../ChipGroup/ChipGroup';
import styles from './RecipeForm.module.scss';

// Number fields as strings so an empty field stays empty (instead of showing 0)
interface IngredientRow {
  name: string;
  amount: string;
  unit: Unit;
}

type FormState = Omit<
  RecipeInput,
  'prepMinutes' | 'cookMinutes' | 'baseServings' | 'ingredients'
> & {
  prepMinutes: string;
  cookMinutes: string;
  baseServings: string;
  ingredients: IngredientRow[];
};

const EMPTY_INGREDIENT: IngredientRow = { name: '', amount: '', unit: 'g' };

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  prepMinutes: '',
  cookMinutes: '',
  baseServings: '4',
  mealType: 'hauptgericht',
  seasons: [],
  diets: {},
  ingredients: [EMPTY_INGREDIENT],
  steps: [''],
};

// Convert strings to numbers and drop empty rows
function toRecipeInput(form: FormState): RecipeInput {
  return {
    ...form,
    title: form.title.trim(),
    description: form.description.trim(),
    prepMinutes: Number(form.prepMinutes),
    cookMinutes: Number(form.cookMinutes),
    baseServings: Number(form.baseServings),
    ingredients: form.ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({
        name: i.name.trim(),
        amount: Number(i.amount),
        unit: i.unit,
      })),
    steps: form.steps.map((s) => s.trim()).filter(Boolean),
  };
}

const removeAt = <T,>(list: T[], index: number) =>
  list.filter((_, i) => i !== index);

interface RecipeFormProps {
  onSubmit: (input: RecipeInput, image?: File) => Promise<void>;
  submitLabel: string;
  submitting: boolean;
  error: string | null; // server error, e.g. missing permission
}

export function RecipeForm({
  onSubmit,
  submitLabel,
  submitting,
  error,
}: RecipeFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  // File kept separately because it isn't part of RecipeInput (resized and uploaded in the service)
  const [image, setImage] = useState<File | null>(null);

  // Preview as a local URL; revoked on change or unmount
  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image],
  );
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] ?? null);
    e.target.value = ''; // so the same file can be picked again after removing it
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const updateIngredient = (index: number, patch: Partial<IngredientRow>) =>
    update(
      'ingredients',
      form.ingredients.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      ),
    );

  const updateStep = (index: number, value: string) =>
    update(
      'steps',
      form.steps.map((step, i) => (i === index ? value : step)),
    );

  const toggleSeason = (season: Season) =>
    update(
      'seasons',
      form.seasons.includes(season)
        ? form.seasons.filter((s) => s !== season)
        : [...form.seasons, season],
    );

  // diets is a map { vegan: true } so Firestore can filter by it; deselected = remove the key
  const toggleDiet = (diet: Diet) => {
    const { [diet]: wasSelected, ...rest } = form.diets;
    update('diets', wasSelected ? rest : { ...form.diets, [diet]: true });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = toRecipeInput(form);
    const errors = validateRecipeInput(input);
    setValidationErrors(errors);
    if (errors.length === 0) await onSubmit(input, image ?? undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`form ${styles.recipeForm}`}
      noValidate
    >
      <label className={styles.field}>
        <span className={styles.label}>Titel *</span>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Name des Rezepts"
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Beschreibung</span>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Kurze Beschreibung des Gerichts …"
          rows={3}
        />
      </label>

      <div className={styles.field}>
        <span className={styles.label}>Bild</span>
        {previewUrl && (
          <img src={previewUrl} alt="Vorschau" className={styles.preview} />
        )}
        <div className={styles.imageActions}>
          <label className="btn btn--default">
            {image ? 'Bild ändern' : 'Bild hinzufügen'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
          {image && (
            <button
              type="button"
              className="btn btn--default"
              onClick={() => setImage(null)}
            >
              Bild entfernen
            </button>
          )}
        </div>
      </div>

      <div className={styles.numbers}>
        <label className={styles.field}>
          <span className={styles.label}>Zubereitung (Min.)</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={form.prepMinutes}
            onChange={(e) => update('prepMinutes', e.target.value)}
            placeholder="15"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Kochzeit (Min.)</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={form.cookMinutes}
            onChange={(e) => update('cookMinutes', e.target.value)}
            placeholder="30"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Portionen</span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={form.baseServings}
            onChange={(e) => update('baseServings', e.target.value)}
          />
        </label>
      </div>

      <ChipGroup
        legend="Speiseart"
        name="mealType"
        type="radio"
        options={MEAL_TYPE_LABELS}
        isSelected={(value) => form.mealType === value}
        onToggle={(value) => update('mealType', value)}
      />

      <ChipGroup
        legend="Jahreszeit"
        name="seasons"
        type="checkbox"
        options={SEASON_LABELS}
        isSelected={(value) => form.seasons.includes(value)}
        onToggle={toggleSeason}
      />

      <ChipGroup
        legend="Ernährungsform"
        name="diets"
        type="checkbox"
        options={DIET_LABELS}
        isSelected={(value) => form.diets[value] === true}
        onToggle={toggleDiet}
      />

      <fieldset>
        <legend className={styles.label}>Zutaten</legend>
        <ul className={styles.rows}>
          {form.ingredients.map((row, index) => (
            <li key={index} className={styles.ingredient}>
              <input
                type="text"
                value={row.name}
                onChange={(e) =>
                  updateIngredient(index, { name: e.target.value })
                }
                placeholder="Zutat"
                aria-label={`Zutat ${index + 1}`}
                className={styles.ingredientName}
              />
              <input
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                value={row.amount}
                onChange={(e) =>
                  updateIngredient(index, { amount: e.target.value })
                }
                placeholder="Menge"
                aria-label={`Menge Zutat ${index + 1}`}
              />
              <select
                value={row.unit}
                onChange={(e) =>
                  updateIngredient(index, { unit: e.target.value as Unit })
                }
                aria-label={`Einheit Zutat ${index + 1}`}
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {form.ingredients.length > 1 && (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() =>
                    update('ingredients', removeAt(form.ingredients, index))
                  }
                  aria-label={`Zutat ${index + 1} entfernen`}
                >
                  <X size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={styles.add}
          onClick={() =>
            update('ingredients', [...form.ingredients, EMPTY_INGREDIENT])
          }
        >
          <Plus size={18} /> Zutat hinzufügen
        </button>
      </fieldset>

      <fieldset>
        <legend className={styles.label}>Zubereitungsschritte</legend>
        <ol className={styles.rows}>
          {form.steps.map((step, index) => (
            <li key={index} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {index + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder={`Schritt ${index + 1} …`}
                aria-label={`Schritt ${index + 1}`}
                rows={2}
              />
              {form.steps.length > 1 && (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => update('steps', removeAt(form.steps, index))}
                  aria-label={`Schritt ${index + 1} entfernen`}
                >
                  <X size={18} />
                </button>
              )}
            </li>
          ))}
        </ol>
        <button
          type="button"
          className={styles.add}
          onClick={() => update('steps', [...form.steps, ''])}
        >
          <Plus size={18} /> Schritt hinzufügen
        </button>
      </fieldset>

      {validationErrors.length > 0 && (
        <ul className="form__error" role="alert">
          {validationErrors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? 'Wird gespeichert …' : submitLabel}
      </button>
    </form>
  );
}
