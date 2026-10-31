import { describe, it, expect } from 'vitest';
import { isValidEmail } from './auth';

describe('isValidEmail', () => {
  it('akzeptiert normale Adressen', () => {
    expect(isValidEmail('mail@marisamueller.ch')).toBe(true);
    expect(isValidEmail('vorname.nachname@schule.edu.ch')).toBe(true);
  });

  it('ignoriert Leerzeichen am Anfang und Ende', () => {
    expect(isValidEmail('  mail@beispiel.ch ')).toBe(true);
  });

  it('lehnt Adressen ohne Endung ab', () => {
    expect(isValidEmail('mail@mar')).toBe(false);
    expect(isValidEmail('mail@mar.c')).toBe(false);
  });

  it('lehnt Adressen ohne @ oder mit Leerzeichen ab', () => {
    expect(isValidEmail('mailbeispiel.ch')).toBe(false);
    expect(isValidEmail('mail @beispiel.ch')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
