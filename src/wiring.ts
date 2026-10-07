import * as authService from './services/authService';
import { useAuthStore } from './store/auth-store';

export function initWiring() {
  // Firebase Auth -> Store
  authService.watchAuth((user) =>
    useAuthStore.setState({
      currentUser: user,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }),
  );
}
