---
type: User Story
title: "US-023 — Consultar la ficha y su historial"
description: "El Jefe de Ingeniería consulta la ficha de cualquier persona con su historial de vigencias; el colaborador consulta la suya y, de las demás personas, solo nombre, correo laboral, unidad, rol y perfiles profesionales (BR-PTY-20, P-52 respondida)."
tags: [user-story, colaboradores, party, c9, consulta, historial]
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

# US-023 — Consultar la ficha y su historial

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-023 |
| Épica / capacidad | SPEC-001 C9 — Consultar la ficha y su historial (SPEC-001:L147) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md); el [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md), la suya y los datos abiertos de las demás personas (BR-PTY-20) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Should: da visibilidad a lo registrado; la gestión puede operar antes con las historias de edición |
| Estimación | |
| Dependencias | US-015; US-022 para el colaborador |
| Preparación | READY (antes CONDITIONAL; P-52 respondida el 2026-09-27) |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** consultar la ficha de una persona con su historial de roles, relaciones, contactos y asignaciones, **para** conocer su situación actual y pasada en la organización.

## 3. Contexto y valor

- **Problema que resuelve:** las vigencias guardan la historia (BR-PTY-12), pero hay que poder verla.
- **Valor esperado:** situación vigente e historial de cada persona; el colaborador ve sus propios datos (transparencia, BR-TRA-01 por analogía).
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Ver datos de la persona, identificaciones, medios de contacto, roles, relaciones (unidad, jefe directo, proveedor), asignaciones de Rol-Nivel e identidad de acceso, con sus vigencias.
  - Que el colaborador vea su propia ficha.
  - Que cualquier colaborador que ingrese a la plataforma vea de las demás personas solo el nombre, el correo laboral, la unidad, el rol y los perfiles profesionales (D27, BR-PTY-20; P-52 respondida el 2026-09-27, EVD-2026-0130).
- **Excluye:**
  - Mostrar a otros colaboradores las identificaciones, el teléfono o los demás datos personales: no se muestran (BR-PTY-20, precisada por P-52). Antes era la hipótesis prudente H-2; ahora es regla.
  - El perfil de competencias, las evidencias y las certificaciones de otro colaborador. P-08 quedó respondida el 2026-09-27: el resumen de niveles certificados, las evidencias y las certificaciones son visibles para cualquier colaborador (BR-TRA-03, BR-TRA-05, BR-TRA-06), pero no son parte de la ficha; los cubre la vista de perfil (US-004 para el propio).

## 5. Criterios de aceptación

### AC-1 — Ficha vigente

```gherkin
Escenario: Ver la situación actual
  Dado que soy el Jefe de Ingeniería y existe un colaborador con rol, unidad, jefe directo, contactos y Rol-Nivel vigentes
  Cuando consulto su ficha
  Entonces veo sus datos y todos sus elementos vigentes con su fecha desde
```

- **Regla / fuente:** SPEC-001:L147; BR-PTY-17

### AC-2 — Historial

```gherkin
Escenario: Ver vigencias cerradas
  Dado un colaborador que cambió de unidad y de nivel en un rol
  Cuando consulto su historial
  Entonces veo los elementos anteriores con sus fechas desde y hasta
```

- **Regla / fuente:** BR-PTY-12

### AC-3 — El colaborador ve su ficha

```gherkin
Escenario: Consultar mi ficha
  Dado que soy un colaborador vinculado a mi usuario de acceso
  Cuando consulto mi ficha
  Entonces veo mis datos y mi historial
```

- **Regla / fuente:** SPEC-001:L147 ("el colaborador, la suya")

### AC-4 — Persona anonimizada

```gherkin
Escenario: Ficha de una persona anonimizada
  Dado una persona anonimizada
  Cuando el Jefe de Ingeniería consulta su ficha
  Entonces ve valores anónimos en lugar de sus datos personales, conserva roles, relaciones, asignaciones y fechas, y ve cuándo y quién la anonimizó
```

- **Regla / fuente:** BR-PTY-14; SPEC-001:L115

### AC-5 — Un colaborador consulta los datos de otra persona

```gherkin
Escenario: Ver los datos abiertos de otra persona
  Dado que soy un colaborador que ingresó a la plataforma y existe otra persona vigente
  Cuando consulto sus datos
  Entonces veo solo su nombre, su correo laboral, su unidad, su rol vigente y sus perfiles profesionales
  Y no veo sus identificaciones, su teléfono ni sus demás datos personales
  Y no puedo editarlos
```

- **Regla / fuente:** BR-PTY-20 (precisada el 2026-09-27, P-52, EVD-2026-0130), BR-PTY-17; D27 (Q-05). Criterio confirmado: el conjunto de datos ya no depende de una pregunta abierta

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Un colaborador consulta los datos de otra persona | Ve solo nombre, correo laboral, unidad, rol y perfiles profesionales (AC-5) | BR-PTY-20; D27 (Q-05); P-52 |
| Un colaborador consulta las identificaciones o el teléfono de otra persona | No se muestran (regla; antes hipótesis H-2) | BR-PTY-20; P-52 respondida el 2026-09-27 |
| Un colaborador consulta los datos o el código de una persona anonimizada | **Inferencia:** ve solo los cinco datos de BR-PTY-20, que en una persona anonimizada ya son valores anónimos (BR-PTY-14); el código no está entre ellos, así que no se muestra. P-52 no trató a los anonimizados de forma explícita | BR-PTY-14, BR-PTY-20; SPEC-001:L122 |
| Un colaborador consulta el historial (vigencias cerradas) de otra persona | Sin regla: D27 no dice si la data abierta incluye el historial | US-023-Q2 |
| Colaborador sin identidad de acceso vinculada | Sin regla | RCP-002 H-04 |
| Persona sin historial (recién registrada) | Se ven solo los elementos vigentes | BR-PTY-12 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-12 | Historial por vigencias | BRC-001 |
| BR-PTY-14 | Anonimización | BRC-001 |
| BR-PTY-17 | El Jefe de Ingeniería mantiene la información | BRC-001 |
| BR-PTY-09 | Medios de contacto y perfiles profesionales | BRC-001 |
| BR-PTY-20 | Cualquier colaborador que ingrese ve de las demás personas solo nombre, correo laboral, unidad, rol y perfiles profesionales; identificaciones, teléfono y demás datos personales no se muestran (precisada el 2026-09-27, P-52) | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Colaborador | Actor acotado | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) |
| Ficha, Vigencia | Vista consultada | Términos nuevos de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio); el historial en tabla o lista debe ser navegable con teclado y lector de pantalla.
- **Privacidad y datos personales:** la ficha es PII. A los demás colaboradores solo se les muestran nombre, correo laboral, unidad, rol y perfiles profesionales; identificaciones y teléfono no (BR-PTY-20; P-52 respondida el 2026-09-27), lo que respeta la minimización de datos personales. El código de anonimizados es cuasi-identificador; el riesgo baja porque es un GUID propio de la plataforma (D25; SPEC-001:L122).
- **Otros:** Sin requisito identificado.

## 10. Consideraciones de UX

- **Flujo esperado:** buscar persona (Jefe de Ingeniería o colaborador) o abrir "mi ficha" (colaborador) → ver vigente → ver historial (el colaborador, solo el suyo hasta US-023-Q2).
- **Estados de la interfaz:** ficha completa; sin historial; persona anonimizada; sin permisos; persona no encontrada.
- **Contenido clave:** rol de Empleado o Contratista vigente, unidad, jefe directo, proveedor, Rol-Nivel vigentes.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-015; US-022 para el colaborador.
- **Es prerrequisito de:** —
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: la búsqueda de personas es parte de la consulta (SPEC-001 no la menciona). H-2: **resuelta** el 2026-09-27 (P-52): que a otros colaboradores no se les muestren identificaciones ni teléfono ya es regla (BR-PTY-20).

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| Q-05 | ¿Quién ve los datos de otras personas, incluidos los perfiles profesionales? (P-08) | Responsable de producto | Alta | No | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D27): cualquier colaborador que ingrese (data abierta, BR-PTY-20). Origina AC-5 |
| P-52 | ¿"Data abierta" incluye identificaciones, teléfono laboral y datos de personas dadas de baja o anonimizadas, o solo nombre, correo laboral, unidad, rol y perfiles? | Jefe de Ingeniería + Legal | Alta | No (ya no) | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): solo nombre, correo laboral, unidad, rol y perfiles profesionales (BR-PTY-20, EVD-2026-0130) |
| US-023-Q1 | ¿El colaborador ve todo su historial o solo lo vigente? | Jefe de Ingeniería | Baja | No | Abierta |
| US-023-Q2 | ¿La data abierta de otra persona incluye su historial (vigencias cerradas) o solo lo vigente? | Jefe de Ingeniería | Media | No | Nueva |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0084 | Permisos de mantenimiento | SPEC-001:L65 (D11) | decision | high |
| EVD-2026-0086 | Anonimización sin borrar | SPEC-001:L68 (D14) | decision | high |
| EVD-2026-0088 | Código y auditoría no se anonimizan | SPEC-001:L70 (D16) | decision | high |
| EVD-2026-0121 | Los datos de las personas, incluidos los perfiles profesionales, los ve cualquier colaborador que ingrese: son data abierta | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 Q-05 (D27) | decision | high |
| EVD-2026-0130 | A los demás colaboradores solo se les muestran el nombre, el correo laboral, la unidad, el rol y los perfiles profesionales de una persona | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-52 | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Parcial | Muestra lo que registran US-015 a US-022 |
| Negociable | Sí | Alcance de historial para el colaborador abierto |
| Valiosa | Sí | Visibilidad y transparencia |
| Estimable | Sí | Q-05 (D27) y P-52 respondidas: qué datos se muestran a otros colaboradores está fijado (BR-PTY-20) |
| Pequeña (Small) | Parcial | Dos actores y una tercera vista (datos abiertos de otros); ver división |
| Testeable | Sí | Criterios verificables |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [x] No hay preguntas abiertas que bloqueen (US-023-Q1 y US-023-Q2 no bloquean)
- [x] Las dependencias están identificadas
- [x] Los términos de negocio están en el glosario, o tienen una pregunta para el glosario
- [ ] El PO validó la historia

## 16. Definition of Done (funcional)

- [ ] Todos los criterios de aceptación pasan sus pruebas de aceptación
- [ ] Los casos negativos y límite están cubiertos por pruebas
- [ ] La accesibilidad WCAG 2.2 AA está revisada
- [ ] Los requisitos de privacidad se cumplen
- [ ] El PO aceptó la historia en la revisión
- [ ] Una persona anonimizada no muestra PII en ninguna vigencia

## 17. Preparación y validación

- **Estado:** READY (antes CONDITIONAL)
- **Motivo:** la consulta del Jefe de Ingeniería y la propia del colaborador están sostenidas. Q-05 se respondió el 2026-09-27 (D27: data abierta) y P-52 también (EVD-2026-0130): de otras personas solo se muestran nombre, correo laboral, unidad, rol y perfiles profesionales, así que AC-5 queda confirmado y H-2 resuelta. Quedan US-023-Q1 y US-023-Q2, que no bloquean, la inferencia sobre personas anonimizadas y la validación del PO.
- **Bloqueos de entrega:** US-015; US-022 para el colaborador.
- **Propuesta de división (si no es pequeña):** por actor y vista: US-023a (Jefe de Ingeniería consulta cualquier ficha), US-023b (el colaborador consulta la suya) y US-023c (el colaborador consulta los datos abiertos de otras personas; P-52 ya respondida).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería responde US-023-Q2, confirma la inferencia sobre personas anonimizadas y valida.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
