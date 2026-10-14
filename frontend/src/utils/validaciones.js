// Validaciones del cliente: mismas reglas que el servidor
// y mensajes de los campos obligatorios, el correo y la fecha.

export const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
export const MAX_DESCRIPCION = 500;

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const OBLIGATORIO = 'Este campo es obligatorio.';

// Fecha de hoy en formato YYYY-MM-DD (hora local), usada tambien como atributo min.
export function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function esFechaReal(valor) {
  if (!REGEX_FECHA.test(valor)) return false;
  const [a, m, d] = valor.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  return fecha.getFullYear() === a && fecha.getMonth() === m - 1 && fecha.getDate() === d;
}

const largoEntre = (valor, min, max) => valor.length >= min && valor.length <= max;

// Cada funcion recibe el valor y devuelve el mensaje de error o '' si es valido.
const reglas = {
  nombre: (v) => {
    if (!v) return OBLIGATORIO;
    return largoEntre(v, 2, 60) ? '' : 'Ingresa un nombre de entre 2 y 60 caracteres.';
  },
  email: (v) => {
    if (!v) return OBLIGATORIO;
    return REGEX_EMAIL.test(v)
      ? ''
      : 'Ingresa un correo electrónico válido, por ejemplo nombre@correo.com.';
  },
  mascota: (v) => {
    if (!v) return OBLIGATORIO;
    return largoEntre(v, 2, 60) ? '' : 'Ingresa un nombre de mascota de entre 2 y 60 caracteres.';
  },
  especie: (v) => {
    if (!v) return OBLIGATORIO;
    return ESPECIES.includes(v) ? '' : 'Selecciona una especie de la lista.';
  },
  fecha: (v) => {
    if (!v || !esFechaReal(v)) return 'Selecciona una fecha válida.';
    return v < hoyISO() ? 'La fecha no puede ser anterior a hoy.' : '';
  },
  descripcion: (v) => {
    if (!v) return OBLIGATORIO;
    return largoEntre(v, 10, MAX_DESCRIPCION) ? '' : 'El motivo debe tener entre 10 y 500 caracteres.';
  },
};

// Valida un solo campo (se usa en onBlur y al corregir).
export function validarCampo(nombreCampo, valor) {
  const regla = reglas[nombreCampo];
  return regla ? regla(String(valor ?? '').trim()) : '';
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
