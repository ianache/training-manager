---
type: ADR
id: ADR-013
title: Las certificaciones se implementan como un microservicio propio (certification-service)
description: Las certificaciones de nivel y su consulta se implementan en un servicio nuevo, certification-service; el BFF es su consumidor y otros servicios lo referencian por identificadores lógicos.
tags: [architecture, adr, certificacion, microservicio, postgresql]
status: draft
adr_status: Aceptado
decision: { by: human:ianache, at: 2026-10-04T00:00:00-05:00 }
related: [ADR-001, ADR-007, ADR-008, ADR-011, ADR-012, DSP-002, API-SPEC-004, US-003, US-004, US-019, BR-ACR-02, BR-ACR-04]
generated: { by: "architecture-adr-writer/claude-sonnet-5-5", at: "2026-10-04T05:00:00-05:00" }
sources:
  - id: dsp-002
    resource: /knowledge-base/requirement/scope-packs/DSP-002-certificacion-y-perfil.md
    title: DSP-002 — Certificación manual de niveles y perfil de competencias
  - id: acp-002
    resource: /knowledge-base/architecture/ACP-002-context-pack-general.md
    title: ACP-002 — Context pack general (prevé un «Certification Service»)
  - id: adr-011
    resource: /knowledge-base/architecture/adrs/ADR-011-catalog-service-como-microservicio-propio.md
    title: ADR-011 — catalog-service como microservicio propio
  - id: adr-012
    resource: /knowledge-base/architecture/adrs/ADR-012-reintentos-con-espera-creciente-y-cortacircuito.md
    title: ADR-012 — Reintentos con espera creciente y cortacircuito
  - id: api-spec-004
    resource: /knowledge-base/architecture/api/API-SPEC-004-asignacion-de-rol-nivel.md
    title: API-SPEC-004 — Asignación de Rol-Nivel
---

# ADR-013 — certification-service como microservicio propio

- **Estado:** Aceptado
- **Fecha:** 2026-10-04
- **Decisor:** ianache (`human:ianache`)
- **Redacción:** architecture-adr-writer/claude-sonnet-5-5, a partir de la decisión. Falta que un humano revise el texto: no hay `verified`
- **ASR relacionados:** ninguno aprobado
- **Depende de / Reemplaza a:** [ADR-011](/knowledge-base/architecture/adrs/ADR-011-catalog-service-como-microservicio-propio.md) (mismo patrón) y [ADR-008](/knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md). No reemplaza a ninguno.

## Contexto

- ACP-002 ya prevé un «Certification Service» (registro de certificaciones y auditoría, PostgreSQL, puerto 3003); DCP-002 lo deja fuera. No existe: no tiene modelo de datos, API ni ADR.
- Subir de nivel (US-019 AC-3 y AC-5) se bloquea hasta que exista una consulta del nivel certificado vigente por persona y competencia (EVD-2026-0177, DSP-002).
- Reglas ya decididas el 2026-10-04: las certificaciones se revocan o se recertifican; el nivel vigente de una competencia es el más alto de las certificaciones vigentes; no se certifica un nivel inferior.

## Opciones consideradas

Las opciones y sus pros y contras son una reconstrucción del agente. El decisor no registró el análisis de alternativas.

1. **Dentro del party-service.** Una sola base. Mezcla personas con certificación, que cambia por otras razones y con otros actores (evaluadores).
2. **Dentro del catalog-service.** El catálogo define los requisitos de evidencia, pero las certificaciones son datos de personas, con auditoría y otro ritmo.
3. **certification-service propio (elegida).** Separa el dominio y sigue el patrón de ADR-011. Cuesta un servicio más y referencias lógicas entre servicios.

## Decisión

**El Certification Service es un microservicio nuevo y propio.** (`human:ianache`, 2026-10-04)

**Justificación:** [PENDIENTE]. El decisor no la registró.

**Propuesta del agente para el resto del diseño** (no confirmada línea por línea):

| Aspecto | Propuesta |
|---|---|
| Pila | Python 3.11+ y FastAPI (ADR-008); migraciones con Alembic |
| Datos | Esquema propio en el PostgreSQL común (ADR-007) |
| Acceso | Solo el BFF lo llama, con el token de servicio; el portal no lo ve |
| Referencias | Ids lógicos: persona (party), competencia y su **versión** (catálogo), evaluador; sin clave foránea entre servicios |
| Consulta para US-019 | El nivel certificado vigente por persona y competencia (el más alto de los vigentes, EVD-2026-0186); la consume el BFF en `eligibility` de API-SPEC-004 |
| Autorización | El servicio vuelve a validar el rol: solo `evaluador` certifica (BR-ACR-02); lectura abierta a cualquier colaborador (BR-TRA-06) |

**No se decidió todavía**, y el desarrollo no debe asumirlo:
- Si comparte instancia de PostgreSQL con party y el catálogo o tiene la suya.
- Si ADR-012 (reintentos y cortacircuito) se extiende al certification-service; hoy cubre solo el catálogo.
- ~~Quién revoca, y el efecto sobre un nivel de rol ya asignado~~ **Resuelto el 2026-10-04:** revocan el Jefe de Ingeniería o ADMIN (EVD-2026-0191) y la persona conserva el Rol-Nivel (EVD-2026-0193). El motivo es tipificado, con una descripción de quien revoca y registro de auditoría (EVD-2026-0194); motivos `ERROR_DE_REGISTRO`, `EVIDENCIA_INVALIDA`, `REQUISITOS_NO_CUMPLIDOS`, `CONFLICTO_DE_INTERES` y `OTRO`, ampliables, con descripción de hasta 1000 caracteres (EVD-2026-0195 a 0197).
- ~~Si una certificación vence~~ **Resuelto el 2026-10-04:** no vence (EVD-2026-0190).
- ~~La semántica de «recertificar»~~ **Resuelto el 2026-10-04:** crea una certificación nueva del mismo nivel que reemplaza la anterior (EVD-2026-0192).
- El modelo de datos y la API.

## Metas de calidad

[PENDIENTE]: sin ASR aprobado con métrica.

## Consecuencias

**Positivas:**
- US-019 AC-3 y AC-5 tienen un proveedor claro del dato que necesitan.
- El dominio de certificación queda separado de personas y catálogo.

**Negativas y riesgos:**
- Un servicio más que desplegar, monitorear y proteger.
- Sin clave foránea física, una certificación puede referirse a una competencia o persona que cambia: hay que fijar la versión de la competencia al certificar.
- Consistencia eventual con party (persona vigente) y con el catálogo (versiones).

**Impacto en pruebas:**
- Pruebas de contrato BFF ↔ servicio e integración con PostgreSQL real.
- Pruebas de permiso (solo `evaluador`), de auditoría (quién, cuándo, con qué evidencia) y del nivel vigente con varias certificaciones, revocadas y recertificadas.
