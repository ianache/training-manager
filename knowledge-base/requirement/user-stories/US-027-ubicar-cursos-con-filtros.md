---
type: User Story
title: "US-027 — Ubicar cursos con filtros"
description: "El Colaborador (propuesta D1, sin validar) reduce la lista de cursos con filtros por competencia y nivel, Rol-Nivel, estado de la versión e Instructor o edición (propuesta D2, sin validar)."
tags: [user-story, h2, cursos, filtros, propuesta-sin-validar]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-10-03T14:10:00-05:00"
sources:
  - id: rcp-004
    resource: /knowledge-base/requirement/context-packs/RCP-004-catalogo-de-cursos-con-filtros.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
---

# US-027 — Ubicar cursos con filtros

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-027 |
| Épica / capacidad | Búsqueda de cursos mediante filtros (RCP-004, pregunta de trabajo, RCP-004:L31); no figura en USC-001. Sigue el precedente de US-015 a US-025 |
| Horizonte / release | Por definir. H2 es hipótesis (RCP-004 H-01; RCP4-Q14) |
| Actor | [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md), como **propuesta sin validar** (D1; BR-FOR-11; EVD-2026-0136) |
| Responsable de negocio (PO) | Jefe de Ingeniería (Responsable del término [Curso](../../business/glossary/terms/TRM-0106-curso.md), TRM-0106) |
| Prioridad | Propuesta MoSCoW: Could. Mejora la exploración de US-026, que es la base; ninguna fuente fija prioridad. La decide el PO |
| Estimación | |
| Dependencias | US-026 (la lista de cursos); US-001 (catálogo de competencias: competencias y Rol-Nivel); US-009 (ruta de formación, NOT READY): relación sin resolver (RCP4-Q4) |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Colaborador (propuesta D1), **quiero** reducir la lista de cursos con criterios que combine, **para** ubicar los cursos que me interesan sin recorrerlos todos.

## 3. Contexto y valor

- **Problema que resuelve:** ubicar un curso hoy exige buscarlo a mano en Google Classroom (RCP-004:L38, reformulación del agente, sin validar).
- **Valor esperado:** llegar a los cursos relevantes por criterios que la plataforma ya conoce.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:** los filtros propuestos en D2 (BR-FOR-12, sin validar), cada uno con su respaldo:
  - Competencia y nivel L1-L4 (BR-FOR-01, BR-FOR-02, BR-FOR-03).
  - Rol-Nivel mínimo y objetivo (BR-FOR-01).
  - Estado de la versión (BR-FOR-06 a BR-FOR-09).
  - Instructor y edición (BR-FOR-05, BR-FOR-10).
  - Combinar filtros: sin regla (US-027-Q1).
- **Excluye:**
  - Ver la lista y los datos de cada curso: US-026.
  - Filtros por duración, modalidad, idioma y producto: no son requisitos (D2; BR-FOR-17; P-59).
  - Ordenamiento, búsqueda por texto y resultado vacío: P-58.
  - Inscribirse: P-57.

## 5. Criterios de aceptación

Cada criterio se sostiene en la regla de diseño del curso que respalda el filtro; que existan esos filtros y que los use el Colaborador son las propuestas D2 y D1, sin validar.

### AC-1 — Filtrar por competencia y nivel

```gherkin
Escenario: Cursos que desarrollan una competencia en un nivel
  Dado cursos que desarrollan competencias en niveles L1-L4
  Cuando el Colaborador filtra por una competencia y un nivel
  Entonces la lista muestra solo los cursos que desarrollan esa competencia en ese nivel
```

- **Regla / fuente:** BR-FOR-01, BR-FOR-02 (BRC-001:L270-L271); R-34 (IMD-001:L232); D2 (BR-FOR-12, BRC-001:L281)

### AC-2 — Filtrar por Rol-Nivel

```gherkin
Escenario: Cursos dirigidos a un Rol-Nivel
  Dado cursos que definen, para cada rol al que se dirigen, un nivel de rol mínimo y uno objetivo
  Cuando el Colaborador filtra por un Rol-Nivel como mínimo o como objetivo
  Entonces la lista muestra solo los cursos que lo tienen como mínimo o como objetivo, según lo elegido
```

- **Regla / fuente:** BR-FOR-01; R-35 (IMD-001:L233); D2

### AC-3 — Filtrar por estado de la versión

```gherkin
Escenario: Cursos según el estado de su versión
  Dado cursos con versiones en estado DRAFT, APPROVED o DEPRECATED que la lista incluye
  Cuando el Colaborador filtra por un estado de versión
  Entonces la lista muestra solo los cursos con una versión en ese estado
```

- **Regla / fuente:** BR-FOR-06 a BR-FOR-09 (BRC-001:L275-L278); R-37 (IMD-001:L235); D2. Qué estados incluye la lista y cuáles ofrece el filtro al Colaborador: P-55 (sección 6)

### AC-4 — Filtrar por Instructor o edición

```gherkin
Escenario: Cursos con una edición a cargo de un Instructor
  Dado ediciones de curso con un Instructor asignado
  Cuando el Colaborador filtra por un Instructor
  Entonces la lista muestra solo los cursos que tienen una edición a cargo de ese Instructor
```

- **Regla / fuente:** BR-FOR-05 (BRC-001:L274); R-38, R-42, R-43 (IMD-001:L236, L240-L241); D2. La cardinalidad Edición 0..1 : Instructor de R-42 es inferencia (no se asume en el criterio; P-49.1 a P-49.3). Mostrar al Instructor como dato: RCP4-Q11 (sección 9)

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Combinar varios filtros: ¿todos a la vez (Y) o alguno (O)? | Sin regla | US-027-Q1 |
| Limpiar los filtros y volver a la lista completa | Sin regla | US-027-Q2 |
| Ningún curso cumple los filtros | Sin regla: qué se muestra | P-58 (BR-FOR-16) |
| Qué versiones (DRAFT, DEPRECATED) puede ver o filtrar el Colaborador; si el estado es filtro o restricción | Sin regla. Solo se sostiene que las APPROVED son las que admiten inscripciones nuevas (BR-FOR-08); ocultar las otras no está respaldado | P-55 (BR-FOR-13) |
| Edición "abierta, en curso o histórica" como filtro; atributos de la edición | Sin regla | RCP4-Q11 |
| Filtrar por competencia con versión cambiada | Sin regla: si usa la versión vigente de la competencia | RCP4-Q12 (P-50.1) |
| Filtro por nivel de rol mínimo frente a L1-L4 | Sin regla: relación abierta | P-46 |
| Cursos de Classroom sin diseño (sin nivel ni competencias) | Sin regla: si aparecen y cómo se filtran | P-56 (BR-FOR-14) |
| Filtros por duración, modalidad, idioma o producto | Sin respaldo; no son requisitos | P-59 (BR-FOR-17) |
| Búsqueda por texto y orden de la lista filtrada | Sin regla | P-58 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-FOR-01, BR-FOR-02, BR-FOR-03 | Competencia, nivel L1-L4 y Rol-Nivel mínimo y objetivo del curso | BRC-001:L270-L272 |
| BR-FOR-05 | El Instructor se asigna a una edición | BRC-001:L274 |
| BR-FOR-06, BR-FOR-08, BR-FOR-09 | Estados de versión; solo APPROVED admite inscripciones nuevas | BRC-001:L275, L277, L278 |
| BR-FOR-10 | El inscrito termina en su edición | BRC-001:L279 |
| BR-FOR-11, BR-FOR-12 | Propuestas sin validar (D1, D2) | BRC-001:L280-L281 |
| BR-FOR-13 a BR-FOR-17 | Vacíos (sección 6); no son criterios | BRC-001:L282-L286 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Curso | Lo que se filtra | [TRM-0106](../../business/glossary/terms/TRM-0106-curso.md) |
| Competencia | Criterio de filtro, con nivel L1-L4 | [TRM-0014](../../business/glossary/terms/TRM-0014-competencia.md) |
| Versión de curso | Estado como criterio de filtro | [TRM-0104](../../business/glossary/terms/TRM-0104-version-de-curso.md) |
| Edición de curso | Criterio de filtro | [TRM-0102](../../business/glossary/terms/TRM-0102-edicion-de-curso.md) |
| Instructor | Criterio de filtro | [TRM-0105](../../business/glossary/terms/TRM-0105-instructor-edicion-de-curso.md) |
| Colaborador | Actor propuesto (D1) | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) |
| Nivel de rol (Rol-Nivel) | Criterio de filtro: nivel de rol mínimo y objetivo | [TRM-0066](../../business/glossary/terms/TRM-0066-nivel-de-rol.md) |
| "Catálogo de cursos" | Nombre del pedido; **no es término del glosario** y no se define aquí (GQ-38) | Sin entrada |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio); los filtros y el resultado deben operarse con teclado y anunciarse a un lector de pantalla.
- **Privacidad y datos personales:** el filtro por Instructor toca a un colaborador (R-43). BR-PTY-20 permite a cualquier colaborador ver el nombre de otra persona y ningún dato más (identificaciones, teléfono). Si el filtro se muestra, no debe exponer otros datos; si el Instructor se muestra en el curso es RCP4-Q11 y no se asume. Los demás filtros no tocan datos personales.
- **Otros:** Sin requisito identificado.

## 10. Consideraciones de UX

- **Flujo esperado:** el Colaborador está en la lista de cursos (US-026), elige uno o varios filtros, ve la lista reducida y puede cambiarlos o quitarlos (cómo se limpian, US-027-Q2).
- **Estados de la interfaz:** sin filtros aplicados; con filtros; sin resultados (contenido sin regla, P-58); error al cargar; sin permiso (sin regla, P-55).
- **Contenido clave:** los filtros disponibles (competencia y nivel, Rol-Nivel mínimo y objetivo, estado de versión, Instructor o edición) y cuáles están aplicados.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-026; US-001 (competencias y Rol-Nivel, USC-001:L64); datos de personas para el Instructor (BR-PTY-20).
- **Es prerrequisito de:** —
- **Supuestos:** S-1: el Colaborador accede autenticado; origen RCP-004 H-07; lo confirmaría el Responsable de producto.
- **Hipótesis del agente:** H-0: la cardinalidad Edición 0..1 : Instructor es inferencia de IMD-001 R-42; la confirmaría P-49. H-1: el actor es el Colaborador (D1, EVD-2026-0136); lo confirmaría P-60. H-2: los filtros son los de D2 (EVD-2026-0137); lo confirmaría P-60. H-3: el filtro por Rol-Nivel serviría para el Rol-Nivel actual o el siguiente (RCP-004 H-05); lo confirmaría el Responsable de producto.

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| P-60 | ¿Se validan D1 (Colaborador) y D2 (filtros) como reglas vigentes? | Jefe de Ingeniería / Responsable de producto | Alta | Sí | Abierta |
| P-55 | ¿Qué cursos y versiones ve cada actor? ¿El estado es filtro o restricción? | Jefe de Ingeniería | Alta | Sí | Abierta |
| P-56 | ¿Qué metadatos se leen de Classroom y cuáles conserva la plataforma? ¿Aparece un curso sin diseño? | Gestión de formación + ARQ | Alta | Sí | Abierta |
| P-57 | ¿Explorar implica poder inscribirse? (afecta a qué filtrar por estado) | Jefe de Ingeniería | Alta | Sí | Abierta |
| US-027-Q1 | Los filtros, ¿se combinan con Y (todos a la vez), con O, o según el filtro? | Responsable de producto + UX | Alta | Sí | Nueva |
| US-027-Q2 | ¿Cómo se quitan los filtros (uno a uno, todos a la vez) y cuál es el estado inicial? | Responsable de producto + UX | Baja | No | Nueva |
| US-027-Q3 | ¿El filtro por Rol-Nivel es por el mínimo, por el objetivo o por ambos a la vez? | Responsable de producto | Media | No | Nueva |
| P-58 | ¿Orden, búsqueda por texto y resultado vacío? | Responsable de producto + UX | Media | No | Abierta |
| P-59 | ¿Duración, modalidad, idioma y producto son atributos que importan? | Responsable de producto | Media | No | Abierta |
| P-49 | R-42 clasifica como inferencia la cardinalidad Edición 0..1 : Instructor (P-49.1 a P-49.3): ¿una edición puede tener más de un Instructor? | Jefe de Ingeniería | Media | No | Abierta |
| RCP4-Q11 | ¿Se muestra el Instructor y qué es una edición como filtro (abierta, en curso, histórica)? | Jefe de Ingeniería + Gestión de formación | Media | No | Abierta |
| RCP4-Q12 | ¿El filtro por competencia usa la versión vigente? (P-50.1) | Jefe de Ingeniería | Media | No | Abierta |
| P-46 | ¿Cómo se relaciona el nivel de rol mínimo con L1-L4? | Jefe de Ingeniería | Alta | No | Abierta |
| GQ-38 | ¿Cómo se llama y qué es el "catálogo de cursos"? (IM-Q13) | Responsable de producto | Alta | No | Abierta |
| RCP4-Q4 | ¿Cómo se relaciona con US-009 (ruta de formación)? | Responsable de producto | Alta | No | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0136 | D1: el Colaborador explora el catálogo de cursos; pendiente de validación | BRC-001:L158 | hypothesis | medium |
| EVD-2026-0137 | D2: filtros solo los respaldados por reglas existentes; pendiente de validación | BRC-001:L159 | hypothesis | medium |
| EVD-2026-0138 | Sin fuente: visibilidad, orden, búsqueda, resultado vacío y filtros de duración, modalidad, idioma y producto | BRC-001:L160 | gap | high |
| EVD-2026-0074 | Competencias en nivel L1-L4 y niveles de rol por curso | BR-FOR-01, BRC-001:L270 | decision | high |
| EVD-2026-0116 | Versiones y estados; solo APPROVED admite inscripciones nuevas | BR-FOR-06 a BR-FOR-10, BRC-001:L275-L279 | decision | high |
| EVD-2026-0131 | El Instructor es un colaborador que el Jefe de Ingeniería o un ADMIN asigna a una edición | BR-FOR-05, BRC-001:L274 | decision | high |

Evidencia compartida: `source_type: knowledge-base`, `observed_at: 2026-10-03T14:10:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`. EVD-2026-0136 y 0134 son propuestas de la sesión de `ianache` sin validación del Responsable de dominio.

- **Upstream:** [RCP-004](../context-packs/RCP-004-catalogo-de-cursos-con-filtros.md), [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md), [IMD-001](../../business/information-model/IMD-001-modelo-de-informacion-conceptual.md) (R-34, R-35, R-37, R-38, R-42, R-43; vista, IM-Q13)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Parcial | Requiere US-026 (lista) y US-001; sin ellas no hay qué filtrar |
| Negociable | Sí | Combinación, limpieza y filtros adicionales quedan abiertos |
| Valiosa | Parcial | Valor reformulado por el agente, sin validar |
| Estimable | Parcial | US-027-Q1 (Y/O) y P-55 (qué estados se filtran) afectan al esfuerzo |
| Pequeña (Small) | Parcial | Cuatro filtros con respaldo distinto; cabe en una iteración, pero se podría dividir por filtro (sección 17) |
| Testeable | Parcial | AC-1 a AC-4 verificables por separado; la combinación no |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente (como propuesta D1; BR-FOR-11 sin validar)
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [ ] No hay preguntas abiertas que bloqueen (P-55, P-56, P-57, P-60 y US-027-Q1 bloquean)
- [x] Las dependencias están identificadas
- [x] Los términos de negocio están en el glosario, o tienen una pregunta para el glosario ("catálogo de cursos": GQ-38)
- [ ] El PO validó la historia

## 16. Definition of Done (funcional)

- [ ] Todos los criterios de aceptación pasan sus pruebas de aceptación
- [ ] Los casos negativos y límite están cubiertos por pruebas
- [ ] La accesibilidad WCAG 2.2 AA está revisada
- [ ] Los requisitos de privacidad se cumplen
- [ ] El PO aceptó la historia en la revisión
- [ ] Solo existen los filtros validados por el PO (ninguno de duración, modalidad, idioma o producto sin respaldo)

## 17. Preparación y validación

- **Estado:** CONDITIONAL
- **Motivo:** cada filtro de D2 tiene respaldo en reglas vigentes (AC-1 a AC-4), pero D1 y D2 son propuestas sin validar (P-60) y no hay regla sobre cómo se combinan los filtros (US-027-Q1), qué versiones ve el Colaborador (P-55), qué datos salen de Classroom (P-56) ni la inscripción (P-57). No puede ser READY. Si P-60 rechaza D1 o D2, pasa a NOT READY.
- **Bloqueos de entrega:** US-026 y US-001 (US-001 existe en USC-001); US-009 sin resolver (RCP4-Q4).
- **Propuesta de división (si no es pequeña):** si el PO prefiere entregas más pequeñas: US-027a (competencia y nivel, Rol-Nivel: filtros de diseño del curso, sin dudas de visibilidad) y US-027b (estado de versión e Instructor o edición: dependen de P-55 y RCP4-Q11). Se mantiene una historia porque comparten la misma conducta y la combinación (US-027-Q1) las afecta a todas.
- **Siguiente rol o Skill:** `af-business-rule-extractor` (BR-FOR-13 a BR-FOR-17 y la regla de combinación) cuando se respondan las preguntas; luego `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería y el Responsable de producto responden P-60, P-55, P-56, P-57 y US-027-Q1, y validan la historia.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
