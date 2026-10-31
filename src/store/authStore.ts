import { create } from 'zustand';
import type { User } from 'firebase/auth';
import * as authService from '../services/authService';
import { getErrorMessage } from '../domain/errors';
import { isValidEmail } from '../domain/auth';

interface AuthState {
  currentUser: User | undefined; // undefined = still loading
  displayName: string | null;
  photoURL: string | null;
  error: string | null;
  info: string | null; // success message, e.g. after "forgot password"
  actions: AuthActions;
}

// Actions return whether they succeeded (e.g. to close a form only on success)
interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateName: (name: string) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  deleteAvatar: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  deleteAccount: (currentPassword: string) => Promise<boolean>;
  clearMessages: () => void;
}

export const useAuthStore = create<AuthState>()((set) => {
  // Shared error handling: reset messages, write errors to the store
  const run = async (fn: () => Promise<unknown>) => {
    set({ error: null, info: null });
    try {
      await fn();
      return true;
    } catch (e) {
      set({ error: getErrorMessage(e) });
      return false;
    }
  };

  return {
    currentUser: undefined,
    displayName: null,
    photoURL: null,
    error: null,
    info: null,
    actions: {
      login: (email, password) => run(() => authService.login(email, password)),

      register: (email, password, name) =>
        run(async () => {
          // Firebase also accepts "name@domain" without a TLD
          if (!isValidEmail(email)) {
            throw new Error('Bitte gib eine gültige E-Mail-Adresse ein.');
          }
          await authService.register(email, password, name);
          set({ displayName: name });
        }),

      logout: () => run(() => authService.logout()),

      updateName: (name) =>
        run(async () => {
          await authService.updateName(name);
          set({ displayName: name, info: 'Name wurde gespeichert.' });
        }),

      changePassword: (currentPassword, newPassword) =>
        run(async () => {
          await authService.changePassword(currentPassword, newPassword);
          set({ info: 'Passwort wurde geändert.' });
        }),

      uploadAvatar: (file) =>
        run(async () => {
          const photoURL = await authService.uploadAvatar(file);
          set({ photoURL, info: 'Profilbild wurde gespeichert.' });
        }),

      deleteAvatar: () =>
        run(async () => {
          await authService.deleteAvatar();
          set({ photoURL: null, info: 'Profilbild wurde gelöscht.' });
        }),

      resetPassword: (email) =>
        run(async () => {
          if (!email) {
            throw new Error('Bitte gib zuerst deine E-Mail-Adresse ein.');
          }
          await authService.resetPassword(email);
          set({
            info: 'E-Mail zum Zurücksetzen des Passworts wurde gesendet.',
          });
        }),

      deleteAccount: (currentPassword) =>
        run(async () => {
          await authService.deleteAccount(currentPassword);
          set({ info: 'Konto wurde gelöscht.' });
        }),

      // e.g. when switching between login and register
      clearMessages: () => set({ error: null, info: null }),
    },
  };
});

export const useAuthActions = () => useAuthStore((s) => s.actions);
export const selectIsAnonymous = (s: AuthState) =>
  s.currentUser?.isAnonymous ?? true;
