// Pagina 404 para rutas que no existen.
import { Link } from 'react-router-dom';
import { CircleAlert, ArrowLeft } from 'lucide-react';
import useTituloDocumento from '../utils/useTituloDocumento.js';

export default function NoEncontrada() {
  useTituloDocumento('Página no encontrada');

  return (
    <section className="tarjeta estado no-encontrada" aria-labelledby="titulo-404">
      <span className="circulo-icono circulo-icono--lg">
        <CircleAlert className="icono icono--lg" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <h1 id="titulo-404">Página no encontrada</h1>
      <p className="estado__texto">La dirección que buscas no existe.</p>
      <Link to="/" className="boton boton--primario" id="boton-volver-inicio">
        <ArrowLeft className="icono" strokeWidth={1.75} aria-hidden="true" />
        Volver al inicio
      </Link>
    </section>
  );
}
