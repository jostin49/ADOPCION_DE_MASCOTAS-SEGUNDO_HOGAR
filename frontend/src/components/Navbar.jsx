// Barra de navegacion: logo + enlaces con marca de ruta activa (NavLink).
import { NavLink, Link } from 'react-router-dom';
import { PawPrint, House, FilePlus2, ClipboardList } from 'lucide-react';

const ENLACES = [
  { ruta: '/', texto: 'Inicio', Icono: House },
  { ruta: '/registro', texto: 'Registrar', Icono: FilePlus2 },
  { ruta: '/lista', texto: 'Solicitudes', Icono: ClipboardList },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="contenedor navbar__interior">
        <Link to="/" className="navbar__logo" id="enlace-logo">
          <PawPrint className="navbar__logo-icono" strokeWidth={1.75} aria-hidden="true" />
          Segundo Hogar
        </Link>

        <nav aria-label="Principal">
          <ul className="navbar__lista">
            {ENLACES.map(({ ruta, texto, Icono }) => (
              <li key={ruta}>
                <NavLink
                  to={ruta}
                  end
                  id={`nav-${texto.toLowerCase()}`}
                  className={({ isActive }) =>
                    `navbar__enlace${isActive ? ' navbar__enlace--activo' : ''}`
                  }
                >
                  <Icono className="navbar__icono" strokeWidth={1.75} aria-hidden="true" />
                  {texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
