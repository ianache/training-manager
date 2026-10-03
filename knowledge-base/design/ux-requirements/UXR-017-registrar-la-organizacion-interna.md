---
type: UX Requirement
title: "UXR-017 — Registrar la organización interna"
description: "Requisitos UX para que el Jefe de Ingeniería registre COMSATEL como organización interna con su razón social y RUC."
tags: [ux-requirement, party, estructura-organizacional, organizacion-interna]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-10-03T14:00:00-05:00"
sources:
  - id: us-017
    resource: /knowledge-base/requirement/user-stories/US-017-gestionar-estructura-organizacional.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# UXR-017 — Registrar la organización interna

Familia de la gestión de la estructura organizacional: UXR-017 (organización interna), [UXR-028](UXR-028-listar-y-buscar-unidades-organizacionales.md) (listado), [UXR-029](UXR-029-registrar-y-editar-unidades-organizacionales.md) (alta y edición) y [UXR-030](UXR-030-desactivar-y-reactivar-unidades-organizacionales.md) (desactivar y reactivar). Hereda los requisitos transversales de [UXR-000](UXR-000-requisitos-ux-transversales.md).

## 1. Actor y permisos

| Actor | Ve | Edita | Fuente |
|---|---|---|---|
| [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) | La organización interna y su RUC | Registra la organización interna | BR-PTY-17 |
| Otros usuarios | Nada de esta pantalla | Nada | BR-PTY-17 (EVD-2026-0142) |

## 2. Flujo esperado

1. El Jefe abre la gestión de la estructura organizacional.
2. Si no hay organización interna, ve el estado vacío inicial con la acción de registrarla; si existe, la ve.
3. Ingresa razón social y RUC (con país emisor) y confirma.
4. El sistema confirma el éxito y deja disponible la organización como interna.

## 3. Estados de la interfaz

| Estado | Comportamiento UX | Origen |
|---|---|---|
| Vacío inicial | Explica que falta COMSATEL y ofrece registrarla | US-017 §10 |
| Éxito | Confirmación visible y la organización queda mostrada | AC-1 |
| RUC duplicado | Error en el campo RUC: la identificación ya existe; se conservan los datos ingresados | AC-2, BR-PTY-07 |
| Identificación de persona (DNI) | Se rechaza; el campo solo admite RUC | BR-PTY-07 |
| Sin permisos | No se muestra la acción; si se accede, mensaje de acceso no autorizado | BR-PTY-17 |
| Error al guardar | Mensaje con opción de reintentar sin perder lo ingresado | UXR-000 |

## 4. Contenido clave y etiquetas

Razón social, RUC, país emisor y vigencia desde. Términos únicos del glosario: "Organización interna" (TRM-0078), "Organización" (TRM-0072), "COMSATEL" (TRM-0015). No usar "empresa" ni "compañía" como sinónimos.

## 5. Criterios UX verificables

- [ ] El estado vacío distingue "aún no registrada" de un error de carga.
- [ ] El error de RUC duplicado se asocia al campo y se anuncia a lectores de pantalla.
- [ ] Los datos ingresados no se pierden tras un error de validación o de guardado.
- [ ] La acción de registrar no se muestra a quien no es Jefe de Ingeniería.

## 6. Accesibilidad

WCAG 2.2 AA (UXR-000): etiquetas ligadas a los campos, errores con `role="alert"`, foco visible, navegación por teclado y contraste 4.5:1 en texto.

## 7. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| UXR-017-Q1 | ¿Qué formato y longitud tiene el RUC aceptado (11 dígitos) y se valida su dígito verificador? La historia solo exige unicidad por número y país. | Jefe de Ingeniería | Media | No |
| UXR-017-Q2 | ¿Se puede editar la razón social o el RUC de COMSATEL una vez registrada? US-017 no incluye edición de la organización. | Jefe de Ingeniería | Baja | No |
| UXR-017-Q3 | ¿Puede haber más de una organización interna? La historia habla de "la" organización interna. | Jefe de Ingeniería | Media | No |

## 8. Trazabilidad

- **Upstream:** US-017 → SPEC-001 C3 → BR-PTY-02, 03, 07, 12, 17.
- **Downstream (pendiente):** FLW → SCR → CMP → AC (`user-flow-designer`).
- **Verificación humana:** pendiente.
