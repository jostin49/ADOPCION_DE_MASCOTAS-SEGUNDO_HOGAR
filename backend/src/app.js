// Configuracion de Express: CORS, lectura de JSON, rutas y manejo de errores.
import express from 'express';
import cors from 'cors';
import registrosRoutes from './routes/registros.routes.js';
import { errorHandler, rutaNoEncontrada } from './middlewares/errorHandler.js';

const app = express();

// CORS: permite que el frontend (Vite, puerto 5173) consulte esta API (puerto 4000).
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));

// Convierte el cuerpo JSON de las peticiones en un objeto JavaScript (req.body).
app.use(express.json());

// Ruta de cortesia para comprobar que la API esta viva.
app.get('/', (req, res) => {
  res.status(200).json({ mensaje: 'API de Segundo Hogar en funcionamiento' });
});

// Rutas de la entidad principal.
app.use('/registros', registrosRoutes);

// Rutas inexistentes y errores no controlados.
app.use(rutaNoEncontrada);
app.use(errorHandler);

export default app;
