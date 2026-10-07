import { useState, type SyntheticEvent } from 'react';
import { useAuthStore, useAuthActions } from '../store/auth-store';

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useAuthStore((s) => s.error);
  const info = useAuthStore((s) => s.info);
  const { login, register, resetPassword } = useAuthActions();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(email, password, name);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return;
    await resetPassword(email);
  };

  return (
    <form onSubmit={handleSubmit} className="form form--auth">
      <h2>{mode === 'login' ? 'Anmelden' : 'Registrieren'}</h2>

      {mode === 'register' && (
        <label>
          Name
          <input
            type="text"
            value={name}
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
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Passwort
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </label>

      {error && <p className="form__error">{error}</p>}
      {info && <p className="form__info">{info}</p>}

      <button type="submit">
        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
      </button>

      {mode === 'login' && (
        <button
          type="button"
          className="btn btn--default"
          onClick={handleForgotPassword}
        >
          Passwort vergessen?
        </button>
      )}

      <button
        type="button"
        className="btn btn--default"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login'
          ? 'Noch kein Konto? Registrieren'
          : 'Schon registriert? Anmelden'}
      </button>
    </form>
  );
}
