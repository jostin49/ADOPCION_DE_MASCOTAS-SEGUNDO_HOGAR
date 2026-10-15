// Pagina de lista (/lista): consulta GET /registros y muestra las tarjetas.
// Estados: cargando, error, vacia y con datos.
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Inbox, FilePlus2 } from 'lucide-react';
import TarjetaSolicitud from '../components/TarjetaSolicitud.jsx';
import Mensaje from '../components/Mensaje.jsx';
import Cargando from '../components/Cargando.jsx';
import { obtenerRegistros } from '../services/api.js';
import useTituloDocumento from '../utils/useTituloDocumento.js';

const textoContador = (n) => (n === 1 ? '1 solicitud' : `${n} solicitudes`);

export default function Lista() {
  useTituloDocumento('Solicitudes');

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(false);
    try {
      const datos = await obtenerRegistros();
      // Mas recientes primero (creadoEn descendente)
      const ordenados = [...datos].sort((a, b) => (b.creadoEn || '').localeCompare(a.creadoEn || ''));
      setSolicitudes(ordenados);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga automatica al entrar a la pagina.
  useEffect(() => {
    cargar();
  }, [cargar]);

  function renderContenido() {
    if (cargando) return <Cargando texto="Cargando solicitudes..." />;

    if (error) {
      return (
        <Mensaje
          tipo="error"
          texto="No se pudieron cargar las solicitudes. Verifica la conexión con el servidor."
          id="mensaje-error-lista"
        >
          <p>
            <button type="button" className="boton boton--secundario" onClick={cargar} id="boton-reintentar">
              <RefreshCw className="icono" strokeWidth={1.75} aria-hidden="true" />
              Reintentar
            </button>
          </p>
        </Mensaje>
      );
    }

    if (solicitudes.length === 0) {
      return (
        <div className="tarjeta estado">
          <span className="circulo-icono circulo-icono--lg">
            <Inbox className="icono icono--lg" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="estado__texto">Aún no hay solicitudes registradas.</p>
          <Link to="/registro" className="boton boton--primario" id="boton-primera-solicitud">
            <FilePlus2 className="icono" strokeWidth={1.75} aria-hidden="true" />
            Registrar la primera solicitud
          </Link>
        </div>
      );
    }

    return (
      <ul className="grilla grilla--lista">
        {solicitudes.map((solicitud) => (
          <li key={solicitud.id} className="lista__item">
            <TarjetaSolicitud solicitud={solicitud} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section aria-labelledby="titulo-lista">
      <header className="lista__encabezado">
        <div className="lista__resumen">
          <h1 id="titulo-lista">Solicitudes registradas</h1>
          {!cargando && !error && (
            <p className="lista__contador" aria-live="polite">
              {textoContador(solicitudes.length)}
            </p>
          )}
        </div>
        <button
          type="button"
          className="boton boton--secundario"
          onClick={cargar}
          disabled={cargando}
          id="boton-actualizar"
        >
          <RefreshCw className="icono" strokeWidth={1.75} aria-hidden="true" />
          Actualizar
        </button>
      </header>

      {renderContenido()}
    </section>
  );
}
