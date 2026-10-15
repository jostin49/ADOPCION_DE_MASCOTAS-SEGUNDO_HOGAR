# Informe de validación del proyecto: Segundo Hogar

Este documento describe las validaciones implementadas en el aplicativo y cómo se verificaron. Las mismas reglas se aplican en el cliente (React) y en el servidor (Express).

## 1. Reglas de validación

| Campo | Regla | Mensaje mostrado |
|---|---|---|
| nombre | Obligatorio, de 2 a 60 caracteres (se eliminan espacios sobrantes) | Ingresa un nombre de entre 2 y 60 caracteres. |
| email | Obligatorio, con formato válido (texto@dominio.extensión) | Ingresa un correo electrónico válido, por ejemplo nombre@correo.com. |
| mascota | Obligatorio, de 2 a 60 caracteres | Ingresa un nombre de mascota de entre 2 y 60 caracteres. |
| especie | Obligatorio, una de: Perro, Gato, Conejo, Ave, Otro | Selecciona una especie de la lista. |
| descripcion | Obligatorio, de 10 a 500 caracteres | El motivo debe tener entre 10 y 500 caracteres. |
| fecha | Obligatoria, formato AAAA-MM-DD, fecha válida y no anterior a hoy | Selecciona una fecha válida. / La fecha no puede ser anterior a hoy. |

Cualquier campo vacío muestra: Este campo es obligatorio.

## 2. Validación en el cliente

- Se valida al enviar el formulario y al salir de cada campo.
- Si hay errores, no se hace la petición al servidor y el foco va al primer campo con error.
- El error de un campo desaparece al corregirlo.
- Mientras se envía, el botón se deshabilita para evitar envíos duplicados.

## 3. Validación en el servidor

- La API vuelve a validar todos los campos, aunque la petición no venga de la interfaz (por ejemplo, desde Postman o curl).
- Si los datos son inválidos, responde 400 con el detalle de los errores.
- Ignora los campos extra y nunca confía en un id enviado por el cliente: el id y la fecha de creación los genera el servidor.

## 4. Códigos de respuesta

| Código | Situación |
|---|---|
| 200 | Consulta correcta (GET /registros) |
| 201 | Solicitud creada (POST /registros) |
| 400 | Datos inválidos, con la lista de detalles |
| 500 | Error interno controlado (por ejemplo, fallo al leer o escribir el archivo) |

## 5. Persistencia y manejo de errores

- Los registros se guardan en backend/data/registros.json y se conservan al reiniciar el backend.
- Si el archivo no existe, el servidor lo crea con un arreglo vacío.
- Los errores de lectura o escritura devuelven 500 sin detener el servidor.
- Si el frontend no puede conectarse al backend, la lista muestra un mensaje de error con el botón Reintentar.

## 6. Resultados de la verificación

| Prueba | Resultado esperado | Resultado |
|---|---|---|
| Formulario vacío | Errores por campo y no se envía | Aprobada |
| Email inválido (maria@) | Mensaje de formato de email | Aprobada |
| Fecha pasada | La fecha no puede ser anterior a hoy | Aprobada |
| POST inválido desde Postman | 400 con detalles | Aprobada |
| Registro válido | 201 y aparece en la lista | Aprobada |
| Persistencia tras reiniciar el backend | Los registros siguen ahí | Aprobada |
| Archivo registros.json inexistente | Se crea con [] | Aprobada |

El detalle completo de los casos de prueba está en docs/PLAN_PRUEBAS.md.