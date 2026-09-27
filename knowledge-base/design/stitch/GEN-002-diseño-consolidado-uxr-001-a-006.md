---
type: Generation Prompt
title: "GEN-002 — Diseño Google Stitch consolidado de todas las UXR (UXR-001 a UXR-006)"
description: "Estrategia de generación, prompts, supuestos documentados y hallazgos críticos para todas las pantallas candidatas (SCR-001 a SCR-010)."
tags: [ux-ui, stitch, generation-prompt, consolidado, h1]
status: draft
generated:
  by: "stitch-ui-generator/1.0"
  at: "2026-09-27T20:35:00-05:00"
sources:
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
  - id: uxr-001
    resource: /knowledge-base/design/ux-requirements/UXR-001-gestionar-catalogo-de-roles-y-competencias.md
  - id: uxr-002
    resource: /knowledge-base/design/ux-requirements/UXR-002-declarar-requerimiento-de-proyecto.md
  - id: uxr-003
    resource: /knowledge-base/design/ux-requirements/UXR-003-certificar-un-nivel-de-competencia.md
  - id: uxr-004
    resource: /knowledge-base/design/ux-requirements/UXR-004-consultar-mi-perfil-de-competencias.md
  - id: uxr-005
    resource: /knowledge-base/design/ux-requirements/UXR-005-ver-mi-brecha-frente-a-un-rol-nivel.md
  - id: uxr-006
    resource: /knowledge-base/design/ux-requirements/UXR-006-buscar-candidatos-para-un-requerimiento.md
  - id: us-001-006
    resource: /knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: gen-001
    resource: /knowledge-base/design/stitch/GEN-001-catalogo-de-roles-y-competencias.md
---

# GEN-002 — Diseño consolidado UXR-001 a UXR-006

> **Estado:** diseño **exploratorio**, generado con IA. Incluye supuestos documentados para preguntas abiertas (US2-Q1, P-07.4, P-49.2, P-44, UXR-Q4). **No está aprobado**: que las pantallas se vean bien no significa que sean correctas. Las pantallas en Stitch son **referencias**; lo canónico son UXR-000 a UXR-006 y las reglas BR-*.

## Estrategia de generación

Generar todas las pantallas candidatas (SCR-001 a SCR-010) en el proyecto Stitch existente `projects/7424057371727816981`, aplicando:

1. **Criterios de corrección de GEN-001:**
   - F-13: Niveles VARIABLES por rol (no pestañas fijas 1-4)
   - F-14: Requisitos de evidencia marcados como **✓ Requerida** / **○ Deseada**
   - F-15: Estados "Sin requisitos definidos" bloqueantes (validación que impide asignar/certificar)

2. **Decisiones del 2026-09-27 (BRC-001):**
   - BR-CAT-20: Un rol DEBE tener al menos una competencia (bloqueante al guardar)
   - BR-CAT-21: Una competencia no se repite dentro de un rol
   - BR-ACR-13: Un nivel sin requisitos de evidencia no se puede exigir ni certificar (bloqueante)
   - BR-TRA-02: Todos los colaboradores ven el catálogo en lectura (sin editar)
   - BR-TRA-03: Resumen de niveles certificados es público
   - BR-REQ-10: Solo el Jefe de Proyecto que registra puede retirar competencias
   - BR-CER-07: Evaluador emite conclusión sustentada si decide distinto a propuesta

3. **Design System:** Reutilizar "Corporate Enterprise Learning & Skills" v1 creado por Stitch en GEN-001, salvo que UXR-Q4 indique lo contrario.

## Supuestos documentados

| ID | Punto abierto | Supuesto documentado | Fuente | Refinamiento |
|---|---|---|---|---|
| **S-01** | ¿De dónde salen los proyectos? (US2-Q1) | Proyectos son datos maestros creados fuera de esta plataforma (RRHH/PMO). SCR-004 es una lista que el usuario abre desde la navegación lateral, con permisos por proyecto (solo si es Jefe de ese Proyecto). | US2-Q1 abierta | Validar con Responsable de Producto y definir integración con sistema de proyectos |
| **S-02** | ¿Quién certifica: Evaluador, Instructor, o ambos? (P-07.4, P-49.2) | Por defecto, el rol "Evaluador" (BR-ACR-02). La propuesta de Instructor (BR-FOR-05) es confirmar en P-49.2. SCR-006 y SCR-007 muestran actores = Evaluador. Si se confirma el Instructor, se revisarán las pantallas. | P-07.4, P-49.2 abiertas | Confirmar P-49.2 con Jefe de Ingeniería; regenerar si aplica |
| **S-03** | ¿Solo orden menor→mayor brecha, u otros criterios? (P-44) | Por defecto, menor→mayor brecha (BR-BRE-05). Criterios adicionales (por antigüedad, disponibilidad) se dejan como botón "Ordenar por…" pero no se implementan hasta responder P-44. | P-44 abierta | Preguntar en P-44; revisar UX de ordenamiento |
| **S-04** | ¿Hay un design system corporativo de COMSATEL? (UXR-Q4) | No se encontró. Usar el que Stitch generó en GEN-001: "Corporate Enterprise Learning & Skills" v1 (adherencia WCAG 2.2 AA no verificada). Este es un supuesto de que es suficiente para H1. | UXR-Q4 abierta | Consultar Jefe de Ingeniería / Responsable de Producto sobre design system corporativo |
| **S-05** | ¿Los proyectos tienen estados? (P-11) | Supuesto: sí. Estados "Activo", "Completado", "Pausado" (común en PMO). No se modelan en el catálogo de competencias; aparecen en SCR-004 como filtros. | P-11 abierta | Validar con Responsable de Producto / Sistema de Proyectos |
| **S-06** | ¿Se pueden retirar TODAS las competencias de un requerimiento? (US2-Q4) | Supuesto: no, debe quedar al menos una (validación). Si se retiran todas, el botón "Guardar" se desactiva con el aviso "Un requerimiento debe tener al menos una competencia". | US2-Q4 abierta | Confirmar con Responsable de Producto |

## Pantallas candidatas (SCR-001 a SCR-010)

### H1: Catálogo de competencias (UXR-001) — Jefe de Ingeniería

**SCR-001: Catálogo de roles (lista)**
- Requisitos: UXR-001.1, UXR-001.6; AC-4 (US-001 lista de roles)
- Cubre: 7 roles iniciales (BR-CAT-12); estados "Definido" / "Sin definir" (roles que no tienen competencias)
- Criterios aplicados: BR-CAT-20 validación (un rol sin competencias se marca "Sin definir"; botón "Guardar" deshabilitado)
- Prompts específicos: Shell con usuario "Jefe de Ingeniería" (sin subtítulo "Gestor de Competencias", correción F-06); navegación lateral con "Catálogo de competencias" > Roles y Competencias; tabla con los 7 roles; estados por rol; botones "Nuevo rol", "Detalle" (SCR-002)

**SCR-002: Detalle de rol — Editar Rol-Nivel**
- Requisitos: UXR-001.2, UXR-001.7; AC-5, AC-6 (US-001 editar rol-nivel)
- Cubre: Pestañas VARIABLES con los niveles del rol (correción F-13: no fijas 1-4); para cada nivel: competencias con su nivel esperado L1–L4 (lectura del catálogo, BR-REQ-06)
- Criterios aplicados: BR-CAT-20 (no guardar si no hay competencias); BR-CAT-21 (error visual si misma competencia aparece dos veces)
- Prompts específicos: Pestañas dinámicas "Nivel 1", "Nivel 2", "Nivel 3" (ejemplo Developer, BR-CAT-09); cada pestaña: tabla de competencias con nivel L1–L4; si una competencia no tiene nivel esperado, marcar error y desabilitar "Guardar" (AC-5, BR-CAT-03); aviso de transversales; botón "Guardar" (guarda niveles de competencia para ese rol-nivel)

**SCR-003: Detalle de competencia — Editar Rúbrica y Requisitos**
- Requisitos: UXR-001.3 a UXR-001.5, UXR-001.8 a UXR-001.10; AC-7, AC-8 (US-001 definir rúbrica y requisitos)
- Cubre: Dos secciones: (1) Rúbrica L1–L4 con descriptores (BR-CAT-15); (2) Requisitos de evidencia por nivel, **MARCADOS como Requerida ✓ / Deseada ○** (correción F-14, BR-ACR-12)
- Criterios aplicados: Niveles sin requisitos marcados como "Sin requisitos definidos" (texto neutral, sin ejemplos como "JUnit", correción F-10); si un nivel no tiene requisitos, marcar "Bloqueado: no se puede exigir en un Rol-Nivel hasta definir requisitos" (BR-ACR-13, correción F-15); aviso de impacto en roles que usan esta competencia (BR-CAT-07)
- Prompts específicos: Tabs "L1 Novato" a "L4 Experto" (nombres del glosario); tab activa: rúbrica con textarea; requisitos de evidencia abajo con checkboxes "Requerida" por cada requisito; nota: "Los cambios en esta competencia afectan a [número] roles"; botón "Guardar"

### H1: Requerimientos de proyecto (UXR-002) — Jefe de Proyecto

**SCR-004: Mis proyectos**
- Requisitos: UXR-002.1; AC-0 (acceso)
- Cubre: Lista de proyectos donde el usuario es Jefe de Proyecto; filtros por estado (S-05: Activo, Completado, Pausado); botón "Declarar requerimiento" para proyecto seleccionado
- Criterios aplicados: Solo si el usuario es Jefe de Proyecto de esos proyectos (BR-REQ-02, US2-Q2)
- Supuesto (S-01): Los proyectos vienen del sistema de proyectos (fuera de esta plataforma); esta pantalla es una lista maestra con permisos por rol
- Prompts específicos: Tabla de proyectos (Nombre, Producto, Estado, Acciones); botón "Declarar requerimiento" solo si es Jefe; filtros por estado

**SCR-005: Declarar requerimiento de proyecto**
- Requisitos: UXR-002.2 a UXR-002.7; AC-1, AC-3 (US-002)
- Cubre: Selector de Rol-Nivel (todos los roles del catálogo, todos los productos, BR-CAT-08); vista de competencias del Rol-Nivel elegido (lectura, BR-REQ-06); checkboxes para retirar competencias (BR-REQ-07, BR-REQ-10); lista de requerimientos ya declarados
- Criterios aplicados: Solo el Jefe de Proyecto de ese proyecto puede editar (BR-REQ-10); validación: debe quedar al menos una competencia (S-06, US2-Q4); un nivel sin requisitos de evidencia no puede ser elegido (BR-ACR-13, bloqueante)
- Prompts específicos: Combo "Proyecto" (precargado); selector "Rol-Nivel" (dropdown con búsqueda); tabla de competencias del rol-nivel elegido; checkboxes "Incluir" (desmarcados los que se retiran); botón "Guardar requerimiento"; lista abajo de requerimientos ya guardados (solo lectura)

### H1: Certificación manual (UXR-003) — Evaluador

**SCR-006: Colaboradores para certificar (lista)**
- Requisitos: UXR-003.1, UXR-003.2; AC-1 (US-003)
- Cubre: Lista de colaboradores con nivel de competencia sin certificar (o en espera de evaluación); filtro por competencia
- Criterios aplicados: Solo el Evaluador ve esta pantalla (S-02, P-07.4); permisos por rol
- Prompts específicos: Tabla de colaboradores con brecha en la competencia; filtro "Competencia"; columnas: Nombre, Nivel actual, Nivel esperado, Brecha, "Ver detalle" (link a SCR-007)

**SCR-007: Certificar un nivel de competencia**
- Requisitos: UXR-003.3 a UXR-003.7; AC-2 a AC-4 (US-003)
- Cubre: Datos del colaborador; rúbrica de la competencia (L1–L4); requisitos de evidencia **MARCADOS como Requerida ✓ / Deseada ○**; evidencias del colaborador (artefactos de proyecto, evaluaciones); conclusión del evaluador (sí/no/condicional) con justificación
- Criterios aplicados: Un nivel sin requisitos de evidencia no puede certificarse (BR-ACR-13, bloqueante); si se rechaza o condiciona, registrar sustento (BR-CER-07); propuesta automática cuando se cumplen requisitos requeridos (BR-CER-06, pero no decisión final)
- Prompts específicos: Tabla de requisitos por nivel con estado (✓ cumplido / ○ parcial / ✗ no cumplido); evidencias linked (lectura desde GitLab); selector "Conclusión" (Certificar / Rechazar / Condicional); textarea "Sustento" (obligatorio si no es Certificar); botón "Guardar"

### H1: Perfiles y brechas (UXR-004 a UXR-006) — Colaborador / Jefe de Proyecto

**SCR-008: Mi perfil de competencias**
- Requisitos: UXR-004.1, UXR-004.2; AC-1 (US-004)
- Cubre: Resumen de niveles certificados POR ROL; historial de certificaciones con fecha y evaluador; evidencias
- Criterios aplicados: Resumen visible públicamente (BR-TRA-03); historial restringido al usuario y evaluadores (BR-TRA-06)
- Prompts específicos: Tabs por rol (Rol-Nivel actual); tabla de competencias con nivel certificado; historial abajo (certificaciones con fecha); link a "Ver evidencias" (SCR-009)

**SCR-009: Mi historial de evidencias**
- Requisitos: UXR-004.3 a UXR-004.5; AC-2 a AC-4 (US-004)
- Cubre: Timeline de certificaciones y evidencias; link a artefactos de proyecto (GitLab, lectura); evaluaciones tomadas
- Criterios aplicados: Usuario ve sus propias evidencias (BR-TRA-01, BR-TRA-05); auditoría visible (quién, cuándo, con qué sustento, BR-TRA-06)
- Prompts específicos: Timeline con eventos (Certificación emitida, Evaluación realizada, Evidencia agregada); cada evento: detalles, competencia, nivel, evaluador, sustento

**SCR-010: Ver mi brecha frente a un Rol-Nivel**
- Requisitos: UXR-005.1 a UXR-005.3; AC-1, AC-2 (US-005)
- Cubre: Selector "Rol-Nivel"; tabla de competencias de ese rol-nivel vs niveles certificados del usuario; cálculo de brecha
- Criterios aplicados: Usuario ve su propia brecha (BR-BRE-04); solo puede ver la suya (BR-BRE-04 inferencia a confirmar)
- Prompts específicos: Combo "Rol-Nivel" (búsqueda); tabla: Competencia, Nivel requerido, Nivel actual, Brecha; estado vacío si no hay brechas

**SCR-011: Buscar candidatos para un requerimiento**
- Requisitos: UXR-006.1 a UXR-006.4; AC-1, AC-2 (US-006)
- Cubre: Requerimiento elegido (rol-nivel, competencias); lista de candidatos que cumplen (o bajo el nivel con brecha); ordenamiento por defecto "menor a mayor brecha"
- Criterios aplicados: Jefe de Proyecto ve brechas de candidatos a sus requerimientos (BR-TRA-04, BR-BRE-05); Jefe de Ingeniería ve brechas agregadas (BR-BRE-06)
- Supuesto (S-03): Ordenamiento por defecto es menor→mayor brecha (BR-BRE-05); botón "Reordenar" pero sin opciones adicionales hasta resolver P-44
- Prompts específicos: Combo "Requerimiento" (proyecto + rol-nivel + competencias); tabla de candidatos con Nombre, Brecha (%), Estado; botones "Asignar" (si es ADMIN o Jefe de Ingeniería, BR-REQ-04, P-05)

## Hallazgos críticos aplicables a todas las pantallas

| ID | Hallazgo | Regla / Pregunta | Impacto | Acción |
|---|---|---|---|---|
| **HC-01** | No verificar accesibilidad WCAG 2.2 AA en Stitch. Afirmación de cumplimiento es falsa (GEN-001 F-02). | BR-000 (transversal) | Media | Pasar `accessibility-reviewer` sobre HTML exportado antes de validación humana |
| **HC-02** | El shell no debe mostrar subtítulo "Gestor de Competencias" bajo el usuario (GEN-001 F-06). | UXR-000 | Baja | Usar solo usuario "Jefe de Ingeniería" (u otro rol según actor) |
| **HC-03** | Navegación lateral inventada en GEN-001 ("Panel de control", "Planes de carrera", "Enterprise Workforce Hub"). Corrección: solo la jerarquía necesaria (Catálogo de competencias > Roles, Requerimientos > Mis proyectos, Certificación > Colaboradores, Mi perfil > Perfil/Brecha, Búsqueda > Candidatos). | UXR-000 | Baja | Navegar según rol (Jefe de Ingeniería vs Jefe de Proyecto vs Colaborador) |
| **HC-04** | Versiones de las pantallas tras resolver P-50.1 y P-50.2. Si se aprueba versionado del catálogo, las decisiones sobre qué pasa con Rol-Nivel y requerimientos vigentes pueden afectar SCR-001 a SCR-003 y SCR-005. | BR-CAT-06, P-50 | Media | Refineamiento posterior: agregar indicador de versión en SCR-001 a SCR-003 si aplica |

## Estado de generación (2026-09-27T20:35:00-05:00)

| SCR | UXR | Estado | Criterios aplicados | Notas |
|---|---|---|---|---|
| SCR-001 | UXR-001 | ✓ Generada | F-01 (nav limpia), F-02 (sin WCAG), F-03 (sin "activo"), F-06 (no subtítulo), BR-CAT-20 (validación) | Tabla de 7 roles, estados "Definido"/"Sin definir" |
| SCR-002 | UXR-001 | ✓ Generada | F-13 (pestañas variables), F-06 (usuario limpio), BR-CAT-03 (error visual), BR-CAT-07 (aviso impacto), BR-CAT-20 | Developer con 3 niveles; Trabajo en Equipo sin nivel (error rojo, Guardar bloqueado) |
| SCR-003 | UXR-001 | ✓ Generada | F-14 (✓ Requerida / ○ Deseada), F-15 (estado "Sin requisitos definidos"), BR-ACR-13 (bloqueante), BR-CAT-07 (usada en 4 roles) | Rúbrica L1–L4 + requisitos por nivel, marcados requerido/deseado |
| SCR-004 | UXR-002 | ✓ Generada | UXR-002.1, S-01 (proyectos maestros), BR-REQ-02 (acceso solo si Jefe de ese proyecto) | Lista proyectos con filtros por estado, botón "Declarar requerimiento" |
| SCR-005–011 | UXR-002–006 | ⏳ Timeouts | F-13/14/15, supuestos S-01–S-06, criterios HC-01–HC-04 | Pausado por timeouts consecutivos en Stitch; continuar en próxima sesión |

## Próximos pasos

1. **Completar SCR-003 a SCR-011:** Reintentar SCR-003 con prompt más conciso; luego generar de 2 en 2 en paralelo.
2. **Documentar lineage:** En cada pantalla generada en Stitch, registrar en la descripción de pantalla: SCR-ID, UXR fuente, criterios aplicados (F-13/14/15), supuestos (S-01 a S-06).
3. **Crítica de accesibilidad:** Exportar HTML de cada pantalla y pasar `accessibility-reviewer` (HC-01) para verificar contraste, orden de foco, navegación por teclado.
4. **Refinamiento:** Cuando se resuelvan US2-Q1, P-07.4, P-49.2, P-44, UXR-Q4 (supuestos), regenerar pantallas afectadas.
5. **Componentes:** Con las pantallas validadas y accesibles, ejecutar `web-atomic-component-designer` para mapear componentes (CMP).
6. **Publicar cambios:** Ejecutar `graphify update .` para actualizar el grafo, luego `git add graphify-out/` y crear commit con `Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>`.
