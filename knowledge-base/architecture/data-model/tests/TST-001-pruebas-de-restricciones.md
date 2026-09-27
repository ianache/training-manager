---
type: Test Specification
title: "TST-001 — Pruebas de restricciones del modelo de partes en MySQL y PostgreSQL"
description: "Pruebas SQL de las restricciones clave de PDM-001 (nivel vigente por rol, identificación, código, correo laboral, anonimización y aviso), cómo ejecutarlas y su resultado."
tags: [data-model, tests, sql, mysql, postgresql, party, anonimizacion, qa]
status: draft
generated:
  by: "data-model-designer/1.0"
  at: "2026-09-27T16:40:00-05:00"
sources:
  - id: pdm-001
    resource: /knowledge-base/architecture/data-model/PDM-001-modelo-fisico-de-partes.md
  - id: ldm-001
    resource: /knowledge-base/architecture/data-model/LDM-001-modelo-logico-de-partes.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
---

# TST-001 — Pruebas de restricciones del modelo de partes

## Resultado

| Motor | Imagen | DDL | Pruebas | Estado |
|---|---|---|---|---|
| MySQL | `mysql:8.0` | [party-mysql.sql](../ddl/party-mysql.sql) | T01–T06 | **PENDIENTE (Docker Desktop detenido)** |
| PostgreSQL | `postgres:latest` (versión estable más reciente, D30; la versión exacta se registra al ejecutar) | [party-postgresql.sql](../ddl/party-postgresql.sql) | T01–T06 | **PENDIENTE (Docker Desktop detenido)** |

**No se ejecutó ninguna prueba en un motor.** Q-06 está respondida (D28: hay Docker), pero la ejecución sigue pendiente mientras Docker Desktop no esté en marcha. El 2026-09-27 a las 09:35 (-05:00), `docker info` falló: el daemon de Docker Desktop no estaba en marcha (`open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`). `run-tests.sh` terminó con código 2 (`PENDIENTE`) en los dos motores. No hay MySQL ni PostgreSQL instalados en el equipo. El 2026-09-27, tras D25–D30, no se volvió a intentar la ejecución: se informó que Docker Desktop sigue sin estar en marcha. No se registra ningún resultado PASS/FAIL hasta que se ejecuten.

**Única comprobación hecha (estática, no sustituye la ejecución):** con `sqlglot` 25.34.1, las pruebas se analizan sin errores en los dialectos que les corresponden (repetido el 2026-09-27 tras el cambio del código a GUID, D25). En el DDL, el analizador no reconoce la sintaxis MySQL `GENERATED ALWAYS AS (…) STORED` (limitación de la herramienta) y trata dos sentencias de PostgreSQL como comando genérico. `bash -n run-tests.sh` no encuentra errores de sintaxis. No prueba nada sobre las restricciones.

## Cómo ejecutarlas

Requisito: Docker con acceso a `mysql:8.0` y `postgres:latest`. Desde esta carpeta:

```bash
bash run-tests.sh mysql            # DDL de MySQL + pruebas
bash run-tests.sh postgresql       # DDL de PostgreSQL + pruebas
bash run-tests.sh mysql portable   # DDL portable en MySQL
bash run-tests.sh postgresql portable
```

[run-tests.sh](run-tests.sh) arranca un contenedor desechable (`--rm`), espera al servidor como máximo unos 90 s (MySQL) o 60 s (PostgreSQL), aplica el DDL deteniéndose ante el primer error, ejecuta los scripts en orden y detiene el contenedor al salir. Los errores esperados no detienen la ejecución (`mysql --force`, `psql -v ON_ERROR_STOP=0`, en autocommit).

**Cómo leer el resultado:** cada script intenta operaciones válidas e inválidas. El veredicto no depende de los mensajes de error, sino de los `SELECT` finales, que comprueban el estado y devuelven `PASS` o `FAIL`. Pasa si **todas** las líneas son `PASS`, el DDL termina en `DDL OK` y los errores que aparecen son solo los esperados (tabla siguiente).

## Casos

| Archivo | Caso | Espera | Regla |
|---|---|---|---|
| [00-fixtures.sql](00-fixtures.sql) | Datos ficticios comunes | `FIXTURES PASS` | — |
| [t01-un-nivel-vigente-por-rol.sql](t01-un-nivel-vigente-por-rol.sql) | T01.2 segundo nivel vigente del mismo rol | error de unicidad | BR-PTY-11, D6 |
| | T01.3 otro rol vigente de la misma persona | OK | D6 |
| | T01.4 cerrar la vigencia y abrir nivel nuevo | OK | BR-PTY-11, BR-PTY-12 |
| | T01.5 hasta anterior a desde | error de CHECK | BR-PTY-12 |
| [t02-identificacion-unica.sql](t02-identificacion-unica.sql) | T02.2 mismo tipo, número y país | error de unicidad | BR-PTY-07 |
| | T02.3–4 otro país u otro tipo | OK | BR-PTY-07 |
| | T02.5–6 DNI para organización, RUC como documento de persona | error de FK | BR-PTY-07, D10 |
| | T02.7 número vacío sin anonimizar | error de CHECK | BR-PTY-14 |
| [t03-codigo-colaborador-unico.sql](t03-codigo-colaborador-unico.sql) | T03.1 código (GUID) repetido | error de unicidad | BR-PTY-06, D25 |
| | T03.2 sin código | error NOT NULL | BR-PTY-06 |
| | T03.3 persona registrada también como organización | error de FK | BR-PTY-02 |
| [t04-correo-laboral-unico-vigente.sql](t04-correo-laboral-unico-vigente.sql) | T04.2 misma dirección con otras mayúsculas | error de unicidad | BR-PTY-08 |
| | T04.3 correo laboral vigente de otra persona | error de unicidad | BR-PTY-08 |
| | T04.4 reasignarlo tras cerrar la vigencia | OK | BR-PTY-08, BR-PTY-12 |
| | T04.5–6 propósito incompatible; perfil sin plataforma | error de FK; error de CHECK | BR-PTY-09 |
| [t05-anonimizacion.sql](t05-anonimizacion.sql) | T05.2 marcar anonimizada sin quitar la PII | error de CHECK | BR-PTY-14 |
| | T05.4 no queda PII en ninguna tabla ni vigencia | PASS | BR-PTY-14, D14 |
| | T05.5 se conservan código, auditoría, roles, fechas y asignaciones | PASS | D16 |
| | T05.6 otra persona, con código nuevo, reutiliza documento y correo del anonimizado | OK | BR-PTY-14 |
| | T05.7 otra persona intenta reutilizar el código del anonimizado | error de unicidad | BR-PTY-06, D16, D25 (DM-Q-02 resuelta) |
| [t06-aviso-plazo.mysql.sql](t06-aviso-plazo.mysql.sql) / [t06-aviso-plazo.postgresql.sql](t06-aviso-plazo.postgresql.sql) | T06.1 consulta de vencidos (plazo 90 días, referencia 2026-09-27 12:00 UTC): solo la baja del 2026-06-01 | PASS | BR-PTY-15, D15, D17 |
| | T06.2 segundo Jefe de Ingeniería vigente | OK (la base lo permite) | BR-PTY-18, D21 |
| | T06.3 aviso con destinatarios = correos vigentes de los Jefes vigentes | 1 destinatario, vencimiento 2026-08-30 09:00 | D18, D20 |
| | T06.4 segundo aviso para la misma baja | error de unicidad | DM-09 |
| | T06.5 estado de envío inválido | error de CHECK | A-09 |
| | T06.6 reintento y envío | OK | SPEC-001 §4 |

T06 tiene una variante por motor porque la aritmética de fechas no es portable (`INTERVAL n DAY` en MySQL, `n * INTERVAL '1 day'` en PostgreSQL).

## Fuera de estas pruebas

- El DDL portable en cada motor: el script lo admite (`portable`), pero es opcional.
- La anonimización de un medio de contacto compartido con otra parte (PDM-001 §5, A-06).
- Las reglas que aplica la aplicación (PDM-001 §4), el envío real del correo y la irreversibilidad. Entre ellas, la generación del GUID del código (D25) y que un contratista no tenga relación de reporte (BR-PTY-19, D26): la base no puede comprobar el tipo de rol del origen de una relación sin cambiar su estructura, así que no hay caso SQL; la prueba corresponde a la aplicación.

## Para ejecutarlas (Q-06 respondida por D28)

Arrancar Docker Desktop, ejecutar los cuatro comandos, pegar aquí la salida literal con fecha y versión de cada imagen (`run-tests.sh` imprime la de PostgreSQL; en MySQL, `SELECT VERSION();`) y cambiar el estado de la tabla de resultados. Con `postgres:latest` la versión cambia con el tiempo: registrar la usada es obligatorio para que el resultado sea reproducible. Si algún caso falla, se corrige el DDL portable, se propaga el cambio a los scripts por motor y se repite.
