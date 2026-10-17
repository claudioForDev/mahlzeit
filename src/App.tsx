import { Header } from './components/layout/Header/Header';
import { Routes, Route } from 'react-router-dom';
import { ProfilePage } from './pages/profile/ProfilePage';
import { Navigation } from './components/layout/Navigation/Navigation';
import { HomePage } from './pages/HomePage/HomePage';
import { RecipesPage } from './pages/RecipesPage/RecipesPage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { EditProfilePage } from './pages/profile/EditProfilePage';

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
          <Route path="/erstellen" element={<h1>Erstellen</h1>} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/profil/bearbeiten" element={<EditProfilePage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
