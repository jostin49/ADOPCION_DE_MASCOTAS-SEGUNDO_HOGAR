// Componente raiz: layout comun (header, main, footer) y definicion de rutas.
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Inicio from './pages/Inicio.jsx';
import Registro from './pages/Registro.jsx';
import Lista from './pages/Lista.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';

export default function App() {
  return (
    <div className="pagina">
      <Navbar />

      <main className="pagina__contenido">
        <div className="contenedor">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/lista" element={<Lista />} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <div className="contenedor">
          <p>Segundo Hogar — Proyecto académico de Desarrollo Web</p>
        </div>
      </footer>
    </div>
  );
}
