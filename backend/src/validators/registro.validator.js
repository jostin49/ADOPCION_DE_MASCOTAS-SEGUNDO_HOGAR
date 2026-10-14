// Validacion en servidor: mismas reglas y mensajes que el formulario del cliente.

export const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;

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

  // nombre
  if (!datos.nombre) errores.push(`nombre: ${OBLIGATORIO}`);
  else if (datos.nombre.length < 2 || datos.nombre.length > 60)
    errores.push('Ingresa un nombre de entre 2 y 60 caracteres.');

  // email
  if (!datos.email) errores.push(`email: ${OBLIGATORIO}`);
  else if (!REGEX_EMAIL.test(datos.email))
    errores.push('Ingresa un correo electrónico válido, por ejemplo nombre@correo.com.');

  // mascota
  if (!datos.mascota) errores.push(`mascota: ${OBLIGATORIO}`);
  else if (datos.mascota.length < 2 || datos.mascota.length > 60)
    errores.push('Ingresa un nombre de mascota de entre 2 y 60 caracteres.');

  // especie
  if (!datos.especie) errores.push(`especie: ${OBLIGATORIO}`);
  else if (!ESPECIES.includes(datos.especie))
    errores.push('Selecciona una especie de la lista.');

  // descripcion
  if (!datos.descripcion) errores.push(`descripcion: ${OBLIGATORIO}`);
  else if (datos.descripcion.length < 10 || datos.descripcion.length > 500)
    errores.push('El motivo debe tener entre 10 y 500 caracteres.');

  // fecha (formato YYYY-MM-DD se puede comparar como texto)
  if (!datos.fecha || !esFechaReal(datos.fecha)) errores.push('Selecciona una fecha válida.');
  else if (datos.fecha < hoyISO()) errores.push('La fecha no puede ser anterior a hoy.');

  return { errores, datos };
}
