// Controlador: recibe la peticion, usa el validador y el servicio, y responde.
import crypto from 'crypto';
import { leerRegistros, guardarRegistro } from '../services/almacenamiento.service.js';
import { validarRegistro } from '../validators/registro.validator.js';

// GET /registros -> 200 con el arreglo de solicitudes.
export async function listarRegistros(req, res) {
  try {
    const registros = await leerRegistros();
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al leer registros:', error.message);
    res.status(500).json({ error: 'No se pudieron leer los registros' });
  }
}

// POST /registros -> 201 creado | 400 datos invalidos | 500 error al guardar.
export async function crearRegistro(req, res) {
  const { errores, datos } = validarRegistro(req.body);

  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
  }

  // El servidor genera id y creadoEn; nunca confia en valores enviados por el cliente.
  const nuevo = {
    id: crypto.randomUUID(),
    ...datos,
    creadoEn: new Date().toISOString(),
  };

  try {
    await guardarRegistro(nuevo);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al guardar registro:', error.message);
    res.status(500).json({ error: 'No se pudo guardar el registro' });
  }
}
