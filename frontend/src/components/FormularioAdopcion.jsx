// Formulario controlado de solicitud de adopcion.
// Cada campo vive en el estado "valores" y se actualiza con useState.
import { useRef, useState } from 'react';
import {
  User,
  Mail,
  PawPrint,
  Dog,
  CalendarDays,
  MessageSquareText,
  CircleAlert,
  Send,
  Eraser,
} from 'lucide-react';
import {
  ESPECIES,
  MAX_DESCRIPCION,
  hoyISO,
  validarCampo,
  validarFormulario,
} from '../utils/validaciones.js';

const VALORES_INICIALES = {
  nombre: '',
  email: '',
  mascota: '',
  especie: '',
  fecha: '',
  descripcion: '',
};

// Orden de los campos (para enfocar el primero con error).
const ORDEN_CAMPOS = ['nombre', 'email', 'mascota', 'especie', 'fecha', 'descripcion'];

// Subcomponente: envoltura comun de etiqueta + control + mensaje de error.
function Campo({ id, etiqueta, Icono, error, children, contador }) {
  return (
    <div className="campo">
      <label className="campo__etiqueta" htmlFor={id}>
        <Icono className="icono" strokeWidth={1.75} aria-hidden="true" />
        {etiqueta}
      </label>
      {children}
      {(error || contador) && (
        <div className="campo__pie">
          {error && (
            <p className="campo__error" id={`${id}-error`}>
              <CircleAlert className="icono" strokeWidth={1.75} aria-hidden="true" />
              {error}
            </p>
          )}
          {contador}
        </div>
      )}
    </div>
  );
}

export default function FormularioAdopcion({ onEnviar }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const formRef = useRef(null);

  // Actualiza el valor; si el campo ya tenia error, se revalida para quitarlo al corregir.
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((previos) => ({ ...previos, [name]: value }));
    if (errores[name]) {
      setErrores((previos) => ({ ...previos, [name]: validarCampo(name, value) }));
    }
  }

  // Valida el campo al salir de el.
  function manejarSalida(evento) {
    const { name, value } = evento.target;
    setErrores((previos) => ({ ...previos, [name]: validarCampo(name, value) }));
  }

  function limpiar() {
    setValores(VALORES_INICIALES);
    setErrores({});
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = validarFormulario(valores);
    setErrores(nuevosErrores);

    const primerError = ORDEN_CAMPOS.find((campo) => nuevosErrores[campo]);
    if (primerError) {
      formRef.current?.querySelector(`[name="${primerError}"]`)?.focus();
      return;
    }

    const datos = Object.fromEntries(
      Object.entries(valores).map(([clave, valor]) => [clave, valor.trim()])
    );
    await onEnviar(datos);
  }

  // Atributos de accesibilidad comunes para cada control.
  const propsControl = (nombre) => ({
    id: `campo-${nombre}`,
    name: nombre,
    value: valores[nombre],
    onChange: manejarCambio,
    onBlur: manejarSalida,
    'aria-invalid': errores[nombre] ? 'true' : 'false',
    'aria-describedby': errores[nombre] ? `campo-${nombre}-error` : undefined,
    className: `campo__control${errores[nombre] ? ' campo__control--error' : ''}`,
  });

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate ref={formRef} id="formulario-adopcion">
      <fieldset className="formulario">
        <legend className="solo-lectores">Datos de la solicitud de adopción</legend>

        <div className="formulario__fila">
          <Campo id="campo-nombre" etiqueta="Nombre completo del solicitante" Icono={User} error={errores.nombre}>
            <input type="text" placeholder="Ej.: María López" autoComplete="name" maxLength={60} {...propsControl('nombre')} />
          </Campo>

          <Campo id="campo-email" etiqueta="Correo electrónico" Icono={Mail} error={errores.email}>
            <input type="email" placeholder="nombre@correo.com" autoComplete="email" {...propsControl('email')} />
          </Campo>
        </div>

        <div className="formulario__fila">
          <Campo id="campo-mascota" etiqueta="Nombre de la mascota" Icono={PawPrint} error={errores.mascota}>
            <input type="text" placeholder="Ej.: Max" maxLength={60} {...propsControl('mascota')} />
          </Campo>

          <Campo id="campo-especie" etiqueta="Especie" Icono={Dog} error={errores.especie}>
            <select {...propsControl('especie')}>
              <option value="">Selecciona una especie</option>
              {ESPECIES.map((especie) => (
                <option key={especie} value={especie}>
                  {especie}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <Campo id="campo-fecha" etiqueta="Fecha propuesta de visita" Icono={CalendarDays} error={errores.fecha}>
          <input type="date" min={hoyISO()} {...propsControl('fecha')} />
        </Campo>

        <Campo
          id="campo-descripcion"
          etiqueta="Motivo de la adopción"
          Icono={MessageSquareText}
          error={errores.descripcion}
          contador={
            <span className="campo__contador" aria-live="polite">
              {valores.descripcion.length}/{MAX_DESCRIPCION}
            </span>
          }
        >
          <textarea
            rows={5}
            maxLength={MAX_DESCRIPCION}
            placeholder="Cuéntanos por qué deseas adoptar y cómo es tu hogar"
            {...propsControl('descripcion')}
            className={`${propsControl('descripcion').className} campo__control--area`}
          />
        </Campo>

        <div className="formulario__acciones">
          <button type="submit" className="boton boton--primario" id="boton-enviar">
            <Send className="icono" strokeWidth={1.75} aria-hidden="true" />
            Enviar solicitud
          </button>
          <button type="button" className="boton boton--secundario" onClick={limpiar} id="boton-limpiar">
            <Eraser className="icono" strokeWidth={1.75} aria-hidden="true" />
            Limpiar formulario
          </button>
        </div>
      </fieldset>
    </form>
  );
}
