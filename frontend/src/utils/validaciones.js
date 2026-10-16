// Validaciones del cliente: mismas reglas y mensajes que el servidor
// garantizando consistencia y validación por campo.

export const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
export const MIN_NOMBRE = 2;
export const MAX_NOMBRE = 60;
export const MIN_MASCOTA = 2;
export const MAX_MASCOTA = 60;
export const MIN_DESCRIPCION = 10;
export const MAX_DESCRIPCION = 500;

export const REGEX_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
export const REGEX_NOMBRE_MASCOTA = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
export const REGEX_TIENE_LETRAS = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/;

export const OBLIGATORIO = 'Este campo es obligatorio.';

// Fecha de hoy en formato YYYY-MM-DD (hora local), usada tambien como atributo min.
export function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Fecha maxima permitida (1 anio en adelante), usada como atributo max.
export function maxFechaISO(aniosAdelante = 1) {
  const d = new Date();
  d.setFullYear(d.getFullYear() + aniosAdelante);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function esFechaReal(valor) {
  if (!REGEX_FECHA.test(valor)) return false;
  const [a, m, d] = valor.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  return fecha.getFullYear() === a && fecha.getMonth() === m - 1 && fecha.getDate() === d;
}

// Cada funcion recibe el valor y devuelve el mensaje de error o '' si es valido.
export const reglas = {
  nombre: (v) => {
    const val = String(v ?? '').trim();
    if (!val) return OBLIGATORIO;
    if (/\d/.test(val)) return 'El nombre no debe contener números, solo letras y espacios.';
    if (!REGEX_SOLO_LETRAS.test(val)) return 'El nombre solo debe contener letras y espacios.';
    if (val.length < MIN_NOMBRE || val.length > MAX_NOMBRE) {
      return `Ingresa un nombre de entre ${MIN_NOMBRE} y ${MAX_NOMBRE} caracteres.`;
    }
    return '';
  },

  email: (v) => {
    const val = String(v ?? '').trim();
    if (!val) return OBLIGATORIO;
    if (/\s/.test(val)) return 'El correo electrónico no debe contener espacios.';
    if (!REGEX_EMAIL.test(val)) {
      return 'Ingresa un correo electrónico válido, por ejemplo nombre@correo.com.';
    }
    return '';
  },

  mascota: (v) => {
    const val = String(v ?? '').trim();
    if (!val) return OBLIGATORIO;
    if (/\d/.test(val)) return 'El nombre de la mascota no debe contener números.';
    if (!REGEX_NOMBRE_MASCOTA.test(val)) {
      return 'El nombre de la mascota solo debe contener letras y espacios.';
    }
    if (val.length < MIN_MASCOTA || val.length > MAX_MASCOTA) {
      return `Ingresa un nombre de mascota de entre ${MIN_MASCOTA} y ${MAX_MASCOTA} caracteres.`;
    }
    return '';
  },

  especie: (v) => {
    const val = String(v ?? '').trim();
    if (!val) return OBLIGATORIO;
    if (!ESPECIES.includes(val)) return 'Selecciona una especie de la lista.';
    return '';
  },

  fecha: (v) => {
    const val = String(v ?? '').trim();
    if (!val) return OBLIGATORIO;
    if (!esFechaReal(val)) return 'Selecciona una fecha válida.';
    const hoy = hoyISO();
    if (val < hoy) return 'La fecha no puede ser anterior a hoy.';
    const max = maxFechaISO(1);
    if (val > max) return 'La fecha propuesta no puede ser posterior a un año.';
    return '';
  },

  descripcion: (v) => {
    const val = String(v ?? '').trim();
    if (!val) return OBLIGATORIO;
    if (val.length < MIN_DESCRIPCION || val.length > MAX_DESCRIPCION) {
      return `El motivo debe tener entre ${MIN_DESCRIPCION} y ${MAX_DESCRIPCION} caracteres.`;
    }
    if (!REGEX_TIENE_LETRAS.test(val)) {
      return 'Describe el motivo usando palabras y texto legible.';
    }
    return '';
  },
};

// Valida un solo campo (se usa en onBlur y al corregir).
export function validarCampo(nombreCampo, valor) {
  const regla = reglas[nombreCampo];
  return regla ? regla(String(valor ?? '')) : '';
}

// Valida todo el formulario. Devuelve un objeto { campo: mensaje } solo con los errores.
export function validarFormulario(datos) {
  const errores = {};
  Object.keys(reglas).forEach((campo) => {
    const mensaje = validarCampo(campo, datos[campo]);
    if (mensaje) errores[campo] = mensaje;
  });
  return errores;
}
