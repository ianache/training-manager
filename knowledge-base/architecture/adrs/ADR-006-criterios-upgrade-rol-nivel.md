---
type: ADR
id: ADR-006
title: Criterios y actores para upgrade de Rol-Nivel de colaboradores
description: Decisión sobre el mecanismo (híbrido multi-fuente) y actores autorizados para decidir el ascenso de nivel de un colaborador en el catálogo de roles y competencias.
tags: [architecture, adr, competencias, rol-nivel, upgrade, evaluacion, instructor]
status: draft
adr_status: Aceptado
decision: { by: "human:ianache", at: "2026-09-27T23:45:00-05:00" }
related: [SPEC-001, BR-CAT-14, BR-PRF-02, US-019, P-28, P-42]
generated: { by: "architecture-adr-writer/claude-haiku-4-5", at: "2026-09-27T23:50:00-05:00" }
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
    title: SPEC-001 — Especificación de gestión de colaboradores
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    title: VIS-001 — Visión de la plataforma
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
    title: IMD-001 — Modelo de información conceptual
---

# ADR-006 — Criterios y Actores para Upgrade de Rol-Nivel

- **Estado:** Aceptado
- **Fecha:** 2026-09-27
- **Decisor:** ianache (Jefe de Ingeniería)
- **Redacción:** architecture-adr-writer/claude-haiku-4-5, a partir de decisiones del 2026-09-27. Pendiente verificación humana.
- **Cierra:** P-28 (¿Cómo se decide el upgrade de nivel?) y P-42 (¿Criterios de evaluación?)

## Contexto

SPEC-001 §6.1 establece que **una persona tiene asignado un Rol-Nivel del catálogo, con un solo nivel vigente por rol** (BR-PTY-11, D6). Cuando se registra un colaborador, se le asigna un nivel inicial (ej: Developer Junior Nivel 1, BR-PRF-02).

Sin embargo, SPEC-001 y VIS-001 no definen:
1. ¿Qué criterios permiten que un colaborador suba de nivel (Nivel 1 → Nivel 2)?
2. ¿Quién decide el upgrade?

Esta sesión cierra ambas preguntas con una decisión del Jefe de Ingeniería.

## Opciones consideradas

| Opción | Descripción | Pros | Contras |
|---|---|---|---|
| **A. Evaluación manual directa** | El Jefe de Ingeniería decide manualmente sin requisitos predefinidos; puede delegar en Instructor | Control humano total; flexible | Subjetivo; sin criterios claros; riesgo de inconsistencia |
| **B. Basado en cursos completados** | Cuando completa curso asociado al nivel, automáticamente sube | Claro y mensurable | Cursos no cubren todas competencias; puede haber gaps |
| **C. Basado en desempeño en proyecto** | Evaluador certifica competencias en proyecto; eso alimenta upgrade | Basado en trabajo real | Difícil medir; subjetivo; requiere evaluación |
| **D. Basado en IA + propuesta humana** | Agente analiza evidencias (GitLab, cursos, proyectos) y propone; Evaluador aprueba | Escalable; evidencia objetiva | Requiere modelo; hay que confiar en IA |
| **E. Combinado/Hybrid (elegida)** | Múltiples fuentes (cursos + desempeño + tiempo + IA propuesta) → Jefe de Ingeniería o Instructor decide | Robusto; menos fricción; flexible | Mayor complejidad; requiere coordinación |

## Decisión

### Mecanismo de upgrade: Hybrid (Opción E)

**El upgrade de Rol-Nivel se decide considerando múltiples fuentes de evidencia. El Jefe de Ingeniería e Instructor designado del curso pueden decidir directamente sin esperar propuesta automática.**

**Fuentes de evidencia que alimentan la decisión:**

```
Upgrade de Rol-Nivel (N → N+1) se basa en:

1. CURSO COMPLETADO (necesario, no suficiente)
   - Colaborador completó curso asociado al nivel superior
   - Cumplió objetivos de aprendizaje (calificación ≥ 70%)
   - Certificado generado
   → Propone upgrade

2. DESEMPEÑO EN PROYECTO (evidencia complementaria)
   - Colaborador demostró competencias del nivel superior
   - En 1 o más proyectos donde trabajó
   - Jefe de Proyecto valida logros
   → Refuerza upgrade

3. TIEMPO TRANSCURRIDO (indicador de madurez, opcional)
   - Mínimo 3-6 meses en nivel anterior
   - Sin "saltos" entre niveles sin justificación
   → Moderador (no bloqueador)

4. PROPUESTA DE IA (asistida, opcional)
   - Agente analiza evidencias de GitLab (commits, MRs, reviews)
   - Agente analiza certificaciones de cursos
   - Propone upgrade con justificación
   → Recomendación (Jefe de Ingeniería valida)

DECISIÓN FINAL:
  Jefe de Ingeniería o Instructor designado del curso
  (con base en evidencia arriba, pueden decidir directamente)
```

### Actores autorizados para decidir

| Actor | Autoridad | Contexto |
|---|---|---|
| **Jefe de Ingeniería** | Aprueba upgrade de cualquier Rol-Nivel, en cualquier momento | Decisión final; responsable del catálogo |
| **Instructor designado del curso** | Propone upgrade cuando colaborador completa curso; puede decidir directamente si evidencia es clara | Tiene visibilidad de desempeño del colaborador en el curso; coordinado con Jefe de Ingeniería |
| **Evaluador** | Propone upgrade basado en desempeño en proyecto; debe validar Jefe de Ingeniería | Revisa evidencias de trabajo real; no tiene autoridad final |
| **Agente IA (futuro)** | Propone upgrade basado en análisis de GitLab + cursos; requiere aprobación humana | VIS-001 §7: "propone" pero "nada se certifica sin firma humana" |

**Nota:** El Evaluador y Jefe de Ingeniería son solo gestores del programa, fuera del proceso de evaluación (BR-PRG-01, BR-PRG-02). El upgrade de Rol-Nivel es una decisión de gestión, no de evaluación.

### Flujos de decisión

**Flujo 1: Upgrade tras completar curso**
```
1. Colaborador completa curso (Classroom)
   ↓
2. Instructor revisa desempeño en curso
   ├─ Si calificación ≥ 70%:
   │  ├─ Genera certificado (via docsuite)
   │  ├─ Propone upgrade de Rol-Nivel
   │  └─ Jefe de Ingeniería o Instructor decide directamente
   │     (si evidencia es clara) o consulta con Jefe de Ingeniería
   │
   └─ Si calificación < 70%:
      └─ No propone upgrade; colaborador repite curso o busca otra ruta
```

**Flujo 2: Upgrade tras desempeño en proyecto**
```
1. Colaborador trabaja en proyecto (GitLab)
   ↓
2. Jefe de Proyecto + Evaluador validan desempeño
   ├─ Evaluador certifica competencias del nivel superior
   └─ Propone upgrade de Rol-Nivel
      ↓
3. Jefe de Ingeniería valida y decide
   (propuesta de Evaluador + evidencia de proyecto)
```

**Flujo 3: Upgrade asistido por IA (futuro)**
```
1. Agente analiza:
   - Certificados de cursos (GoogleClassroom + docsuite)
   - Actividad en GitLab (commits, MRs, reviews)
   - Desempeño en proyectos (si registrado)
   ↓
2. Agente propone upgrade con justificación
   ↓
3. Jefe de Ingeniería o Instructor valida y decide
```

### Criterios de upgrade explícitos

| Criterio | Descripción | Tipo | Obligatorio |
|---|---|---|---|
| **Completar curso de nivel N+1** | Calificación ≥ 70% en curso de Classroom asociado al nivel | Hecho | Sí (entrada más común) |
| **Certificado generado** | Curso completado + certificado PDF en docsuite | Hecho | Sí (comprobante) |
| **Desempeño en proyecto** | Jefe de Proyecto valida logros del nivel N+1 en trabajo real | Evidencia | No (complementario) |
| **Tiempo en nivel anterior** | Mínimo 3-6 meses en nivel N antes de pasar a N+1 | Heurística | No (recomendado) |
| **Sin saltos sin justificación** | Upgrade secuencial (L1→L2→L3→L4), excepto si hay justificación | Regla | Sí |
| **Propuesta de IA (futuro)** | Agente analiza evidencias y propone; Jefe valida | Asistencia | No (cuando disponible) |

### Autoridad directa sin supervisión adicional

```
✅ Jefe de Ingeniería:
   - Decide directamente cualquier upgrade
   - Sin necesidad de aprobación adicional
   - Responsable del catálogo

✅ Instructor designado (cuando aplica):
   - Decide directamente upgrade tras completar curso
   - Si:
     • Calificación ≥ 70% (hecho objetivo)
     • Certificado generado (comprobante)
     • Coordinado con Jefe de Ingeniería (comunicado)
   - Sin esperar propuesta de IA o Evaluador
```

## Metas de calidad

| Métrica | Target | Cómo se verifica |
|---|---|---|
| **Consistencia de criterios** | 100% de upgrades siguen los criterios documentados | Auditoría de decisiones de upgrade |
| **Tiempo promedio de upgrade (tras curso)** | < 1 semana desde certificado hasta decision | Seguimiento de tiempos en plataforma |
| **Trazabilidad de decisión** | Cada upgrade registra: quién decidió, evidencia, fecha | Auditoría en base de datos |
| **Reducción de fricción** | Instructor puede decidir directamente (no espera a Jefe) | Observar que >50% de upgrades vienen de Instructor |
| **Escalabilidad futura** | IA propone sin fricción; >80% de propuestas validadas | Cuando IA esté disponible |

## Consecuencias

**Positivas:**
- Criterios claros y objetivos (curso completado = base)
- Flexibilidad: múltiples rutas de upgrade (curso, proyecto, IA)
- Escalable: Instructor puede decidir sin cuello de botella en Jefe
- Auditable: cada upgrade queda registrado con justificación
- Futuro: IA propone sin retrasos; Jefe valida

**Negativas y riesgos:**
- **Subjetividad en desempeño de proyecto:** "validar logros" es interpretable; requiere guía clara para Jefe de Proyecto
- **Falta de estándares por producto:** cada producto puede tener criterios diferentes (Developer L1 en CLocator ≠ Developer L1 en SIGO); requiere coordinación
- **Tiempo variable:** algunos colaboradores suben rápido (cursos rápidos), otros lento (proyectos largos); inconsistencia percibida
- **Delegación a Instructor:** si Instructor no está capacitado, puede haber decisiones inconsistentes; requiere training

## No se decidió todavía

- ¿Qué duración mínima debe tener un curso para contar como "completado para upgrade"? (ej: ≥ 20 horas)
- ¿Puede un colaborador "saltarse" un nivel si demuestra competencia superior? (ej: L1 → L3)
- ¿Downgrade de nivel si desempeño baja? (ej: L3 → L2 si fallan en proyecto)
- ¿Quién define los estándares de "desempeño en proyecto" para cada rol/nivel?

---

## Cambios a documentos relacionados

**BRC-001:** Agregar regla BR-PRF-03 (upgrade de Rol-Nivel) con los criterios de esta decisión

**SPEC-001:** Agregar capacidad C5.1 (Proponer upgrade de Rol-Nivel basado en curso completado)

**US-019:** Refinar para incluir el flujo de "Instructor propone upgrade"

**RCP-003:** Actualizar "Próximos pasos" para developer (User Story Refiner) con estos criterios

---

**Status:** Aceptado (2026-09-27)
**Decisor:** ianache (Jefe de Ingeniería)
**Handoff:** 
- Jefe de Ingeniería (valida decisiones, define estándares por producto)
- Instructores (capacitados en criterios, autorizados a decidir)
- Desarrolladores (implementan flujo de propuesta → aprobación en plataforma)
- Evaluadores (proponen upgrade basado en proyecto)
- Agente IA (futuro: propone basado en evidencias)

---

## Enmienda 2026-10-03: rol ADMIN

Decisión de `human:ianache` (respuesta a DM-Q-04 de LDM-002, EVD-2026-0151 y 0155, BR-CAT-26): el rol **ADMIN** decide el cambio de nivel de un colaborador de forma directa. Es una decisión nueva, no una corrección de la del 2026-09-27: los actores y el mecanismo híbrido de esta decisión siguen vigentes y ADMIN se suma a ellos. El cuerpo original no se reescribe; esta enmienda prevalece en lo que toca a ADMIN. Pendiente de reflejar en US-019 y en el contrato de asignación de niveles.
