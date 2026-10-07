import { create } from 'zustand';
import type { User } from 'firebase/auth';
import * as authService from '../services/authService';

interface AuthState {
  currentUser: User | undefined; // undefined = wird noch geladen
  displayName: string | null;
  photoURL: string | null;
  error: string | null;
  info: string | null; // Erfolgsmeldung, z. B. nach "Passwort vergessen"
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

export const useAuthStore = create<AuthState>()((set) => ({
  currentUser: undefined,
  displayName: null,
  photoURL: null,
  error: null,
  info: null,
  actions: {
    login: async (email, password) => {
      set({ error: null, info: null });
      try {
        await authService.login(email, password);
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
    register: async (email, password, name) => {
      set({ error: null });
      try {
        await authService.register(email, password, name);
        set({ displayName: name });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
    logout: async () => {
      await authService.logout();
    },
    updateName: async (name) => {
      set({ error: null });
      try {
        await authService.updateName(name);
        set({ displayName: name });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
    changePassword: async (currentPassword, newPassword) => {
      set({ error: null });
      try {
        await authService.changePassword(currentPassword, newPassword);
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
    uploadAvatar: async (file) => {
      set({ error: null });
      try {
        const photoURL = await authService.uploadAvatar(file);
        set({ photoURL });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
    deleteAvatar: async () => {
      set({ error: null });
      try {
        await authService.deleteAvatar();
        set({ photoURL: null });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
    resetPassword: async (email) => {
      set({ error: null, info: null });
      try {
        await authService.resetPassword(email);
        set({ info: 'E-Mail zum Zurücksetzen des Passworts wurde gesendet.' });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
    deleteAccount: async (currentPassword) => {
      set({ error: null, info: null });
      try {
        await authService.deleteAccount(currentPassword);
        set({ info: 'Konto wurde gelöscht.' });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
  },
}));

export const useAuthActions = () => useAuthStore((s) => s.actions);
export const selectIsAnonymous = (s: AuthState) =>
  s.currentUser?.isAnonymous ?? true;
