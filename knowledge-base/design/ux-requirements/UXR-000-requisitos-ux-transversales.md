---
type: UX Requirement
title: "UXR-000 — Requisitos UX transversales de la plataforma"
description: "Requisitos de experiencia comunes a todas las historias de H1: acceso, navegación en el shell, idioma, accesibilidad, estados de la interfaz y privacidad."
tags: [ux-ui, ux-requirement, transversal, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: repository-guidelines
    resource: /AGENTS.md
---

# UXR-000 — Requisitos UX transversales

## Trazabilidad

- **Aplica a:** UXR-001 a UXR-006 (US-001 a US-006).
- **Fuentes:**
  - [ADR-001](../../architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md): shell y microUIs.
  - [ADR-002](../../architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md): inicio de sesión con Keycloak.
  - VIS-001:L37-L51: actores.
  - VIS-001:L104: transparencia.
  - AGENTS.md:L71: WCAG 2.2 AA.

## Requisitos

| ID | Requisito | Clasificación | Fuente |
|---|---|---|---|
| UXR-000.1 | El usuario inicia sesión una sola vez para toda la plataforma, y la sesión vale para todos los microUIs | Hecho (decisión) | ADR-001, ADR-002 |
| UXR-000.2 | El shell ofrece una navegación global que solo muestra al usuario las funciones de sus roles (colaborador, jefe de proyecto, evaluador, Jefe de Ingeniería…) | Supuesto: ADR-001 asigna la navegación al shell. La visibilidad de datos ajenos quedó definida el 2026-09-27 (P-08, BR-TRA-03 a BR-TRA-06, BR-IA-04), pero la matriz de permisos completa por función no (qué es ADMIN sigue en P-45) | ADR-001; BRC-001 |
| UXR-000.3 | Toda la interfaz cumple WCAG 2.2 AA: teclado, foco visible, nombres accesibles, contraste, y la información no depende solo del color | Hecho (estándar del repositorio; su aplicabilidad al producto está por confirmar, ADB-001 F-23) | AGENTS.md:L71 |
| UXR-000.4 | Cada vista declara sus estados: carga, vacío, error, sin permiso y éxito | Hecho (convención del curso) | AGENTS.md; skills UX-102 |
| UXR-000.5 | ~~Un colaborador ve solo sus propios datos de desempeño, salvo que su rol tenga permiso explícito sobre datos ajenos~~. **Revisado el 2026-09-27 (P-08):** cualquier colaborador ve de otra persona el resumen de sus niveles certificados, sus evidencias (las de GitLab solo si el repositorio se lo permite) y sus certificaciones con su auditoría; la brecha individual ajena solo la ve el Jefe de proyecto; las propuestas de la IA, el colaborador, quien evalúa, el Jefe de Ingeniería, Dirección, Gerencia y ADMIN; de los datos maestros, solo nombre, correo laboral, unidad, rol y perfiles profesionales. La interfaz muestra el estado "sin permiso" cuando un rol no puede ver un dato, y un estado específico cuando una evidencia de GitLab no es accesible por el control del repositorio (**inferencia**) | Hecho (decisión humana; ya no acceso mínimo). Abierto: calificaciones y sustento del evaluador (P-54) | BRC-001 BR-TRA-03 a BR-TRA-06, BR-IA-04, BR-PTY-20 |
| UXR-000.6 | La terminología de la interfaz usa los términos del glosario: certificación, nivel certificado, Rol-Nivel, requisito de evidencia, rúbrica… | Hecho (decisión) | GLS-001; BR-TER-01 |

## Estados obligatorios de la interfaz

| Estado | Qué debe comunicar |
|---|---|
| Carga | Que la información se está obteniendo, sin bloquear la navegación del shell |
| Vacío | Que no hay datos y, si aplica, qué acción puede tomar el usuario |
| Error | Qué falló, en lenguaje de negocio, y cómo reintentar |
| Sin permiso | Que la función no está disponible para su rol, sin mostrar datos |
| Sesión vencida | Que debe volver a iniciar sesión; cómo se comporta está abierto en ADR-002 |

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| UXR-Q1 | **No hay investigación con usuarios.** Los requisitos UX salen solo de fuentes de negocio. ¿Se hará investigación (entrevistas, contexto de uso) antes de diseñar? | Responsable de producto | Alta |
| UXR-Q2 | ¿En qué dispositivos se usa la plataforma (escritorio, móvil)? Define el diseño responsivo | Responsable de producto | Alta |
| UXR-Q3 | ¿La interfaz es solo en español, o hay que prever otros idiomas? | Responsable de producto | Media |
| UXR-Q4 | ¿Existe un design system corporativo (tokens, componentes) que deba usarse? | Jefe de Ingeniería | Alta |
| P-08 | ¿Qué datos de otras personas ve cada rol? | Responsable de producto | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): ver UXR-000.5 |
| P-54 | ¿Las calificaciones de evaluaciones y el sustento del evaluador son visibles para todos, o solo el resultado? ¿Se pueden mostrar enlaces a GitLab (BR-IA-01)? | Jefe de Ingeniería | Media (nueva en BRC-001) |

## Decisiones humanas registradas

- ADR-001 y ADR-002, de `human:ianache`, del 2026-09-27.
