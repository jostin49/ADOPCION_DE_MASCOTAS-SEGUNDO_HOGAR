// Punto de entrada de React: carga fuentes, estilos (en orden) y el enrutador.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Tipografias locales (no dependen de internet al ejecutar)
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/500.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-serif-4/600.css';
import '@fontsource/source-serif-4/700.css';

// Estilos propios, en el orden definido en la seccion 13.6
import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/componentes.css';
import './styles/paginas.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
