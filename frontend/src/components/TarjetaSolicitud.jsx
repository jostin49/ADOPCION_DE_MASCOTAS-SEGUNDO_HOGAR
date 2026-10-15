// Tarjeta que muestra una solicitud de adopcion (article semantico con dl y time).
import { Dog, Cat, Rabbit, Bird, PawPrint, User, Mail, CalendarDays } from 'lucide-react';
import { formatearFecha, formatearFechaHora } from '../utils/fechas.js';

const ICONOS_ESPECIE = { Perro: Dog, Gato: Cat, Conejo: Rabbit, Ave: Bird, Otro: PawPrint };

export default function TarjetaSolicitud({ solicitud }) {
  const { id, nombre, email, mascota, especie, descripcion, fecha, creadoEn } = solicitud;
  const IconoEspecie = ICONOS_ESPECIE[especie] || PawPrint;
  const idTitulo = `solicitud-${id}`;

  return (
    <article className="tarjeta solicitud" aria-labelledby={idTitulo}>
      <header className="solicitud__cabecera">
        <span className="circulo-icono">
          <IconoEspecie className="icono icono--lg" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h3 className="solicitud__titulo" id={idTitulo}>
          {mascota}
        </h3>
        <span className="badge">{especie}</span>
      </header>

      <dl className="solicitud__datos">
        <div className="solicitud__dato">
          <User className="icono" strokeWidth={1.75} aria-hidden="true" />
          <div className="solicitud__dato-texto">
            <dt className="solicitud__dato-etiqueta">Solicitante</dt>
            <dd className="solicitud__dato-valor">{nombre}</dd>
          </div>
        </div>
        <div className="solicitud__dato">
          <Mail className="icono" strokeWidth={1.75} aria-hidden="true" />
          <div className="solicitud__dato-texto">
            <dt className="solicitud__dato-etiqueta">Correo electrónico</dt>
            <dd className="solicitud__dato-valor">{email}</dd>
          </div>
        </div>
        <div className="solicitud__dato">
          <CalendarDays className="icono" strokeWidth={1.75} aria-hidden="true" />
          <div className="solicitud__dato-texto">
            <dt className="solicitud__dato-etiqueta">Fecha de visita</dt>
            <dd className="solicitud__dato-valor">
              <time dateTime={fecha}>{formatearFecha(fecha)}</time>
            </dd>
          </div>
        </div>
      </dl>

      <p className="solicitud__motivo">{descripcion}</p>

      <footer className="solicitud__pie">
        <p>
          Registrada el <time dateTime={creadoEn}>{formatearFechaHora(creadoEn)}</time>
        </p>
      </footer>
    </article>
  );
}
