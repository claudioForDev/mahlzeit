// Firebase error codes → readable German messages
const ERROR_MESSAGES: Record<string, string> = {
  // Auth
  'auth/invalid-credential': 'E-Mail oder Passwort ist falsch.',
  'auth/wrong-password': 'E-Mail oder Passwort ist falsch.',
  'auth/user-not-found': 'E-Mail oder Passwort ist falsch.',
  'auth/invalid-email': 'Bitte gib eine gültige E-Mail-Adresse ein.',
  'auth/email-already-in-use':
    'Mit dieser E-Mail-Adresse gibt es bereits ein Konto.',
  'auth/credential-already-in-use':
    'Mit dieser E-Mail-Adresse gibt es bereits ein Konto.',
  'auth/weak-password': 'Das Passwort muss mindestens 6 Zeichen lang sein.',
  'auth/missing-password': 'Bitte gib ein Passwort ein.',
  'auth/too-many-requests':
    'Zu viele Versuche. Bitte warte kurz und versuche es erneut.',
  'auth/requires-recent-login':
    'Bitte melde dich aus Sicherheitsgründen erneut an.',
  'auth/network-request-failed':
    'Keine Verbindung. Bitte prüfe deine Internetverbindung.',
  // Firestore
  'permission-denied': 'Dafür hast du keine Berechtigung.',
  unavailable:
    'Der Server ist gerade nicht erreichbar. Bitte versuche es später erneut.',
  // Storage
  'storage/unauthorized': 'Das Bild konnte nicht hochgeladen werden.',
};

const FALLBACK = 'Etwas ist schiefgelaufen. Bitte versuche es erneut.';

export function getErrorMessage(e: unknown): string {
  // Firebase error: translate via the code
  if (typeof e === 'object' && e !== null && 'code' in e) {
    return ERROR_MESSAGES[String(e.code)] ?? FALLBACK;
  }
  // Our own errors (e.g. from imageService) are already German
  if (e instanceof Error) return e.message;
  return FALLBACK;
}
