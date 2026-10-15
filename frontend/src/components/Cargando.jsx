// Indicador de carga: spinner (icono con giro CSS) + texto.
import { LoaderCircle } from 'lucide-react';

export default function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="cargando" role="status">
      <LoaderCircle className="icono icono--xl icono--girando" strokeWidth={1.75} aria-hidden="true" />
      <p>{texto}</p>
    </div>
  );
}
