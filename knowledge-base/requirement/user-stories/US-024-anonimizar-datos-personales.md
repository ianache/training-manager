---
type: User Story
title: "US-024 — Anonimizar los datos personales de una persona dada de baja"
description: "A demanda, el Jefe de Ingeniería anonimiza de forma irreversible la PII de una persona dada de baja en todas sus vigencias, conservando el código de colaborador, las referencias de auditoría y el historial."
tags: [user-story, colaboradores, party, c10, anonimizacion, privacidad]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T12:25:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-024 — Anonimizar los datos personales de una persona dada de baja

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-024 |
| Épica / capacidad | SPEC-001 C10 — Anonimizar a demanda (SPEC-001:L148; D14, D15) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería (con Legal, Q-04 y Q-09 de SPEC-001) |
| Prioridad | Must: es la respuesta a la obligación sobre quien se va (Q-04, D14) |
| Estimación | |
| Dependencias | US-021 |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** anonimizar los datos personales de una persona que ya se fue, **para** dejar de conservar su PII sin perder el historial, las certificaciones ni los KPI.

## 3. Contexto y valor

- **Problema que resuelve:** los registros no se pueden borrar porque las certificaciones los necesitan (BR-ACR-03), pero la PII de quien se va no debe conservarse (D14).
- **Valor esperado:** PII eliminada de forma irreversible; KPI e historial siguen siendo calculables sin identificar a la persona (SPEC-001:L115).
- **Métrica o KPI que impacta:** Sin métrica asociada (preserva el cálculo de los KPI existentes).

## 4. Alcance

- **Incluye:**
  - Reemplazar por valores anónimos, en todas las vigencias e historial: nombres, apellidos, nombre preferido, identificaciones, medios de contacto (correo, teléfono, perfiles) e identidad de acceso.
  - Conservar identificador técnico, código de colaborador, roles, relaciones, asignaciones, certificaciones, fechas y referencias de auditoría (D16).
  - Registrar cuándo y quién anonimizó; marcar el aviso pendiente como atendido (inferencia, ver H-2).
- **Excluye:**
  - El aviso por plazo (US-025).
  - Quién ve el código de los anonimizados (Q-05).

## 5. Criterios de aceptación

### AC-1 — Anonimizar

```gherkin
Escenario: Anonimizar a una persona dada de baja
  Dado que soy el Jefe de Ingeniería y una persona no tiene roles de Empleado ni de Contratista vigentes
  Cuando confirmo su anonimización
  Entonces sus nombres, apellidos, nombre preferido, identificaciones, medios de contacto e identidad de acceso quedan reemplazados por valores anónimos en todas sus vigencias
  Y queda registrado cuándo y quién la anonimizó
```

- **Regla / fuente:** BR-PTY-14; SPEC-001:L115

### AC-2 — Se conserva lo no personal

```gherkin
Escenario: Conservar historial y auditoría
  Dado una persona anonimizada que tenía roles, asignaciones de Rol-Nivel y certificaciones
  Cuando se consultan
  Entonces siguen existiendo con sus fechas, y las certificaciones muestran el código de colaborador de quien certificó
```

- **Regla / fuente:** BR-PTY-14; D16; SPEC-001:L115

### AC-3 — Irreversible y no editable

```gherkin
Escenario: Intentar editar a una persona anonimizada
  Dado una persona anonimizada
  Cuando el Jefe de Ingeniería intenta editarla o restaurar sus datos
  Entonces no se permite
```

- **Regla / fuente:** BR-PTY-14; SPEC-001:L124

### AC-4 — Las unicidades ignoran a los anonimizados

```gherkin
Escenario: Reutilizar un correo tras la anonimización
  Dado una persona anonimizada que tuvo el correo laboral "ana@comsatel.com.pe"
  Cuando registro a otra persona con ese correo
  Entonces el registro se permite
```

- **Regla / fuente:** BR-PTY-14; SPEC-001:L127

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Anonimizar a un colaborador vigente | Según la inferencia de SPEC-001, no se permite; pendiente de confirmar | SPEC-001:L127; RCP2-Q1 |
| Anonimizar antes de que venza el plazo | Sin regla: la anonimización es a demanda y el plazo solo dispara el aviso (D15) | US-024-Q1 |
| Anonimizar dos veces | Sin regla; la persona ya no se puede editar | BR-PTY-14 |
| Usuario que no es Jefe de Ingeniería | No puede | BR-PTY-14, BR-PTY-17 |
| El código de colaborador conservado reidentifica a la persona | Riesgo; mitigación por restricción de visibilidad | SPEC-001:L116; Q-05 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-14 | Anonimización a demanda, irreversible; se conservan código y auditoría; unicidades ignoran anonimizados | BRC-001 |
| BR-PTY-12 | Única excepción al "nada se sobrescribe" | BRC-001; SPEC-001:L172 |
| BR-PTY-13 | La persona dada de baja no se borra | BRC-001 |
| BR-PTY-17 | Permiso | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Anonimización, PII, Código de colaborador | Operación y datos | Términos nuevos de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio); la confirmación de una acción irreversible debe ser clara y accesible.
- **Privacidad y datos personales:** no debe quedar PII en ninguna tabla ni vigencia (SPEC-001:L216).
- **Otros:** auditoría de quién y cuándo (SPEC-001:L115).

## 10. Consideraciones de UX

- **Flujo esperado:** ficha de la persona dada de baja (o desde el aviso) → anonimizar → confirmación explícita de irreversibilidad → resultado.
- **Estados de la interfaz:** disponible; no disponible (persona vigente); ya anonimizada; sin permisos; éxito.
- **Contenido clave:** qué se borra y qué se conserva; que es irreversible.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-021 (baja).
- **Es prerrequisito de:** —
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: solo se anonimiza a una persona dada de baja (SPEC-001:L127, inferencia de la propia spec). H-2: anonimizar a una persona con aviso pendiente lo marca como atendido (SPEC-001:L169 define "atendido" sin decir cuándo).

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| RCP2-Q1 | ¿Solo se anonimiza a una persona dada de baja? | Jefe de Ingeniería | Alta | Sí (precondición de AC-1) | Abierta |
| US-024-Q1 | ¿Se puede anonimizar antes de que venza el plazo? | Jefe de Ingeniería + Legal | Media | No | Abierta |
| US-024-Q2 | ¿Qué marca como "atendido" un aviso: anonimizar, o también decidir no anonimizar? | Jefe de Ingeniería | Media | No | Abierta |
| Q-05 | ¿Quién ve el código de colaborador de una persona anonimizada? (P-08) | Responsable de producto | Alta | No (mitigación de riesgo) | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0086 | Anonimizar PII, no borrar | SPEC-001:L68 (D14) | decision | high |
| EVD-2026-0087 | A demanda, con notificación al vencer el plazo | SPEC-001:L69 (D15) | decision | high |
| EVD-2026-0088 | Código y auditoría no se anonimizan | SPEC-001:L70 (D16) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | Solo requiere US-021 |
| Negociable | Sí | Momento y precondición abiertos |
| Valiosa | Sí | Cumple D14 sin perder historial |
| Estimable | Parcial | Alcance técnico amplio (todas las vigencias) |
| Pequeña (Small) | Sí | Una operación |
| Testeable | Sí | Verificable: ninguna PII en ninguna vigencia |

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
- [ ] Una prueba confirma que no queda PII en ninguna vigencia y que se conservan código y auditoría

## 17. Preparación y validación

- **Estado:** CONDITIONAL
- **Motivo:** la operación está sostenida por BR-PTY-14 y D14 a D16; la precondición "solo dados de baja" es una inferencia a confirmar (RCP2-Q1).
- **Bloqueos de entrega:** US-021.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería confirma RCP2-Q1 y valida la historia, con Legal si aplica.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
