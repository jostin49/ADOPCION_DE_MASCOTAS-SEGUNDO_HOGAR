// Punto de arranque del servidor: solo define el puerto y pone a escuchar la app.
import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API de Segundo Hogar escuchando en http://localhost:${PORT}`);
});
