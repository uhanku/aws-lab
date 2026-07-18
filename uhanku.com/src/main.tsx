import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import favicon from './assets/favicon.svg';
import favicon48 from './assets/favicon-48x48.png';
import './index.css';
import App from './App';

for (const definition of [
  { href: favicon, type: 'image/svg+xml', sizes: 'any' },
  { href: favicon48, type: 'image/png', sizes: '48x48' },
]) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = definition.href;
  link.type = definition.type;
  link.sizes = definition.sizes;
  document.head.appendChild(link);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
