// Formulario controlado de solicitud de adopcion.
// - Cada campo vive en el estado "valores".
// - Restringe caracteres invalidos en tiempo real (ej. no permite numeros en nombres).
// - Se valida al salir de cada campo (onBlur), al corregir y al enviar.
// - Si hay errores no se llama a onEnviar y el foco va al primer campo con error.
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
  LoaderCircle,
} from 'lucide-react';
import {
  ESPECIES,
  MAX_DESCRIPCION,
  hoyISO,
  maxFechaISO,
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
            <p className="campo__error" id={`${id}-error`} role="alert">
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

export default function FormularioAdopcion({ onEnviar, enviando }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const formRef = useRef(null);

  // Evita el ingreso de caracteres no deseados en tiempo de pulsación (números en nombres, espacios en emails, etc.)
  function manejarKeyDown(evento) {
    const { name } = evento.target;

    // Permitir siempre atajos de teclado y teclas de control del sistema
    if (
      evento.key === 'Backspace' ||
      evento.key === 'Delete' ||
      evento.key === 'Tab' ||
      evento.key === 'Escape' ||
      evento.key === 'Enter' ||
      evento.key === 'ArrowLeft' ||
      evento.key === 'ArrowRight' ||
      evento.key === 'ArrowUp' ||
      evento.key === 'ArrowDown' ||
      evento.key === 'Home' ||
      evento.key === 'End' ||
      evento.ctrlKey ||
      evento.metaKey ||
      evento.altKey ||
      evento.key.length > 1 // Manejar teclas muertas/acento
    ) {
      return;
    }

    if (name === 'nombre') {
      // Bloquear números y símbolos en el nombre completo
      if (/\d/.test(evento.key)) {
        evento.preventDefault();
        return;
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/.test(evento.key)) {
        evento.preventDefault();
        return;
      }
    }

    if (name === 'mascota') {
      // Bloquear números en el nombre de la mascota
      if (/\d/.test(evento.key)) {
        evento.preventDefault();
        return;
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]$/.test(evento.key)) {
        evento.preventDefault();
        return;
      }
    }

    if (name === 'email') {
      // No permitir espacios en el correo electrónico
      if (evento.key === ' ') {
        evento.preventDefault();
        return;
      }
    }
  }

  // Actualiza el valor sanitizado; si el campo ya tenia error, se revalida para quitarlo al corregir.
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    let valorLimpio = value;

    if (name === 'nombre') {
      // Garantizar solo letras y espacios incluso al pegar con portapapeles
      valorLimpio = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    } else if (name === 'mascota') {
      valorLimpio = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
    } else if (name === 'email') {
      valorLimpio = value.replace(/\s/g, '');
    }

    setValores((previos) => ({ ...previos, [name]: valorLimpio }));

    // Si ya mostraba un error para este campo, revalidar en vivo mientras escribe
    if (errores[name]) {
      setErrores((previos) => ({ ...previos, [name]: validarCampo(name, valorLimpio) }));
    }
  }

  // Valida el campo al salir de el (onBlur).
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
      return; // no se envia nada con datos invalidos
    }

    // Se envian los textos recortados (sin espacios al inicio/fin).
    const datos = Object.fromEntries(
      Object.entries(valores).map(([clave, valor]) => [clave, valor.trim()])
    );
    const exito = await onEnviar(datos);
    if (exito) limpiar();
  }

  // Atributos de accesibilidad comunes para cada control.
  const propsControl = (nombre) => ({
    id: `campo-${nombre}`,
    name: nombre,
    value: valores[nombre],
    onChange: manejarCambio,
    onBlur: manejarSalida,
    onKeyDown: manejarKeyDown,
    'aria-invalid': errores[nombre] ? 'true' : 'false',
    'aria-describedby': errores[nombre] ? `campo-${nombre}-error` : undefined,
    className: `campo__control${errores[nombre] ? ' campo__control--error' : ''}`,
  });

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate ref={formRef} id="formulario-adopcion">
      <fieldset className="formulario" disabled={enviando}>
        <legend className="solo-lectores">Datos de la solicitud de adopción</legend>

        <div className="formulario__fila">
          <Campo id="campo-nombre" etiqueta="Nombre completo del solicitante" Icono={User} error={errores.nombre}>
            <input
              type="text"
              placeholder="Ej.: María López"
              autoComplete="name"
              maxLength={60}
              {...propsControl('nombre')}
            />
          </Campo>

          <Campo id="campo-email" etiqueta="Correo electrónico" Icono={Mail} error={errores.email}>
            <input
              type="email"
              placeholder="nombre@correo.com"
              autoComplete="email"
              {...propsControl('email')}
            />
          </Campo>
        </div>

        <div className="formulario__fila">
          <Campo id="campo-mascota" etiqueta="Nombre de la mascota" Icono={PawPrint} error={errores.mascota}>
            <input
              type="text"
              placeholder="Ej.: Max"
              maxLength={60}
              {...propsControl('mascota')}
            />
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
          <input
            type="date"
            min={hoyISO()}
            max={maxFechaISO(1)}
            {...propsControl('fecha')}
          />
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
            {enviando ? (
              <>
                <LoaderCircle className="icono icono--girando" strokeWidth={1.75} aria-hidden="true" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="icono" strokeWidth={1.75} aria-hidden="true" />
                Enviar solicitud
              </>
            )}
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
