---
type: User Story
title: "US-019 — Asignar un Rol-Nivel a una persona"
description: "El Jefe de Ingeniería asigna a una persona uno o varios Rol-Nivel del catálogo, con un solo nivel vigente por rol, y cambia de nivel cerrando la asignación anterior."
tags: [user-story, colaboradores, party, c5, rol-nivel]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-019 — Asignar un Rol-Nivel a una persona

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-019 |
| Épica / capacidad | SPEC-001 C5 — Asignar Rol-Nivel (SPEC-001:L143) |
| Horizonte / release | H1 (alimenta perfil y brecha, SPEC-001:L152) |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: la brecha (US-005) necesita el Rol-Nivel del colaborador (P-28, BR-PRF-02) |
| Estimación | |
| Dependencias | US-001 (catálogo de Rol-Nivel), US-015 |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** asignar a una persona los Rol-Nivel del catálogo que desempeña y cambiar su nivel cuando corresponde, **para** que su perfil y su brecha se midan contra el nivel de rol correcto.

## 3. Contexto y valor

- **Problema que resuelve:** no estaba definido si un colaborador tiene un nivel de rol ni quién lo asigna (P-28, P-33). P-28 quedó respondida el 2026-09-27: al registrarlo se le asigna un nivel inicial del rol (en el alta, US-015) y después se evalúa su evolución por cursos o desempeño en proyectos (BR-PRF-02). Esta historia cubre las asignaciones y los cambios de nivel posteriores al alta.
- **Valor esperado:** cada persona tiene su nivel vigente por rol, con historial de cambios.
- **Métrica o KPI que impacta:** KPI 3 Cierre de brechas, de forma indirecta (RCP-001 §2).

## 4. Alcance

- **Incluye:**
  - Asignar un [Rol](../../business/glossary/terms/TRM-0055-rol.md) con su [nivel de rol](../../business/glossary/terms/TRM-0066-nivel-de-rol.md) (Rol-Nivel) con fecha desde.
  - Asignar varios roles a la misma persona.
  - Cambiar de nivel en un rol: se cierra la asignación anterior y se abre la nueva.
- **Excluye:**
  - Roles del programa, Evaluador y Jefe de Ingeniería (US-020): no son Rol-Nivel del catálogo (SPEC-001:L98).
  - Definir el catálogo (US-001).

## 5. Criterios de aceptación

### AC-1 — Asignar un Rol-Nivel

```gherkin
Escenario: Asignar Developer Junior 2
  Dado que soy el Jefe de Ingeniería y una persona no tiene asignado el rol Developer
  Cuando le asigno el Rol-Nivel Developer Junior 2 desde una fecha
  Entonces la persona queda con Developer Junior 2 vigente
```

- **Regla / fuente:** BR-PTY-11, BR-PRF-01; D6

### AC-2 — Varios roles

```gherkin
Escenario: Asignar un segundo rol
  Dado una persona con Developer Junior 2 vigente
  Cuando le asigno el Rol-Nivel Jefe de proyecto 1
  Entonces la persona queda con los dos Rol-Nivel vigentes
```

- **Regla / fuente:** BR-PTY-11; BR-CAT-13; D6

### AC-3 — Cambio de nivel

```gherkin
Escenario: Subir de nivel en un rol
  Dado una persona con Developer Junior 2 vigente
  Cuando le asigno Developer Junior 3 desde una fecha
  Entonces la asignación de Developer Junior 2 queda cerrada y Developer Junior 3 queda vigente desde esa fecha
```

- **Regla / fuente:** BR-PTY-11, BR-PTY-12

### AC-4 — Historial

```gherkin
Escenario: Conservar asignaciones anteriores
  Dado una persona que cambió de nivel en un rol
  Cuando consulto sus asignaciones
  Entonces veo la asignación anterior con su vigencia cerrada y la actual vigente
```

- **Regla / fuente:** BR-PTY-12

### AC-5 — Escalar exige las competencias de los niveles inferiores

```gherkin
Escenario: Subir de nivel sin haber cumplido los niveles inferiores
  Dado una persona con Developer Junior 2 vigente que no ha cumplido todas las competencias de Developer Junior 1 y Developer Junior 2
  Cuando intento asignarle Developer Junior 3
  Entonces la asignación no se permite y se indican las competencias de niveles inferiores pendientes
```

- **Regla / fuente:** BR-PRF-03 (EVD-2026-0125, respuesta a US1-Q1, 2026-09-27)
- **Confirmado el 2026-10-03 (EVD-2026-0153):** "haber cumplido" una competencia se interpreta como tenerla certificada al menos en el nivel L1–L4 que exige el Rol-Nivel inferior (BR-CAT-14). Quién decide el paso y si basta con los niveles inferiores sigue abierto (P-42).

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Dos niveles vigentes del mismo rol | No puede ocurrir: asignar otro nivel cierra el anterior | BR-PTY-11 |
| Rol-Nivel que no existe en el catálogo | Se rechaza (solo Rol-Nivel del catálogo) | SPEC-001:L91 |
| Nivel que el rol no define (por ejemplo, un Nivel 4 en un rol registrado con tres niveles) | Se rechaza: cada rol define sus propios niveles al registrarse | BR-CAT-09; EVD-2026-0100, EVD-2026-0101 |
| Asignar a una persona sin rol vigente de Empleado o Contratista | Sin regla | US-019-Q1 |
| Asignar el nivel inicial sin competencias certificadas | Se permite: el nivel inicial se asigna al registrar y la evolución se evalúa después | BR-PRF-02; EVD-2026-0103 |
| Cambiar a un nivel superior sin haber cumplido las competencias de los niveles inferiores | No se permite (AC-5) | BR-PRF-03; P-42 (parcialmente respondida) |
| Cambiar a un nivel superior habiendo cumplido los inferiores pero no las competencias del nivel destino | Sin regla: no está dicho si basta con los inferiores | P-42 |
| Persona anonimizada | No se edita | BR-PTY-14 |
| Usuario que no es Jefe de Ingeniería ni ADMIN | No puede (ADMIN desde el 2026-10-03, EVD-2026-0152) | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-11 | Varios Rol-Nivel, un nivel vigente por rol; cambiar de nivel cierra el anterior | BRC-001 |
| BR-PRF-01 | Al colaborador se le asigna un rol; puede tener varios | BRC-001 §Transparencia |
| BR-PRF-02 | Nivel inicial del rol al registrar; la evolución se evalúa después por cursos o desempeño en proyectos | BRC-001 §Transparencia |
| BR-CAT-13 | Jefe de proyecto es un Rol-Nivel del catálogo | BRC-001 §Catálogo |
| BR-CAT-09 | Cada rol define sus niveles al registrarse; no hay una cantidad general (revisada el 2026-09-27) | BRC-001 §Catálogo |
| BR-CAT-14 | Cada Rol-Nivel fija el nivel L1–L4 esperado de sus competencias (revisada el 2026-09-27: ya no "niveles 1 a 4") | BRC-001 §Catálogo |
| BR-CAT-18 | Escala salarial, MOF y criterios de nivel (años de experiencia, formación técnica) fuera de alcance | BRC-001 §Catálogo |
| BR-PRF-03 | Para escalar a un nivel superior de su rol, el colaborador debe haber cumplido las competencias de los niveles inferiores (2026-09-27) | BRC-001 §Transparencia |
| BR-PTY-12 | Vigencias y auditoría | BRC-001 |
| BR-PTY-17 | Permiso | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Rol | Rol del catálogo | [TRM-0055](../../business/glossary/terms/TRM-0055-rol.md) |
| Nivel de rol | Nivel asignado | [TRM-0066](../../business/glossary/terms/TRM-0066-nivel-de-rol.md) |
| Asignación de Rol-Nivel | Dato gestionado | Término nuevo de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** el nivel de rol es un dato de desempeño de una persona. P-08 quedó respondida el 2026-09-27: el rol de una persona es visible para cualquier colaborador (BR-PTY-20, P-52) y el resumen de sus niveles certificados también (BR-TRA-03). Ya no aplica el "acceso mínimo" provisional. **Inferencia:** "rol" en BR-PTY-20 incluye el nivel de rol vigente; no se precisó.
- **Otros:** auditoría (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** ficha de la persona → asignaciones vigentes → asignar rol o cambiar nivel → confirmar.
- **Estados de la interfaz:** sin asignaciones; éxito; Rol-Nivel no disponible en el catálogo; sin permisos.
- **Contenido clave:** roles vigentes con su nivel e historial; aviso de que cambiar el nivel cierra el anterior.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-001 (Rol-Nivel en el catálogo), US-015.
- **Es prerrequisito de:** US-005 (brecha), US-004 (perfil).
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: la asignación se hace a colaboradores vigentes; SPEC-001 dice "persona" (US-019-Q1). **Confirmada el 2026-10-03 (EVD-2026-0146).**

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| P-28 | ¿La asignación de Rol-Nivel debe justificarse con competencias certificadas? | Jefe de Ingeniería | Alta | No | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): el nivel inicial se asigna al registrar, sin certificaciones previas, y la evolución se evalúa después (BR-PRF-02). Ver P-42 |
| P-42 | ¿Cómo se decide el paso de un colaborador al siguiente nivel de su rol? ¿Lo decide una persona a partir de las competencias certificadas, o se deduce de los niveles L1–L4 alcanzados? | Jefe de Ingeniería | Alta | Sí (quién decide y si basta con los niveles inferiores) | Respondida (ianache (Jefe de Ingeniería), 2026-10-03): decide el Jefe de Ingeniería o ADMIN (EVD-2026-0145). ADMIN cambia el nivel directamente (EVD-2026-0151) |
| P-36 | ¿Cómo se combinan Junior/Senior con 1 a 4? | Jefe de Ingeniería | Alta | No (lo resuelve el catálogo, US-001) | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): cada rol define sus niveles y nombres al registrarse, por ejemplo Developer Junior (Nivel 1) a (Nivel 3) (BR-CAT-09) |
| P-40 | ¿La plataforma registra los criterios de cada nivel de rol (años de experiencia, formación técnica)? Se supone que no (BR-CAT-18) | Jefe de Ingeniería | Media | No (la asignación no valida esos criterios) | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): por ahora no; son parte del MOF, fuera de alcance (BR-CAT-18) |
| US-019-Q1 | ¿Se puede asignar Rol-Nivel a una persona que no es colaborador vigente? | Jefe de Ingeniería | Media | No | Respondida (ianache (Jefe de Ingeniería), 2026-10-03): solo colaboradores vigentes (EVD-2026-0146) |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0079 | Varios roles, un nivel vigente por rol | SPEC-001:L60 (D6) | decision | high |
| EVD-2026-0078 | Asignación de Rol-Nivel como entidad aparte | SPEC-001:L59 (D5) | decision | high |
| EVD-2026-0084 | La asigna el Jefe de Ingeniería | SPEC-001:L65 (D11) | decision | high |
| EVD-2026-0100 | No hay una cantidad general de niveles de rol; se definen al registrar cada rol | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-26 | decision | high |
| EVD-2026-0101 | Ejemplo de niveles de un rol: Developer Junior (Nivel 1), (Nivel 2) y (Nivel 3) | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-36 | decision | high |
| EVD-2026-0103 | Al registrar un colaborador se le asigna un nivel inicial según el rol; después se evalúa su evolución por cursos o desempeño en proyectos | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-28 | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Parcial | Necesita el catálogo (US-001) y personas (US-015) |
| Negociable | Sí | Justificación con certificaciones abierta |
| Valiosa | Sí | Habilita perfil y brecha |
| Estimable | Parcial | BR-PRF-03 agrega una validación al cambiar de nivel (AC-5); el resto de P-42 puede agregar otras |
| Pequeña (Small) | Sí | Asignar y cambiar nivel |
| Testeable | Sí | Criterios verificables |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [ ] No hay preguntas abiertas que bloqueen
- [x] Las dependencias están identificadas
- [x] Los términos de negocio están en el glosario, o tienen una pregunta para el glosario
- [ ] El PO validó la historia

## 16. Definition of Done (funcional)

- [ ] Todos los criterios de aceptación pasan sus pruebas de aceptación
- [ ] Los casos negativos y límite están cubiertos por pruebas
- [ ] La accesibilidad WCAG 2.2 AA está revisada
- [ ] Los requisitos de privacidad se cumplen
- [ ] El PO aceptó la historia en la revisión
- [ ] Nunca hay dos niveles vigentes del mismo rol para una persona

## 17. Preparación y validación

- **Estado:** CONDITIONAL
- **Motivo:** asignación y cambio de nivel sostenidos por BR-PTY-11 y BR-PRF-02 (P-28 respondida el 2026-09-27). El 2026-09-27 se agregó AC-5: para escalar, el colaborador debe haber cumplido las competencias de los niveles inferiores (BR-PRF-03, P-42 en parte). Sigue CONDITIONAL porque falta el resto de P-42 (quién decide el paso y si basta con los niveles inferiores) y confirmar qué significa "haber cumplido" (inferencia de AC-5: certificadas en el nivel esperado).
- **Bloqueos de entrega:** US-001 y US-015.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería responde el resto de P-42, confirma la inferencia de AC-5 y valida la historia.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
