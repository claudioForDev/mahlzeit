import { Header } from './components/layout/Header/Header';
import { Routes, Route } from 'react-router-dom';
import { ProfilePage } from './pages/profile/ProfilePage';
import { Navigation } from './components/layout/Navigation/Navigation';
import { HomePage } from './pages/HomePage/HomePage';
import { RecipesPage } from './pages/RecipesPage/RecipesPage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { CreateRecipePage } from './pages/CreateRecipePage/CreateRecipePage';
import { RecipeDetailPage } from './pages/RecipeDetailPage/RecipeDetailPage';
import { useAuthStore } from './store/authStore';

function App() {
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <>
      <Header />
      <Navigation />
      <main>
        {/* Only render pages once Firebase has signed in (also anonymously).
            This way every page can load right away without waiting for the user itself. */}
        {currentUser ? <AppRoutes /> : <p>Laden …</p>}
      </main>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/rezepte" element={<RecipesPage />} />
      <Route path="/favoriten" element={<FavoritesPage />} />
      <Route path="/erstellen" element={<CreateRecipePage />} />
      <Route path="/profil" element={<ProfilePage />} />
      <Route path="/profil/bearbeiten" element={<EditProfilePage />} />
      <Route path="/rezepte/:id" element={<RecipeDetailPage />} />
    </Routes>
  );
}

export default App;
