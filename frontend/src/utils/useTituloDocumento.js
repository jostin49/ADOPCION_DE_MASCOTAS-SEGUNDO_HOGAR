// Hook pequeño para poner el titulo de la pestaña en cada ruta.
import { useEffect } from 'react';

export default function useTituloDocumento(titulo) {
  useEffect(() => {
    document.title = `${titulo} | Segundo Hogar`;
  }, [titulo]);
}
