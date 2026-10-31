import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './errors';

const FALLBACK = 'Etwas ist schiefgelaufen. Bitte versuche es erneut.';

describe('getErrorMessage', () => {
  it('übersetzt bekannte Firebase-Codes', () => {
    expect(getErrorMessage({ code: 'auth/email-already-in-use' })).toBe(
      'Mit dieser E-Mail-Adresse gibt es bereits ein Konto.',
    );
    expect(getErrorMessage({ code: 'permission-denied' })).toBe(
      'Dafür hast du keine Berechtigung.',
    );
  });

  it('zeigt bei allen Login-Fehlern dieselbe Meldung', () => {
    const codes = [
      'auth/invalid-credential',
      'auth/wrong-password',
      'auth/user-not-found',
    ];
    for (const code of codes) {
      expect(getErrorMessage({ code })).toBe(
        'E-Mail oder Passwort ist falsch.',
      );
    }
  });

  it('nutzt den Code auch bei einem echten Error-Objekt mit code', () => {
    const e = Object.assign(
      new Error('Firebase: Error (auth/weak-password).'),
      {
        code: 'auth/weak-password',
      },
    );
    expect(getErrorMessage(e)).toBe(
      'Das Passwort muss mindestens 6 Zeichen lang sein.',
    );
  });

  it('zeigt bei unbekannten Codes die Fallback-Meldung statt Englisch', () => {
    expect(getErrorMessage({ code: 'auth/something-new' })).toBe(FALLBACK);
  });

  it('übernimmt die Meldung eigener Fehler', () => {
    expect(getErrorMessage(new Error('Das Bild ist zu gross.'))).toBe(
      'Das Bild ist zu gross.',
    );
  });

  it('zeigt bei allem anderen die Fallback-Meldung', () => {
    expect(getErrorMessage('kaputt')).toBe(FALLBACK);
    expect(getErrorMessage(null)).toBe(FALLBACK);
    expect(getErrorMessage(undefined)).toBe(FALLBACK);
  });
});
