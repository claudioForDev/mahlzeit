import { useState, type SyntheticEvent } from 'react';
import { useAuthStore, useAuthActions } from '../../store/authStore';
import { FormMessage } from '../ui/FormMessage/FormMessage';
import styles from './AuthForm.module.scss';

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useAuthStore((s) => s.error);
  const info = useAuthStore((s) => s.info);
  const { login, register, resetPassword, clearMessages } = useAuthActions();

  // Hide old messages when switching, they belong to the other form
  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setPassword(''); // new password when registering, keep the email
    clearMessages();
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(email, password, name);
    }
  };

  const handleForgotPassword = async () => {
    await resetPassword(email);
  };

  return (
    <>
      <title>Profil | mahlzeit</title>
      <form onSubmit={handleSubmit} className="form form--auth">
        <div className={styles.navigation}>
          <button
            type="button"
            className={`btn btn--login ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Anmelden
          </button>

          <button
            type="button"
            className={`btn btn--login ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Registrieren
          </button>
        </div>

        <h2 className={styles.title}>
          {mode === 'login' ? 'Anmelden' : 'Registrieren'}
        </h2>

        {mode === 'register' && (
          <label>
            Name
            <input
              type="text"
              value={name}
              placeholder="Dein Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        )}

        <label>
          E-Mail
          <input
            type="email"
            value={email}
            placeholder="name@beispiel.ch"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Passwort
          <input
            type="password"
            value={password}
            placeholder="Mindestens 6 Zeichen"
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {mode === 'login' && (
          <button
            type="button"
            className="btn btn--link"
            onClick={handleForgotPassword}
          >
            Passwort vergessen?
          </button>
        )}

        {error && <FormMessage type="error">{error}</FormMessage>}
        {info && <FormMessage type="info">{info}</FormMessage>}

        <button type="submit" className="btn btn--submit">
          {mode === 'login' ? 'Anmelden' : 'Registrieren'}
        </button>

        <p className={styles.switch}>
          {mode === 'login' ? 'Noch kein Konto? ' : 'Schon registriert? '}
          <button
            type="button"
            className="btn btn--link"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Registrieren' : 'Anmelden'}
          </button>
        </p>
      </form>
    </>
  );
}
