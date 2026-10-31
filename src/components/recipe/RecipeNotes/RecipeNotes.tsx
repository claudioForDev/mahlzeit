import { useEffect, useState, type SyntheticEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAnonymous } from '../../../store/authStore';
import { useNoteStore, useNoteActions } from '../../../store/noteStore';
import styles from './RecipeNotes.module.scss';

interface RecipeNotesProps {
  recipeId: string;
}

// Personal note on a recipe, stored per user (also anonymous).
// Render with key={recipeId} so the state resets when the recipe changes.
export function RecipeNotes({ recipeId }: RecipeNotesProps) {
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const location = useLocation();
  const savedNote = useNoteStore((s) => s.text);
  const saving = useNoteStore((s) => s.saving);
  const error = useNoteStore((s) => s.error);
  const { loadNote, saveNote } = useNoteActions();
  const [note, setNote] = useState<string | null>(null); // null = unchanged

  useEffect(() => {
    loadNote(recipeId);
  }, [recipeId, loadNote]);

  const noteText = note ?? savedNote;

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const saved = await saveNote(recipeId, noteText);
    if (saved) setNote(null); // on error, the typed text is kept
  };

  return (
    <form className={`form ${styles.noteForm}`} onSubmit={handleSubmit}>
      <h2 id="notes-title" className={styles.title}>
        Meine Notizen
      </h2>
      <textarea
        aria-labelledby="notes-title"
        value={noteText}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />
      {error && <p className="form__error">{error}</p>}
      {isAnonymous && (
        <p className={styles.notesInfo}>
          {/* from: return to this recipe after login */}
          <Link to="/profil" state={{ from: location.pathname }}>
            Registriere dich
          </Link>
          , damit deine Notizen dauerhaft gespeichert bleiben.
        </p>
      )}
      <button
        type="submit"
        className={`btn btn--default ${styles.submitBtn}`}
        disabled={saving || note === null}
      >
        {saving ? 'Wird gespeichert …' : 'Notiz speichern'}
      </button>
    </form>
  );
}
