// Validacion en servidor: mismas reglas y mensajes que el formulario del cliente.

export const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
const REGEX_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const REGEX_NOMBRE_MASCOTA = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const REGEX_TIENE_LETRAS = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/;

const OBLIGATORIO = 'Este campo es obligatorio.';

// Convierte cualquier valor a texto recortado (los no-texto se tratan como vacio).
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

// Fecha de hoy en formato YYYY-MM-DD segun la hora local del servidor.
function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Fecha máxima permitida (1 año hacia adelante).
function maxFechaISO(aniosAdelante = 1) {
  const d = new Date();
  d.setFullYear(d.getFullYear() + aniosAdelante);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Comprueba que YYYY-MM-DD sea una fecha real (por ejemplo, rechaza 2026-02-30).
function esFechaReal(valor) {
  if (!REGEX_FECHA.test(valor)) return false;
  const [a, m, d] = valor.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  return fecha.getFullYear() === a && fecha.getMonth() === m - 1 && fecha.getDate() === d;
}

/**
 * Valida el cuerpo de la peticion.
 * Devuelve { errores: string[], datos: objeto limpio con solo los campos del modelo }.
 */
export function validarRegistro(cuerpo = {}) {
  const errores = [];
  const datos = {
    nombre: texto(cuerpo.nombre),
    email: texto(cuerpo.email),
    mascota: texto(cuerpo.mascota),
    especie: texto(cuerpo.especie),
    descripcion: texto(cuerpo.descripcion),
    fecha: texto(cuerpo.fecha),
  };

  // nombre: solo letras y espacios, longitud 2-60
  if (!datos.nombre) {
    errores.push(`nombre: ${OBLIGATORIO}`);
  } else if (/\d/.test(datos.nombre)) {
    errores.push('El nombre no debe contener números, solo letras y espacios.');
  } else if (!REGEX_SOLO_LETRAS.test(datos.nombre)) {
    errores.push('El nombre solo debe contener letras y espacios.');
  } else if (datos.nombre.length < 2 || datos.nombre.length > 60) {
    errores.push('Ingresa un nombre de entre 2 y 60 caracteres.');
  }

  // email: formato valido sin espacios
  if (!datos.email) {
    errores.push(`email: ${OBLIGATORIO}`);
  } else if (/\s/.test(datos.email)) {
    errores.push('El correo electrónico no debe contener espacios.');
  } else if (!REGEX_EMAIL.test(datos.email)) {
    errores.push('Ingresa un correo electrónico válido, por ejemplo nombre@correo.com.');
  }

  // mascota: solo letras y espacios (guion/apostrofe permitidos), longitud 2-60
  if (!datos.mascota) {
    errores.push(`mascota: ${OBLIGATORIO}`);
  } else if (/\d/.test(datos.mascota)) {
    errores.push('El nombre de la mascota no debe contener números.');
  } else if (!REGEX_NOMBRE_MASCOTA.test(datos.mascota)) {
    errores.push('El nombre de la mascota solo debe contener letras y espacios.');
  } else if (datos.mascota.length < 2 || datos.mascota.length > 60) {
    errores.push('Ingresa un nombre de mascota de entre 2 y 60 caracteres.');
  }

  // especie: debe estar en la lista permitida
  if (!datos.especie) {
    errores.push(`especie: ${OBLIGATORIO}`);
  } else if (!ESPECIES.includes(datos.especie)) {
    errores.push('Selecciona una especie de la lista.');
  }

  // descripcion: texto con motivo explicativo (10-500 caracteres)
  if (!datos.descripcion) {
    errores.push(`descripcion: ${OBLIGATORIO}`);
  } else if (datos.descripcion.length < 10 || datos.descripcion.length > 500) {
    errores.push('El motivo debe tener entre 10 y 500 caracteres.');
  } else if (!REGEX_TIENE_LETRAS.test(datos.descripcion)) {
    errores.push('Describe el motivo usando palabras y texto legible.');
  }

  // fecha: formato YYYY-MM-DD real, entre hoy y un anio
  if (!datos.fecha || !esFechaReal(datos.fecha)) {
    errores.push('Selecciona una fecha válida.');
  } else if (datos.fecha < hoyISO()) {
    errores.push('La fecha no puede ser anterior a hoy.');
  } else if (datos.fecha > maxFechaISO(1)) {
    errores.push('La fecha propuesta no puede ser posterior a un año.');
  }

  return { errores, datos };
}
