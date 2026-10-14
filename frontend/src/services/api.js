// Servicio de comunicacion con la API de Express.
// La URL base se lee de la variable de entorno VITE_API_URL (archivo frontend/.env).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Error propio para distinguir "servidor apagado" de "servidor respondio con error".
export class ErrorApi extends Error {
  constructor(mensaje, { tipo, estado, detalles = [] } = {}) {
    super(mensaje);
    this.tipo = tipo; // 'red' | 'servidor'
    this.estado = estado; // codigo HTTP (400, 500...)
    this.detalles = detalles; // lista de mensajes de validacion del servidor
  }
}

// Realiza la peticion y convierte la respuesta en JSON o en ErrorApi.
async function peticion(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
  } catch {
    // fetch solo falla aqui si no hay conexion (backend apagado, CORS, red).
    throw new ErrorApi('Sin conexión con el servidor', { tipo: 'red' });
  }

  const cuerpo = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new ErrorApi(cuerpo?.error || 'Error del servidor', {
      tipo: 'servidor',
      estado: respuesta.status,
      detalles: cuerpo?.detalles || [],
    });
  }

  return cuerpo;
}

// GET /registros -> arreglo de solicitudes
export function obtenerRegistros() {
  return peticion('/registros');
}

// POST /registros -> solicitud creada (con id y creadoEn)
export function crearRegistro(datos) {
  return peticion('/registros', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}
