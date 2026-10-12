// Servicio de almacenamiento: lee y escribe las solicitudes en data/registros.json.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUTA = path.join(__dirname, '../../data/registros.json');

// Si la carpeta o el archivo no existen, los crea con un arreglo vacio.
async function asegurarArchivo() {
  try {
    await fs.access(RUTA);
  } catch {
    await fs.mkdir(path.dirname(RUTA), { recursive: true });
    await fs.writeFile(RUTA, '[]', 'utf-8');
  }
}

// Devuelve todos los registros. Lanza un error si el archivo esta corrupto;
// el controlador lo captura y responde 500 sin detener el servidor.
export async function leerRegistros() {
  await asegurarArchivo();
  const contenido = await fs.readFile(RUTA, 'utf-8');
  const datos = JSON.parse(contenido.trim() === '' ? '[]' : contenido);
  if (!Array.isArray(datos)) {
    throw new Error('El archivo de registros no contiene un arreglo');
  }
  return datos;
}

// Agrega un registro nuevo sin perder los anteriores.
export async function guardarRegistro(nuevo) {
  const registros = await leerRegistros();
  registros.push(nuevo);
  await fs.writeFile(RUTA, JSON.stringify(registros, null, 2), 'utf-8');
  return nuevo;
}
