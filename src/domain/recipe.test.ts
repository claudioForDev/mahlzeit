import { describe, it, expect } from 'vitest';
import {
  computeWithin,
  targetWidths,
  toSearchTitle,
  toSrcSet,
  validateRecipeInput,
  scaleAmount,
  type RecipeInput,
} from './recipe';

const validInput: RecipeInput = {
  title: 'Älplermagronen',
  description: '',
  prepMinutes: 10,
  cookMinutes: 20,
  mealType: 'hauptgericht',
  seasons: ['herbst', 'winter'],
  diets: { vegetarisch: true },
  ingredients: [{ name: 'Hörnli', amount: 300, unit: 'g' }],
  steps: ['Hörnli kochen.'],
  baseServings: 4,
};

describe('computeWithin', () => {
  it('setzt alle Flags, deren Grenze nicht überschritten wird', () => {
    expect(computeWithin(15)).toEqual({
      max15: true,
      max30: true,
      max60: true,
    });
    expect(computeWithin(30)).toEqual({ max30: true, max60: true });
    expect(computeWithin(45)).toEqual({ max60: true });
  });

  it('setzt kein Flag bei mehr als 60 Minuten', () => {
    expect(computeWithin(61)).toEqual({});
  });
});

describe('toSearchTitle', () => {
  it('schreibt den Titel klein, inkl. Umlaute', () => {
    expect(toSearchTitle('Älplermagronen mit Apfelmus')).toBe(
      'älplermagronen mit apfelmus',
    );
  });
});

describe('validateRecipeInput', () => {
  it('akzeptiert ein vollständiges Rezept', () => {
    expect(validateRecipeInput(validInput)).toEqual([]);
  });

  it('meldet fehlenden Titel, Zutaten und Schritte', () => {
    const errors = validateRecipeInput({
      ...validInput,
      title: '   ',
      ingredients: [{ name: '', amount: 0, unit: 'g' }],
      steps: [''],
    });
    expect(errors).toEqual([
      'Titel fehlt.',
      'Mindestens eine Zutat angeben.',
      'Mindestens einen Zubereitungsschritt angeben.',
    ]);
  });

  it('meldet ungültige Zahlen', () => {
    const errors = validateRecipeInput({
      ...validInput,
      cookMinutes: -5,
      baseServings: 0,
    });
    expect(errors).toEqual([
      'Zeiten dürfen nicht negativ sein.',
      'Mindestens eine Portion angeben.',
    ]);
  });
});

describe('targetWidths', () => {
  it('erzeugt alle Stufen bei einem grossen Original', () => {
    expect(targetWidths(4000)).toEqual([400, 800, 1200, 1600, 2000]);
  });

  it('ergänzt die Originalbreite, wenn sie zwischen zwei Stufen liegt', () => {
    expect(targetWidths(1000)).toEqual([400, 800, 1000]);
  });

  it('skaliert ein kleines Original nicht hoch', () => {
    expect(targetWidths(300)).toEqual([300]);
  });

  it('erzeugt keine doppelte Breite, wenn das Original genau einer Stufe entspricht', () => {
    expect(targetWidths(800)).toEqual([400, 800]);
  });
});

describe('toSrcSet', () => {
  it('verbindet URLs mit ihrer Breite', () => {
    expect(
      toSrcSet([
        { width: 400, url: 'a.webp' },
        { width: 800, url: 'b.webp' },
      ]),
    ).toBe('a.webp 400w, b.webp 800w');
  });
});

describe('scaleAmount', () => {
  it('rechnet proportional um', () => {
    expect(scaleAmount(300, 4, 2)).toBe(150);
    expect(scaleAmount(300, 4, 5)).toBe(375);
  });

  it('rundet auf eine Nachkommastelle', () => {
    expect(scaleAmount(1, 3, 2)).toBe(0.7);
  });
});
