---
type: User Story
title: "US-022 — Vincular la identidad de acceso"
description: "El Jefe de Ingeniería registra el identificador del usuario de Keycloak de una persona (0 o 1), sin aprovisionar usuarios."
tags: [user-story, colaboradores, party, c8, keycloak]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T12:15:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-022 — Vincular la identidad de acceso

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-022 |
| Épica / capacidad | SPEC-001 C8 — Vincular la identidad de acceso (SPEC-001:L146) |
| Horizonte / release | Por definir (prerrequisito de todo acceso personal) |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: sin vínculo, la plataforma no sabe qué persona es el usuario que inicia sesión (inferencia a partir de ADR-002 y SPEC-001:L153) |
| Estimación | |
| Dependencias | US-015 |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** vincular a una persona con su usuario de Keycloak, **para** que, al iniciar sesión, la plataforma la reconozca como esa persona.

## 3. Contexto y valor

- **Problema que resuelve:** los usuarios se gestionan en Keycloak aparte (D4; ADR-002); falta el enlace entre usuario y persona.
- **Valor esperado:** cada persona con acceso queda asociada a su ficha.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Registrar, cambiar o quitar el identificador de Keycloak de una persona (0 o 1).
- **Excluye:**
  - Crear o administrar usuarios en Keycloak (SPEC-001:L46; BR-PTY-16).
  - Roles y permisos en Keycloak (ADR-002, no decidido).

## 5. Criterios de aceptación

### AC-1 — Vincular

```gherkin
Escenario: Registrar el identificador de Keycloak
  Dado que soy el Jefe de Ingeniería y una persona no tiene identidad de acceso
  Cuando registro el identificador de su usuario de Keycloak
  Entonces la persona queda vinculada a ese identificador
```

- **Regla / fuente:** BR-PTY-16; D4

### AC-2 — Una sola identidad por persona

```gherkin
Escenario: Reemplazar el identificador
  Dado una persona ya vinculada a un identificador de Keycloak
  Cuando registro otro identificador
  Entonces la persona queda con un solo identificador, el nuevo, y el cambio queda auditado
```

- **Regla / fuente:** BR-PTY-16 (0 o 1); BR-PTY-12

### AC-3 — Sin aprovisionamiento

```gherkin
Escenario: No crear usuarios
  Dado una persona sin usuario de Keycloak
  Cuando la vinculo
  Entonces la plataforma solo guarda el identificador indicado y no crea ni modifica usuarios en Keycloak
```

- **Regla / fuente:** BR-PTY-16; SPEC-001:L46

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| El mismo identificador ya vinculado a otra persona | Sin regla | US-022-Q1 |
| Identificador que no existe en Keycloak | Sin regla (no se dice si se comprueba) | US-022-Q2 |
| Persona anonimizada | La identidad de acceso se anonimiza y la persona no se edita | BR-PTY-14; SPEC-001:L115 |
| Quitar el vínculo | 0 identidades es válido | BR-PTY-16 |
| Usuario que no es Jefe de Ingeniería | No puede | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-16 | Solo el identificador de Keycloak (0 o 1); sin aprovisionar | BRC-001 |
| BR-PTY-12 | Auditoría | BRC-001 |
| BR-PTY-14 | La identidad de acceso es PII que se anonimiza | BRC-001 |
| BR-PTY-17 | Permiso | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Identidad de acceso | Identificador de Keycloak | Término nuevo de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** el identificador es PII (se anonimiza, SPEC-001:L115).
- **Otros:** autenticación en el BFF con Keycloak y PKCE ([ADR-002](../../architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md)); auditoría (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** ficha de la persona → identidad de acceso → registrar o quitar → confirmar.
- **Estados de la interfaz:** sin vínculo; vinculado; error (identificador ya usado, si se decide así); sin permisos.
- **Contenido clave:** si la persona tiene acceso vinculado.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-015; usuarios existentes en Keycloak (fuera de la plataforma).
- **Es prerrequisito de:** US-023 para el colaborador y US-016 AC-3 y AC-4 (hipótesis H-04 de RCP-002).
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: un identificador de Keycloak no puede vincularse a dos personas (US-022-Q1).

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| US-022-Q1 | ¿El identificador de Keycloak es único entre personas? | Jefe de Ingeniería + ARQ | Media | No | Abierta |
| US-022-Q2 | ¿Se comprueba en Keycloak que el identificador existe? | ARQ | Baja | No | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0077 | Solo se guarda el identificador de Keycloak | SPEC-001:L58 (D4) | decision | high |
| EVD-2026-0084 | El Jefe de Ingeniería mantiene la información | SPEC-001:L65 (D11) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, ADR-002, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | Solo requiere US-015 |
| Negociable | Sí | Unicidad y comprobación abiertas |
| Valiosa | Sí | Habilita el acceso personal |
| Estimable | Sí | Alcance acotado |
| Pequeña (Small) | Sí | Un dato |
| Testeable | Sí | Criterios verificables |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [x] No hay preguntas abiertas que bloqueen
- [x] Las dependencias están identificadas
- [x] Los términos de negocio están en el glosario, o tienen una pregunta para el glosario
- [ ] El PO validó la historia

## 16. Definition of Done (funcional)

- [ ] Todos los criterios de aceptación pasan sus pruebas de aceptación
- [ ] Los casos negativos y límite están cubiertos por pruebas
- [ ] La accesibilidad WCAG 2.2 AA está revisada
- [ ] Los requisitos de privacidad se cumplen
- [ ] El PO aceptó la historia en la revisión

## 17. Preparación y validación

- **Estado:** READY
- **Motivo:** los criterios están sostenidos por BR-PTY-16 y D4; las preguntas abiertas no bloquean.
- **Bloqueos de entrega:** US-015.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia; el arquitecto responde US-022-Q1 y Q2.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
