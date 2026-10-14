// Middlewares de error: responden en JSON y evitan que el servidor se detenga.

// 404 para rutas que no existen en la API.
export function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

// Manejador global de errores (Express lo reconoce por tener 4 parametros).
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // JSON mal formado en el cuerpo de la peticion -> 400.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: ['El cuerpo de la petición no es un JSON válido.'],
    });
  }

  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
