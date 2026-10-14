// Pagina de registro (/registro): envia la solicitud a la API y muestra el resultado.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FormularioAdopcion from '../components/FormularioAdopcion.jsx';
import Mensaje from '../components/Mensaje.jsx';
import { crearRegistro } from '../services/api.js';
import useTituloDocumento from '../utils/useTituloDocumento.js';

const MENSAJE_ERROR_SERVIDOR = 'No se pudo registrar la solicitud. Revisa los datos e inténtalo de nuevo.';
const MENSAJE_ERROR_RED =
  'No se pudo conectar con el servidor. Verifica que esté en ejecución e inténtalo de nuevo.';

export default function Registro() {
  useTituloDocumento('Registrar solicitud');

  // estado: null | { tipo: 'exito' } | { tipo: 'error', texto, detalles }
  const [resultado, setResultado] = useState(null);

  async function enviarSolicitud(datos) {
    setResultado(null);
    try {
      await crearRegistro(datos);
      setResultado({ tipo: 'exito' });
    } catch (error) {
      setResultado({
        tipo: 'error',
        texto: error.tipo === 'red' ? MENSAJE_ERROR_RED : MENSAJE_ERROR_SERVIDOR,
        detalles: error.detalles || [],
      });
    }
  }

  return (
    <section className="registro" aria-labelledby="titulo-registro">
      <header className="encabezado">
        <h1 id="titulo-registro">Registrar solicitud de adopción</h1>
        <p className="encabezado__texto">Todos los campos son obligatorios.</p>
      </header>

      <div>
        {resultado?.tipo === 'exito' && (
          <div className="registro__mensaje">
            <Mensaje tipo="exito" texto="Solicitud registrada correctamente." id="mensaje-exito">
              <p>
                <Link to="/lista" className="boton boton--secundario" id="exito-ver-lista">
                  Ver solicitudes
                  <ArrowRight className="icono" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </p>
            </Mensaje>
          </div>
        )}
        {resultado?.tipo === 'error' && (
          <div className="registro__mensaje">
            <Mensaje tipo="error" texto={resultado.texto} detalles={resultado.detalles} id="mensaje-error" />
          </div>
        )}
      </div>

      <div className="tarjeta tarjeta--formulario">
        <FormularioAdopcion onEnviar={enviarSolicitud} />
      </div>
    </section>
  );
}
