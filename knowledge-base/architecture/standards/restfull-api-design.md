---
okf_version: "0.2"
id: "STD-API-RESTFUL"
title: "Estándar de Diseño de API RESTful"
status: "ACCEPTED"
date: "2026-09-22"
authors:
  - name: "Área de Arquitectura"
    role: "Core Architecture"
tags:
  - "standard"
  - "api"
  - "rest"
  - "architecture"
domain: "integration-architecture"
impact_level: "HIGH"
---

# Estándar de Diseño de API RESTful

> Este documento define las convenciones obligatorias y las buenas prácticas de industria para el diseño de APIs RESTful dentro de la Plataforma CLocator v2. Aplica a toda API nueva y debe usarse como referencia al evolucionar APIs existentes.

## 1. Principios generales

- **Orientado a recursos**: la API modela recursos (sustantivos), no acciones (verbos). Las acciones se expresan mediante métodos HTTP sobre el recurso.
- **Sin estado (stateless)**: cada request debe contener toda la información necesaria para procesarse; el servidor no mantiene estado de sesión entre requests.
- **Consistencia**: mismos patrones de nombres, paginación, filtrado, errores y versionado en todos los servicios.
- **Contrato primero (API-first)**: la API se diseña y documenta (OpenAPI/Swagger) antes de implementarse.
- **Compatibilidad hacia atrás**: los cambios no deben romper a los consumidores existentes sin pasar por un proceso de versionado y deprecación.

## 2. Nomenclatura de recursos y URIs

- Usar **sustantivos en plural** para colecciones: `/vehicles`, `/drivers`, `/routes`.
- Usar **kebab-case** en minúsculas para segmentos de URI multi-palabra: `/delivery-orders`, no `/deliveryOrders` ni `/delivery_orders`.
- Jerarquía de recursos anidados solo cuando exista una relación de pertenencia clara:
  - `GET /vehicles/{vehicleId}/positions` (posiciones de un vehículo)
- No usar verbos en las rutas (`/getVehicles`, `/createOrder` están prohibidos). El verbo lo da el método HTTP.
- No incluir la versión del recurso, extensión de archivo, ni información de implementación en la URI (`/vehicles.json` está prohibido).
- Los identificadores de recurso van en la ruta, no en query string: `/vehicles/{id}`, no `/vehicles?id={id}`.

## 3. Métodos HTTP

| Método | Uso | Idempotente | Body en request |
|---|---|---|---|
| `GET` | Obtener un recurso o colección | Sí | No |
| `POST` | Crear un recurso nuevo, o ejecutar una acción que no encaja en CRUD | No | Sí |
| `PUT` | Reemplazar completamente un recurso existente | Sí | Sí |
| `PATCH` | Actualizar parcialmente un recurso existente | No* | Sí |
| `DELETE` | Eliminar un recurso | Sí | No |

\* `PATCH` debe implementarse de forma idempotente cuando sea posible (p. ej. usando JSON Merge Patch o JSON Patch), evitando operaciones incrementales no idempotentes (`increment`, `append`) sobre este verbo.

- Usar el método correcto según la semántica de la operación; no usar `GET` para operaciones con efectos secundarios ni `POST` para todo.
- Acciones que no mapean a CRUD (p. ej. "reenviar notificación") se modelan como sub-recursos con verbo nominal: `POST /orders/{id}/cancellation`, no `POST /orders/{id}/cancel`.

## 4. Códigos de estado HTTP

Usar los códigos de estado de forma consistente y semánticamente correcta:

- `200 OK` — solicitud exitosa con contenido de respuesta (`GET`, `PUT`, `PATCH`, algunos `POST`).
- `201 Created` — recurso creado exitosamente (`POST`). Incluir header `Location` con la URI del nuevo recurso.
- `202 Accepted` — solicitud aceptada para procesamiento asíncrono.
- `204 No Content` — solicitud exitosa sin contenido de respuesta (`DELETE`, algunos `PUT`/`PATCH`).
- `400 Bad Request` — la solicitud es sintáctica o semánticamente inválida.
- `401 Unauthorized` — falta autenticación o es inválida.
- `403 Forbidden` — autenticado pero sin permisos sobre el recurso.
- `404 Not Found` — el recurso no existe.
- `405 Method Not Allowed` — método HTTP no soportado para el recurso.
- `409 Conflict` — conflicto con el estado actual del recurso (p. ej. duplicado, violación de concurrencia optimista).
- `422 Unprocessable Entity` — sintácticamente válido pero con errores de validación de negocio.
- `429 Too Many Requests` — se excedió el límite de rate limiting.
- `500 Internal Server Error` — error no controlado del servidor.
- `503 Service Unavailable` — servicio temporalmente no disponible (mantenimiento, sobrecarga).

No usar `200 OK` para respuestas de error con un campo `success: false` en el body; el código HTTP debe reflejar el resultado real.

## 5. Formato de payload

- `JSON` es el formato por defecto (`Content-Type: application/json; charset=utf-8`).
- Nombres de campos en `camelCase`.
- Fechas y horas en formato `ISO 8601` con zona horaria explícita (`2026-09-22T14:30:00Z`).
- Nunca exponer identificadores internos de base de datos si existe un identificador de negocio más adecuado; si se exponen IDs numéricos secuenciales, evaluar el riesgo de enumeración.
- Los payloads de request/response deben validarse contra un esquema (JSON Schema / OpenAPI).

### Estructura de respuesta de error

Usar un formato de error consistente en toda la API, alineado con [RFC 9457 (Problem Details for HTTP APIs)]:

```json
{
  "type": "https://clocator.example.com/errors/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "El campo 'plate' es obligatorio.",
  "instance": "/vehicles",
  "errors": [
    { "field": "plate", "message": "El campo 'plate' es obligatorio." }
  ]
}
```

## 6. Colecciones: paginación, filtrado, ordenamiento

- **Paginación** obligatoria en toda colección potencialmente grande. Usar paginación basada en cursor para datasets grandes o de alta escritura, y basada en offset/limit para casos simples:
  - `GET /vehicles?limit=20&cursor=abc123`
  - `GET /vehicles?page=2&pageSize=20`
- La respuesta paginada debe incluir metadatos: total (si es viable calcularlo), cursor/página siguiente, y tamaño de página.
- **Filtrado** mediante query params con el nombre del campo: `GET /vehicles?status=active&type=truck`.
- **Ordenamiento** mediante el parámetro `sort`, prefijo `-` para orden descendente: `GET /vehicles?sort=-createdAt`.
- **Selección de campos** (field sparsity) opcional vía `fields`: `GET /vehicles?fields=id,plate,status`.

## 7. Versionado

- Versionar la API en la URI con el prefijo de versión mayor: `/v1/vehicles`, `/v2/vehicles`.
- Incrementar la versión mayor solo ante cambios incompatibles (breaking changes): eliminar/renombrar campos, cambiar tipos, cambiar semántica de un endpoint.
- Cambios aditivos y compatibles (nuevos campos opcionales, nuevos endpoints) no requieren nueva versión.
- Toda versión deprecada debe anunciarse con antelación (header `Deprecation` / `Sunset`) y mantenerse activa durante un período de transición documentado antes de retirarse.

## 8. Autenticación y autorización

- Toda API debe requerir autenticación, salvo endpoints explícitamente públicos y documentados como tales.
- Usar `Authorization: Bearer <token>` (OAuth2 / JWT) como mecanismo estándar; no usar API keys en query string.
- Autorización basada en el principio de menor privilegio; validar permisos a nivel de recurso, no solo de endpoint.
- No filtrar en mensajes de error si un recurso existe pero está prohibido (`403`) vs no existe (`404`) cuando eso pueda revelar información sensible; preferir `404` de forma consistente en esos casos si el modelo de amenazas lo requiere.

## 9. Idempotencia y concurrencia

- Las operaciones `PUT` y `DELETE` deben ser idempotentes: repetir la misma solicitud produce el mismo resultado final.
- Para `POST` que crea recursos con efectos no idempotentes (p. ej. pagos, órdenes), soportar una `Idempotency-Key` en el header para evitar duplicados ante reintentos.
- Usar **concurrencia optimista** con `ETag` / `If-Match` en actualizaciones (`PUT`/`PATCH`) sobre recursos que puedan modificarse concurrentemente; responder `412 Precondition Failed` ante conflicto.

## 10. HATEOAS y descubribilidad (opcional, según madurez)

- No es obligatorio implementar HATEOAS completo, pero se recomienda incluir enlaces relevantes (`self`, `next`, `prev`) en respuestas paginadas para facilitar la navegación por el cliente.

## 11. Seguridad

- HTTPS obligatorio en todos los ambientes (no exponer HTTP plano).
- Validar y sanear toda entrada del cliente (protección contra inyección, payloads maliciosos).
- Aplicar **rate limiting** y devolver `429` con header `Retry-After` cuando se exceda el límite.
- No exponer stack traces, mensajes de error internos ni detalles de infraestructura en respuestas de error hacia el cliente.
- Definir CORS de forma explícita y restrictiva (no `*` en producción salvo APIs públicas intencionalmente abiertas).

## 12. Documentación

- Toda API debe documentarse con **OpenAPI 3.x**, mantenida como fuente de verdad y versionada junto con el código.
- La documentación debe incluir: descripción de cada endpoint, esquemas de request/response, códigos de error posibles, ejemplos de uso y requisitos de autenticación.

## 13. Checklist de cumplimiento

- [ ] URIs en kebab-case, sustantivos en plural, sin verbos.
- [ ] Métodos HTTP usados según su semántica estándar.
- [ ] Códigos de estado HTTP correctos y consistentes.
- [ ] Payloads en JSON, camelCase, fechas en ISO 8601.
- [ ] Formato de error consistente (RFC 9457).
- [ ] Paginación, filtrado y ordenamiento implementados en colecciones.
- [ ] Versionado explícito en la URI.
- [ ] Autenticación y autorización aplicadas a todos los endpoints no públicos.
- [ ] Idempotencia garantizada en `PUT`/`DELETE`; `Idempotency-Key` soportado donde aplique.
- [ ] HTTPS, rate limiting y CORS configurados correctamente.
- [ ] Documentación OpenAPI publicada y actualizada.

## Referencias

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- Google API Design Guide (AIP)
- Microsoft REST API Guidelines
- Zalando RESTful API Guidelines
