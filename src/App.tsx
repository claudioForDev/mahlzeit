import { Header } from './components/layout/Header/Header';
import { Routes, Route } from 'react-router-dom';
import { ProfilePage } from './pages/profile/ProfilePage';
import { Navigation } from './components/layout/Navigation/Navigation';
import { HomePage } from './pages/HomePage/HomePage';
import { RecipesPage } from './pages/RecipesPage/RecipesPage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { CreateRecipePage } from './pages/CreateRecipePage/CreateRecipePage';

function App() {
  return (
    <>
      <Header />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rezepte" element={<RecipesPage />} />
          <Route path="/favoriten" element={<FavoritesPage />} />
          <Route path="/erstellen" element={<CreateRecipePage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/profil/bearbeiten" element={<EditProfilePage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
