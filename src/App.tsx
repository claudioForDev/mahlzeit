import { Header } from './components/Header';
import { AuthForm } from './components/AuthForm';
import { useAuthStore, selectIsAnonymous } from './store/auth-store';
import { Routes, Route } from 'react-router-dom';
import { ProfilePage } from './components/ProfilePage';

function App() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAnonymous = useAuthStore(selectIsAnonymous);

  if (!currentUser) {
    return <p>Laden...</p>;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Rezeptliste</h1>} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <main>
        {isAnonymous && <AuthForm />}
        {/* Hier kommt später der Rest der App hin (Rezepte, Favoriten, ...) */}
      </main>
    </>
  );
}

export default App;
