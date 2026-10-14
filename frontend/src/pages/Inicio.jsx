// Pagina de inicio (/): presentacion y seccion "Como funciona".
import { Link } from 'react-router-dom';
import { FilePlus2, ClipboardList, FilePenLine, Save, Search } from 'lucide-react';
import useTituloDocumento from '../utils/useTituloDocumento.js';
import imagenMascotas from '../assets/mascotas.png';

const PASOS = [
  {
    Icono: FilePenLine,
    titulo: 'Completa el formulario',
    texto: 'Indica tus datos, la mascota de interés y el motivo de la adopción.',
  },
  {
    Icono: Save,
    titulo: 'Guarda tu solicitud',
    texto: 'La solicitud queda registrada en el sistema de forma permanente.',
  },
  {
    Icono: Search,
    titulo: 'Consulta el listado',
    texto: 'Revisa en cualquier momento las solicitudes registradas.',
  },
];

export default function Inicio() {
  useTituloDocumento('Inicio');

  return (
    <>
      <section className="inicio__presentacion" aria-labelledby="titulo-inicio">
        <div className="inicio__contenido">
          <h1 className="inicio__titulo" id="titulo-inicio">
            Solicitudes de adopción de mascotas
          </h1>
          <p className="inicio__descripcion">
            Registra tu interés por adoptar una mascota y consulta las solicitudes recibidas. Un
            proceso simple y ordenado para que cada animal encuentre un hogar responsable.
          </p>
          <div className="grupo-botones">
            <Link to="/registro" className="boton boton--primario" id="inicio-registrar">
              <FilePlus2 className="icono" strokeWidth={1.75} aria-hidden="true" />
              Registrar solicitud
            </Link>
            <Link to="/lista" className="boton boton--secundario" id="inicio-ver-lista">
              <ClipboardList className="icono" strokeWidth={1.75} aria-hidden="true" />
              Ver solicitudes
            </Link>
          </div>
        </div>

        <div className="inicio__imagen-envoltura">
          <img
            src={imagenMascotas}
            alt="Ilustración de mascotas esperando adopción: perros, gatos, ave y conejo"
            className="inicio__imagen"
          />
        </div>
      </section>

      <section className="inicio__pasos" aria-labelledby="titulo-como-funciona">
        <h2 id="titulo-como-funciona">Cómo funciona</h2>
        <ol className="grilla grilla--3">
          {PASOS.map(({ Icono, titulo, texto }, indice) => (
            <li key={titulo} className="tarjeta paso">
              <div className="paso__cabecera">
                <span className="circulo-icono">
                  <Icono className="icono icono--lg" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="paso__numero" aria-hidden="true">
                  {String(indice + 1).padStart(2, '0')}
                </span>
              </div>
              <h3>{titulo}</h3>
              <p className="paso__texto">{texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
