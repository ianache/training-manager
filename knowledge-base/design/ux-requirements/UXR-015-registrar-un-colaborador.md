---
type: UX Requirement
title: "UXR-015 — Registrar un colaborador"
description: "Lo que el Jefe de Ingeniería necesita ver y hacer para registrar empleados y contratistas con sus datos maestros, rol, unidad, relaciones laborales y nivel inicial."
tags: [ux-ui, ux-requirement, party, h1, administracion]
status: draft
generated:
  by: "ux-requirements-analyzer/2.0"
  at: "2026-09-30T00:00:00-05:00"
sources:
  - id: us-015
    resource: /knowledge-base/requirement/user-stories/US-015-registrar-un-colaborador.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-002
    resource: /knowledge-base/business/information-model/IMD-002-modelo-de-informacion-conceptual-de-partes.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# UXR-015 — Registrar un colaborador

## Trazabilidad

- **Historia:** [US-015](../../requirement/user-stories/US-015-registrar-un-colaborador.md), criterios AC-1 a AC-7.
- **Especificación:** [SPEC-001](../../requirement/specs/SPEC-001-gestion-de-colaboradores.md) — Gestión de colaboradores.
- **Reglas:** BR-PTY-01, BR-PTY-05 a BR-PTY-08, BR-PTY-10, BR-PTY-11, BR-PTY-17, BR-PTY-19; BR-PRF-02.
- **Conceptos (IMD-002):** Parte, Persona, Rol de la parte (Empleado, Contratista), Unidad, Jefe directo, Proveedor, Código de colaborador, Identificación, Correo laboral, Rol-Nivel, Nivel.
- **Actor:** [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md).
- **Dependencias:** US-017 (Gestionar estructura organizacional), US-018 (Gestionar proveedores), US-001 (Catálogo de Rol-Nivel).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Dar de alta a un colaborador (empleado o contratista) una sola vez en la plataforma, con su identidad única (DNI, cédula o pasaporte), vinculación laboral y rol inicial, de forma que sea identificable y tenga un perfil de competencias y pueda tener certificaciones.

## Necesidades de información

| ID | El usuario necesita ver / ingresar… | Fuente | Obligatorio |
|---|---|---|---|
| UXR-015.1 | **Tipo de rol:** Empleado o Contratista (para elegir el camino del formulario) | BR-PTY-05, AC-1, AC-2 | Sí |
| UXR-015.2 | **Datos de la persona:** nombres, apellidos, nombre preferido (opcional) | SPEC-001:L102-L109, BR-PTY-08 | Sí (nombres, apellidos) |
| UXR-015.3 | **Identificación:** tipo (DNI, carné de extranjería, pasaporte), número, país emisor | BR-PTY-07, AC-5, SPEC-001:L105 | Sí |
| UXR-015.4 | **Correo laboral:** correo según el tipo (empleado: correo de COMSATEL; contratista: correo del proveedor) | BR-PTY-08, AC-6, D13 | Sí |
| UXR-015.5 | **Unidad** (si es empleado) o **Proveedor** (si es contratista) | AC-1, AC-2, BR-PTY-05; SPEC-001:L113-L114 | Sí (según tipo) |
| UXR-015.6 | **Jefe directo** (solo si es empleado): otra persona registrada como colaborador | AC-1, BR-PTY-19, H-1 | Sí (empleado) |
| UXR-015.7 | **Rol-Nivel:** elegir un rol del catálogo y un nivel inicial (cualquier nivel válido del rol) | AC-7, BR-CAT-09, BR-PRF-02, EVD-2026-0103 | Sí |
| UXR-015.8 | **Fecha desde:** fecha de vigencia del rol y del nivel inicial | AC-1, AC-7, SPEC-001:L112 | Sí (predeterminada: hoy) |
| UXR-015.9 | **Código de colaborador** (generado, no se ingresa): se muestra al terminar el alta para confirmación | BR-PTY-06, D25, H-2 | N/A (generado) |
| UXR-015.10 | **Identidad de acceso (Keycloak)** (opcional): puede quedar vacía al registrar | AC-3, BR-PTY-16, SPEC-001:L112 | No |

## Acciones

| ID | El usuario puede… | Fuente |
|---|---|---|
| UXR-015.11 | Elegir tipo de colaborador (Empleado o Contratista) al empezar | AC-1, AC-2 |
| UXR-015.12 | Ingresar datos de la persona (nombres, apellidos, nombre preferido) | SPEC-001:L102-L109 |
| UXR-015.13 | Elegir tipo de identificación e ingresar número y país | BR-PTY-07 |
| UXR-015.14 | Ingresar correo laboral (validando según el tipo de rol) | BR-PTY-08, D13 |
| UXR-015.15 | Buscar y elegir la unidad (empleado) | SPEC-001:L113 |
| UXR-015.16 | Buscar y elegir el jefe directo (empleado; si es obligatorio) | AC-1, BR-PTY-04 |
| UXR-015.17 | Buscar y elegir el proveedor (contratista) | AC-2, BR-PTY-10 |
| UXR-015.18 | Elegir un rol del catálogo vigente | BR-CAT-09 |
| UXR-015.19 | Elegir un nivel inicial válido del rol (según BR-PRF-02 y AC-7; si es obligatorio) | BR-PRF-02, AC-7 |
| UXR-015.20 | Editar la fecha desde (predeterminada a hoy) | SPEC-001:L112 |
| UXR-015.21 | Confirmar / guardar el alta | AC-1 a AC-3 |
| UXR-015.22 | Cancelar el registro sin guardar | Convención UX |

## Reglas que la interfaz debe hacer visibles

- **Tipo de rol define el camino:** si elige Empleado, solo se pide unidad y jefe directo; si elige Contratista, solo se pide proveedor (y no jefe directo) (BR-PTY-05, BR-PTY-19, AC-1, AC-2).
- **Identificación única:** el número, tipo y país deben ser únicos entre colaboradores vigentes y personas anonimizadas (pero no bloquea reutilizar el mismo número con otro país) (BR-PTY-07, AC-5, caso límite).
- **Correo único entre vigentes:** solo se valida unicidad entre colaboradores con rol vigente; una persona anonimizada puede tener reutilizado su correo (BR-PTY-08, AC-6, caso límite).
- **Correo según tipo:** empleado = dominio de COMSATEL; contratista = dominio del proveedor (D13). **Nota:** la comprobación de dominio sigue abierta (US-015-Q1).
- **Código generado automáticamente:** el formulario no pide código de colaborador; la plataforma lo genera como GUID al guardar (BR-PTY-06, D25, AC-4).
- **Nivel inicial del rol:** cuando se asigna, el Jefe de Ingeniería elige cuál es el nivel inicial válido (AC-7); **abierto:** si es obligatorio (US-015-Q3) y cuál es el nivel por defecto.
- **Solo acceso Jefe de Ingeniería:** solo ese rol puede registrar colaboradores; otros no ven esta función (BR-PTY-17).
- **Privacidad:** se capturan solo los campos de SPEC-001:L102-L109 (minimización, ASR-BR-TRA-01).
- **Auditoría:** el sistema registra quién realizó el alta y cuándo (BR-PTY-12).

## Estados

- **Vacío:** inicio del formulario (no hay datos).
- **Carga:** buscando unidades, proveedores, roles disponibles.
- **Parcial:** el usuario completó algunos campos pero no los obligatorios.
- **Validación:** error de identificación duplicada (AC-5), correo duplicado entre vigentes (AC-6), tipo de identificación inválida (casos límite), falta de datos obligatorios.
- **Sin permisos:** el usuario no es Jefe de Ingeniería.
- **Sin opciones:** no hay unidades registradas (bloquea empleado), no hay proveedores registrados (bloquea contratista), no hay roles en el catálogo.
- **Éxito:** el colaborador se registró, se muestra el código generado (H-2) y la opción de registrar otro o volver.
- **Error:** la base de datos rechazó el alta (ej: violación de constraint después de validación).

## Supuestos

- **Unidades, Proveedores y Roles existen:** esta función depende de US-017 (unidades), US-018 (proveedores) y US-001 (catálogo). Si no hay datos en ninguna de estas, se muestra "Sin opciones" y se invita a crearlos primero.
- **El jefe directo es otra persona registrada:** el Jefe de Ingeniería elige de una lista de colaboradores vigentes (H-1, BR-PTY-04).
- **Rol-Nivel vigente:** solo se ofrecen roles del catálogo que estén en estado vigente (APPROVED). **Abierto:** qué estado tiene un rol al crearse (DRAFT, APPROVED) (P-50.2).
- **Edición posterior:** después del alta, cambiar de unidad, jefe directo, proveedor o nivel se hace en US-016 (empleado) o historias futuras (contratista). Esta historia solo registra el estado inicial.
- **Sin vínculo de Keycloak:** el campo de identidad de acceso puede quedar vacío y completarse después en US-022 (AC-3, BR-PTY-16).
- **Minimización de datos:** se capturan solo los datos obligatorios de SPEC-001:L102-L109; otros campos (escala salarial, responsabilidades, criterios de nivel) están fuera de alcance (BR-CAT-18).

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| ~~US-015-Q1~~ | ~~¿Cómo se valida que el correo de un contratista es del proveedor...?~~ **Respondida (ianache, 2026-10-01):** No validar, diferir a MVP futuro (E6 valida duplicados) | Jefe de Ingeniería | — | — | ✅ Respondida |
| ~~US-015-Q2~~ | ~~¿La unidad es obligatoria al registrar un empleado? ¿El jefe directo es obligatorio?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-30): sí, ambas son obligatorias | Jefe de Ingeniería | — | — | Respondida |
| ~~US-015-Q3~~ | ~~¿El nivel inicial de rol es obligatorio para completar el alta? ¿Puede ser cualquier nivel del rol o solo el primero?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-30): es obligatorio y puede ser cualquier nivel válido del rol | Jefe de Ingeniería | — | — | Respondida |
| UXR-015-Q1 | **Investigación con usuarios:** ¿se hará antes de diseñar la interfaz? ¿Hay contexto de uso conocido (dónde, cuándo, cuánto tiempo)? | Responsable de producto | Alta | No | Abierta |
| ~~UXR-015-Q2~~ | ~~**Búsqueda de jefe directo, unidad y proveedor:**~~ **Respondida (ianache, 2026-10-01):** Combobox con búsqueda real-time (implementado en GEN-015 y Stitch) | Responsable UX | — | — | ✅ Respondida |
| UXR-015-Q3 | **Flujo de niveles iniciales:** si el catálogo define varios niveles para un rol (ej: Developer Junior a Senior), ¿se muestra la escala completa o solo el primero como predeterminado? ¿Puede el Jefe de Ingeniería asignar cualquier nivel? | Jefe de Ingeniería | Media | Sí (AC-7) | Abierta |
| ~~UXR-015-Q4~~ | ~~**Feedback al usuario:**~~ **Respondida (ianache, 2026-10-01):** Validación tiempo real (duplicados de ID y correo se bloquean con feedback visual en vivo) | Responsable UX | — | — | ✅ Respondida |
| ~~UXR-015-Q5~~ | ~~**Después del alta:**~~ **Respondida (ianache, 2026-10-01):** Se muestra confirmación con código + 3 opciones ([Registrar otro], [Volver lista], [Ir dashboard]) | Responsable UX | — | — | ✅ Respondida |
| P-50.2 | ¿En qué estado se crea un rol en el catálogo (DRAFT, APPROVED)? ¿Quién aprueba? | Jefe de Ingeniería | Media | No (abierto desde UXR-001) | Abierta |

## Decisiones humanas registradas

- US-015, preguntas respondidas por `human:ianache` (Jefe de Ingeniería), 2026-09-27:
  - Q-01 (código generado): automáticamente, GUID (D25, EVD-2026-0119).
  - Q-02 (jefe directo del contratista): no lo tiene (D26, BR-PTY-19, EVD-2026-0120).
  - P-28 (nivel inicial del rol): se asigna al registrarlo, después se evalúa su evolución (BR-PRF-02, EVD-2026-0103).
