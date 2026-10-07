import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initWiring } from './wiring.ts';
import './index.css';
import App from './App.tsx';

initWiring();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
