# Segundo Hogar

Aplicación web para registrar y consultar solicitudes de adopción de mascotas.

Segundo Hogar es una aplicación de página única (SPA) en React que se comunica con una API REST en Node.js + Express. Las solicitudes se guardan de forma persistente en un archivo JSON.

## Integrantes y aportes

- Aaron Bayas — Backend y API
- Jostin Chalan — Frontend base (rutas, layout, estilos)
- Jefferson Zambrano — Formulario e integración con la API
- Mayerly Pilozo — Visualización, pruebas y documentación

## Requisitos

- Node.js 18 o superior, npm, Git

## Estructura

```
.
├── backend/    API Express (puerto 4000) y data/registros.json
├── frontend/   SPA React + Vite (puerto 5173)
└── docs/       Plan de pruebas
```

## Instalación y ejecución

Abrir **dos terminales**, una para cada parte.

### Backend (puerto 4000)

```bash
cd backend
npm install
npm run dev      # o: npm start
```

### Frontend (puerto 5173)

```bash
cd frontend
cp .env.example .env      # en Windows PowerShell: Copy-Item .env.example .env
npm install
npm run dev
```

Abrir http://localhost:5173 en el navegador.

## Conexión React ↔ API

El frontend lee la URL de la API desde la variable `VITE_API_URL` del archivo `frontend/.env` (por defecto `http://localhost:4000`). Toda la comunicación está centralizada en `frontend/src/services/api.js` (`obtenerRegistros()` y `crearRegistro()`).

El backend tiene CORS habilitado para el origen `http://localhost:5173`.

## API

| Método | Ruta | Respuesta |
|--------|------|-----------|
| GET | `/registros` | `200` lista de solicitudes |
| POST | `/registros` | `201` solicitud creada · `400` datos inválidos · `500` error al guardar |

### Ejemplos con curl

```bash
curl http://localhost:4000/registros

curl -X POST http://localhost:4000/registros \
  -H "Content-Type: application/json" \
  -d '{"nombre":"María López","email":"maria@correo.com","mascota":"Max","especie":"Perro","descripcion":"Tengo casa con patio y experiencia.","fecha":"2026-11-05"}'
```

Respuesta de error (400):

```json
{ "error": "Datos inválidos", "detalles": ["Ingresa un correo electrónico válido, por ejemplo nombre@correo.com."] }
```

### Reglas de validación (cliente y servidor)

| Campo | Regla |
|-------|-------|
| `nombre` | obligatorio, 2–60 caracteres |
| `email` | obligatorio, formato válido |
| `mascota` | obligatorio, 2–60 caracteres |
| `especie` | Perro, Gato, Conejo, Ave u Otro |
| `descripcion` | obligatorio, 10–500 caracteres |
| `fecha` | `YYYY-MM-DD`, fecha válida, no anterior a hoy |

## Flujo de datos

Formulario → fetch POST → Express → registros.json → fetch GET → Lista

1. La persona completa el formulario en `/registro`; el estado de React controla los valores.
2. El cliente valida; si todo es correcto, `api.js` envía `POST /registros`.
3. Express valida de nuevo, genera `id` (`crypto.randomUUID()`) y `creadoEn`, y agrega el registro a `registros.json`.
4. La API responde `201` (o `400`/`500`).
5. En `/lista`, `api.js` hace `GET /registros` y se muestran las tarjetas.

## Pruebas realizadas

Ver [docs/PLAN_PRUEBAS.md](docs/PLAN_PRUEBAS.md).
