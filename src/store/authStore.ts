import { create } from 'zustand';
import type { User } from 'firebase/auth';
import * as authService from '../services/authService';

interface AuthState {
  currentUser: User | undefined; // undefined = still loading
  displayName: string | null;
  photoURL: string | null;
  error: string | null;
  info: string | null; // success message, e.g. after "forgot password"
  actions: AuthActions;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: (currentPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => {
  // Shared error handling: reset messages, write errors to the store
  const run = async (fn: () => Promise<unknown>) => {
    set({ error: null, info: null });
    try {
      await fn();
    } catch (e) {
      set({ error: (e as Error).message });
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
          await authService.register(email, password, name);
          set({ displayName: name });
        }),

      logout: () => run(() => authService.logout()),

      updateName: (name) =>
        run(async () => {
          await authService.updateName(name);
          set({ displayName: name });
        }),

      changePassword: (currentPassword, newPassword) =>
        run(() => authService.changePassword(currentPassword, newPassword)),

      uploadAvatar: (file) =>
        run(async () => {
          const photoURL = await authService.uploadAvatar(file);
          set({ photoURL });
        }),

      deleteAvatar: () =>
        run(async () => {
          await authService.deleteAvatar();
          set({ photoURL: null });
        }),

      resetPassword: (email) =>
        run(async () => {
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
    },
  };
});

export const useAuthActions = () => useAuthStore((s) => s.actions);
export const selectIsAnonymous = (s: AuthState) =>
  s.currentUser?.isAnonymous ?? true;
