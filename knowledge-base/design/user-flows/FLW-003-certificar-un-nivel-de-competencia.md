---
id: FLW-003
type: User Flow
title: "FLW-003 — Certificar un nivel de competencia"
description: "Flujo del evaluador para revisar las evidencias de un colaborador, calificar cada una, certificar o no aprobar un nivel, recertificar, y flujo de revocación por el Jefe de Ingeniería o ADMIN."
tags: [ux-ui, user-flow, certificacion, evidencia, evaluacion]
status: draft
generated:
  by: "user-flow-designer/1.1"
  at: "2026-10-04T12:30:00-05:00"
sources:
  - id: uxr-003
    resource: /knowledge-base/design/ux-requirements/UXR-003-certificar-un-nivel-de-competencia.md
  - id: us-003
    resource: /knowledge-base/requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md
  - id: dsp-002
    resource: /knowledge-base/requirement/scope-packs/DSP-002-certificacion-y-perfil.md
  - id: api-spec-005
    resource: /knowledge-base/architecture/api/API-SPEC-005-certificaciones-y-evidencias.md
requirements: [US-003, UXR-003]
screens: [SCR-003-01, SCR-003-02, SCR-003-03, SCR-003-04, SCR-003-05]
---

# FLW-003 — Certificar un nivel de competencia

## Trazabilidad

- **Lineage:** US-003 (AC-1 a AC-7) → UXR-003 → FLW-003 → SCR-003-01..05.
- **Reglas:** BR-ACR-01 a 05, 07 a 13, 15, 16, 18 a 25, BR-TRA-06 a 09, BR-CAT-15. Decisiones EVD-2026-0185 a 0237 (API-SPEC-005).
- **Pantallas (IDs reservados; las especifica `ui-spec-writer`):**

| SCR | Propósito en el flujo |
|---|---|
| SCR-003-01 | El evaluador busca al colaborador y elige la competencia y el nivel que evalúa |
| SCR-003-02 | Evaluar: rúbrica, requisitos (requeridos y deseados), evidencias presentadas, calificación CUMPLE o NO CUMPLE de cada pieza; decidir certificar o no aprobar; variante de recertificación |
| SCR-003-03 | No aprobar: motivo tipificado y descripción de 10 a 1000 caracteres |
| SCR-003-04 | Resultado: certificada, no aprobada o error, con sus mensajes |
| SCR-003-05 | Revocar una certificación (solo Jefe de Ingeniería o ADMIN): motivo tipificado y descripción de 10 a 1000 caracteres |

Cada SCR debe declarar `flow: FLW-003`.

## Happy path

**Actor:** evaluador (cualquier usuario con el rol `evaluador`). **Objetivo:** certificar el nivel L2 de una competencia a un colaborador. **Precondición:** el colaborador es vigente y ya registró sus evidencias.

1. Abre la evaluación (SCR-003-01), busca al colaborador y elige la competencia y el nivel. No hay asignación previa (UXR-003-Q2: el evaluador la abre).
2. En SCR-003-02 ve la rúbrica del nivel, los requisitos requeridos y deseados y las evidencias que el colaborador presentó, con su enlace.
3. Asocia cada pieza al requisito que cumple y la califica **CUMPLE** o **NO CUMPLE**. Un requisito se cumple con al menos una pieza en CUMPLE.
4. Con todos los requisitos requeridos cubiertos, se habilita «Certificar». El evaluador confirma explícitamente (equivale a su firma, BR-ACR-02).
5. SCR-003-04 confirma la certificación y advierte que cualquier colaborador podrá verla con su auditoría (BR-TRA-06).

**Variante no aprobar:** el evaluador elige «No aprobar» en SCR-003-02 (disponible siempre, también con los requisitos cubiertos, por decisión suya), indica en SCR-003-03 el motivo y la descripción, y SCR-003-04 confirma que la evaluación quedó registrada y no es una certificación.

**Variante recertificar:** si ya hay una certificación vigente de ese nivel, SCR-003-02 ofrece «Recertificar» en lugar de «Certificar», y exige al menos una evidencia nueva, que no respaldó la certificación reemplazada. Al confirmar, la nueva reemplaza a la anterior.

**Variante revocar:** el Jefe de Ingeniería o ADMIN abre una certificación vigente, elige «Revocar» (SCR-003-05), indica motivo y descripción y confirma. La certificación pasa a revocada; el nivel vigente se recalcula.

## Excepciones, permisos y estados

| Id | Situación | Comportamiento del flujo | Origen |
|---|---|---|---|
| E1 | Falta un requisito requerido sin pieza en CUMPLE | «Certificar» deshabilitada; se listan los requisitos que faltan | BR-ACR-09, 12, EVD-2026-0208 |
| E2 | El nivel no tiene requisitos definidos, o ninguno requerido | No se puede certificar; se explica que primero hay que definir cómo se evidencia | BR-ACR-13 |
| E3 | Nivel inferior al ya certificado | Se rechaza con explicación | EVD-2026-0187 |
| E4 | Ya hay una certificación vigente de ese nivel | Se ofrece recertificar | EVD-2026-0192 |
| E5 | Recertificar sin evidencias nuevas | No se permite; se pide al menos una nueva | EVD-2026-0216, 0220 |
| E6 | El colaborador no es vigente (o está anonimizado) | No se puede evaluar | EVD-2026-0217, 0218 |
| E7 | Sin evidencias presentadas | Estado vacío: «El colaborador aún no registró evidencias»; se puede no aprobar o esperar | UXR-003-Q3 |
| E8 | Enlace de GitLab que no abre fuera de la red | Advertencia junto al enlace: solo abre dentro de la organización o con VPN | EVD-2026-0207 |
| E9 | Otro evaluador certificó al mismo tiempo | Aviso de conflicto con opción de recargar | API-SPEC-005 |
| E10 | Descripción de menos de 10 o más de 1000 caracteres | Error de campo con contador | EVD-2026-0201, 0236 |
| E11 | El catálogo o party no responden | Error con reintentar; no se puede certificar | ADR-012 |
| E12 | Usuario sin el rol `evaluador` (o sin ADMIN/Jefe al revocar) | No ve las acciones | EVD-2026-0199, 0191 |

**Estados de SCR-003-02:** cargando, sin evidencias, requeridos incompletos, listo para certificar, certificación vigente (recertificar), nivel sin requisitos, error. **SCR-003-03/05:** inicial, error de validación, guardando, error al guardar.

**Permisos:** evalúa y certifica el rol `evaluador`; revoca el Jefe de Ingeniería o ADMIN. Una evaluación no aprobada la ven el colaborador evaluado, quien la registró, el Jefe y ADMIN; la descripción de una revocación, la persona certificada, los evaluadores, el Jefe y ADMIN.

**Accesibilidad (UXR-000, WCAG 2.2 AA):** etiquetas ligadas, errores con `role="alert"`, foco al primer error, teclado completo, contraste 4.5:1. CUMPLE y NO CUMPLE no dependen solo del color: llevan texto e icono. Los requisitos cubiertos y faltantes no se distinguen solo por color.

**Fuera de este flujo:** el registro de evidencias por el colaborador (sin historia, UXR-003-Q3); la solicitud del colaborador (UXR-003-Q2); la propuesta automática de H2 y la IA de H3; el perfil (FLW-004).

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| UXR-003-Q2 | ¿Quién inicia la evaluación? Se diseña que el evaluador | Jefe de Ingeniería | Alta | SCR-003-01 |
| UXR-003-Q3 | Falta una historia para que el colaborador registre sus evidencias | Jefe de Ingeniería | Alta | E7 |
| UXR-003-Q4 | ¿Cómo se busca al colaborador (nombre, correo, código)? | Jefe de Ingeniería | Media | SCR-003-01 |
| FLW-003-Q1 | ¿«No aprobar» está siempre disponible o solo cuando faltan requisitos? Se propone siempre, por decisión del evaluador | Jefe de Ingeniería | Media | SCR-003-02 |
| FLW-003-Q2 | ¿El evaluador ve las certificaciones anteriores del colaborador en esa competencia (incluidas sus propias evaluaciones no aprobadas)? Sí las vigentes, reemplazadas y revocadas; las no aprobadas de otros evaluadores no (EVD-2026-0229, 0232) | — | — | Resuelto por decisiones |
