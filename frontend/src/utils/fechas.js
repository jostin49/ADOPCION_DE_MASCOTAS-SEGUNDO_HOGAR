// Funciones de formato de fechas para mostrar en la interfaz (es-EC).

// '2026-11-05' -> '05/11/2026'. Se construye con hora local para evitar desfases de zona horaria.
export function formatearFecha(fechaISO) {
  if (!fechaISO) return '';
  const [a, m, d] = fechaISO.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// '2026-10-12T15:30:00.000Z' -> '12/10/2026 10:30'
export function formatearFechaHora(fechaHoraISO) {
  if (!fechaHoraISO) return '';
  const fecha = new Date(fechaHoraISO);
  const dia = fecha.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora = fecha.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${dia} ${hora}`;
}
