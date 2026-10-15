// Mensaje reutilizable de estado: exito, error o informacion.
// Siempre combina color + icono + texto (nunca solo el color).
import { CircleCheck, CircleAlert, Info } from 'lucide-react';

const CONFIG = {
  exito: { Icono: CircleCheck, rol: 'status' },
  error: { Icono: CircleAlert, rol: 'alert' },
  info: { Icono: Info, rol: 'status' },
};

export default function Mensaje({ tipo = 'info', texto, detalles = [], children, id }) {
  const { Icono, rol } = CONFIG[tipo] || CONFIG.info;

  return (
    <div className={`mensaje mensaje--${tipo}`} role={rol} id={id}>
      <Icono className="icono" strokeWidth={1.75} aria-hidden="true" />
      <div className="mensaje__contenido">
        <p className="mensaje__texto">{texto}</p>
        {detalles.length > 0 && (
          <ul className="mensaje__lista">
            {detalles.map((detalle) => (
              <li key={detalle}>{detalle}</li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </div>
  );
}
