# Plan de pruebas — Segundo Hogar

| # | Prueba | Pasos | Resultado esperado | Estado |
|---|--------|-------|--------------------|--------|
| 1 | Registro válido | Llenar el formulario correctamente y enviar | Mensaje de éxito; aparece en `/lista`; 201 en la API | Completado |
| 2 | Campos vacíos | Enviar el formulario vacío | Errores por campo; no se hace la petición | Completado |
| 3 | Email inválido | Escribir `maria@` | Mensaje de formato de email | Completado |
| 4 | Fecha pasada | Elegir la fecha de ayer | "La fecha no puede ser anterior a hoy." | Completado |
| 5 | Rechazo en servidor | POST con curl/Postman con datos inválidos | 400 con `detalles` | Completado |
| 6 | Consulta | GET `/registros` | 200 con arreglo | Completado |
| 7 | Lista vacía | `registros.json` = `[]` | "Aún no hay solicitudes registradas." | Completado |
| 8 | Error de red | Apagar backend y abrir `/lista` | Mensaje de error + Reintentar | Completado |
| 9 | Persistencia | Crear registros → reiniciar backend → consultar | Los registros siguen ahí | Completado |
| 10 | Archivo inexistente | Borrar `registros.json` y arrancar | Se crea con `[]` | Completado |
| 11 | Responsive | Probar en 320, 375, 768, 1024 y 1440 px | Sin desplazamiento horizontal | Completado |
| 12 | HTML semántico | Revisar las tres pantallas | Un `h1` por página, `header`/`nav`/`main`/`footer`, `label` en cada campo | Completado |
| 13 | Variables CSS | Cambiar `--color-primario` en `variables.css` | El color cambia en todo el aplicativo | Completado |

## Comandos útiles

```bash
# Prueba 5: datos inválidos
curl -i -X POST http://localhost:4000/registros -H "Content-Type: application/json" -d '{"nombre":"A","email":"maria@","especie":"Dragon"}'

# Prueba 6: consulta
curl -i http://localhost:4000/registros
```

Comprobación de desbordamiento horizontal (consola del navegador):

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```
