// Rutas de /registros: asocian cada metodo HTTP con su funcion del controlador.
import { Router } from 'express';
import { listarRegistros, crearRegistro } from '../controllers/registros.controller.js';

const router = Router();

router.get('/', listarRegistros);
router.post('/', crearRegistro);

export default router;
