import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuracion de Vite: plugin de React y puerto fijo 5173.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
