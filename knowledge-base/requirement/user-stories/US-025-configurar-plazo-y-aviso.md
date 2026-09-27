---
type: User Story
title: "US-025 — Configurar el plazo de anonimización y recibir el aviso"
description: "El Jefe de Ingeniería configura el plazo, contado desde la baja, tras el cual la plataforma le envía un correo automático avisando que una persona puede anonimizarse."
tags: [user-story, colaboradores, party, c11, anonimizacion, notificacion]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T12:30:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-025 — Configurar el plazo de anonimización y recibir el aviso

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-025 |
| Épica / capacidad | SPEC-001 C11 — Configurar el plazo y aviso automático (SPEC-001:L149; D15, D17 a D23) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) (configura y recibe); la plataforma envía |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Should: la anonimización (US-024) funciona a demanda sin el aviso; el aviso evita olvidarla |
| Estimación | |
| Dependencias | US-020 (Jefe de Ingeniería vigente), US-021 (baja) |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** configurar cuánto tiempo después de una baja se me avisa, y recibir ese aviso por correo, **para** decidir a tiempo si anonimizo a la persona.

## 3. Contexto y valor

- **Problema que resuelve:** la anonimización es a demanda (D15); sin aviso dependería de la memoria del Jefe de Ingeniería.
- **Valor esperado:** cada baja genera, al vencer el plazo, un aviso por correo con registro de su estado.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Configurar el plazo (guardado en la base de datos, con auditoría, D23).
  - Al vencer el plazo desde el registro de la baja, generar el aviso y enviar un correo automático a todos los correos vigentes de las personas con rol vigente de Jefe de Ingeniería (D18, D20).
  - Registrar el estado del aviso (pendiente, atendido) y del envío (enviado, fallido con reintentos, no enviado) (SPEC-001:L117, L125, L169).
- **Excluye:**
  - La anonimización (US-024).
  - El método de autenticación ante Gmail (Q-14) y la custodia de credenciales en Vault ([ADR-004](../../architecture/adrs/ADR-004-secretos-y-parametria-en-hashicorp-vault.md), previsto).

## 5. Criterios de aceptación

### AC-1 — Configurar el plazo

```gherkin
Escenario: Cambiar el plazo
  Dado que soy el Jefe de Ingeniería
  Cuando configuro el plazo de anonimización en un número de días
  Entonces el plazo queda guardado y el cambio queda auditado con quién y cuándo
```

- **Regla / fuente:** BR-PTY-15; D23; SPEC-001:L168

### AC-2 — Aviso al vencer el plazo

```gherkin
Escenario: Enviar el aviso
  Dado una persona dada de baja y un Jefe de Ingeniería vigente con un correo vigente
  Cuando se cumple el plazo configurado desde el registro de la baja
  Entonces la plataforma genera un aviso pendiente para esa persona
  Y envía un correo automático al Jefe de Ingeniería desde la cuenta de Gmail empresarial
  Y el envío queda como enviado
```

- **Regla / fuente:** BR-PTY-15; D17, D18, D19

### AC-3 — Varios Jefes de Ingeniería o varios correos

```gherkin
Escenario: Enviar a todos
  Dado dos personas con rol vigente de Jefe de Ingeniería, una de ellas con dos correos vigentes
  Cuando vence el plazo de una baja
  Entonces el correo se envía a los tres correos
```

- **Regla / fuente:** BR-PTY-15; D20; SPEC-001:L125

### AC-4 — Sin destinatario

```gherkin
Escenario: No hay Jefe de Ingeniería con correo vigente
  Dado que ninguna persona con rol vigente de Jefe de Ingeniería tiene un correo vigente
  Cuando vence el plazo de una baja
  Entonces el aviso queda registrado como no enviado
```

- **Regla / fuente:** SPEC-001:L125

### AC-5 — Falla del envío

```gherkin
Escenario: La cuenta de correo falla
  Dado un aviso cuyo correo no se pudo enviar por una falla de la cuenta
  Cuando se registra el resultado
  Entonces el envío queda como fallido y se reintenta
```

- **Regla / fuente:** SPEC-001:L117, L169

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Plazo cero, negativo o sin valor | Sin regla | RCP2-Q3 |
| Cambio del plazo con bajas en curso | Sin regla: no se dice si se recalculan los avisos pendientes | US-025-Q1 |
| Persona ya anonimizada al vencer el plazo | Sin regla | US-025-Q2 |
| Límite de envío de la cuenta alcanzado | Riesgo conocido; se trata como falla con reintentos | SPEC-001:L117 |
| Número de reintentos y cuándo se deja de reintentar | Sin regla | US-025-Q3 |
| Usuario que no es Jefe de Ingeniería configura el plazo | No puede | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-15 | Plazo desde la baja, en BD; correo automático a todos los Jefes de Ingeniería vigentes desde Gmail empresarial; credenciales en Vault | BRC-001 |
| BR-PTY-18 | Se espera un único Jefe de Ingeniería vigente | BRC-001 |
| BR-PTY-17 | Permiso | BRC-001 |
| BR-PTY-12 | Auditoría | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Plazo de anonimización, Aviso de anonimización | Configuración y registro | Términos nuevos de SPEC-001 en curso (artefacto #3) |
| Jefe de Ingeniería | Destinatario | [TRM-0036](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio), en la configuración y en el contenido del correo.
- **Privacidad y datos personales:** el correo identifica a la persona dada de baja; enviar solo lo necesario (minimización, asr-BR-TRA-01). Qué datos lleva el correo no está definido (US-025-Q4).
- **Otros:** credenciales de Gmail en HashiCorp Vault (D22); reintentos ante falla (SPEC-001:L117).

## 10. Consideraciones de UX

- **Flujo esperado:** configuración → plazo en días → guardar; correo recibido → enlace o indicación para revisar a la persona (inferencia) → US-024.
- **Estados de la interfaz:** plazo guardado; valor inválido; sin permisos; lista de avisos con su estado (pendiente, atendido; enviado, fallido, no enviado).
- **Contenido clave:** plazo vigente; avisos pendientes y su estado de envío.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-020 (Jefe de Ingeniería vigente), US-021 (registro de la baja), US-016 (correos vigentes); la cuenta de Gmail empresarial (D19) y Vault (D22).
- **Es prerrequisito de:** —
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: el aviso se genera una sola vez por baja (RCP-002 H-03). H-2: el plazo se expresa en días (SPEC-001:L168 lo da como ejemplo).

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| RCP2-Q3 | ¿Qué valor por defecto y qué rango tiene el plazo? | Jefe de Ingeniería | Media | Sí (AC-1 completo) | Abierta |
| Q-14 | ¿Cómo se autentica la plataforma ante Gmail empresarial? | Arquitecto responsable | Media | No (técnica) | Parcialmente respondida (D22) |
| US-025-Q1 | ¿Cambiar el plazo afecta a las bajas que ya están corriendo? | Jefe de Ingeniería | Media | Sí | Abierta |
| US-025-Q2 | ¿Se genera el aviso si la persona ya fue anonimizada? | Jefe de Ingeniería | Baja | No | Abierta |
| US-025-Q3 | ¿Cuántos reintentos y con qué frecuencia? | Arquitecto responsable | Baja | No | Abierta |
| US-025-Q4 | ¿Qué datos de la persona lleva el correo? | Jefe de Ingeniería | Media | No | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0087 | Notificación al vencer un plazo configurable | SPEC-001:L69 (D15) | decision | high |
| EVD-2026-0089 | El plazo cuenta desde el registro de la baja | SPEC-001:L71 (D17) | decision | high |
| EVD-2026-0090 | Correo automático al Jefe de Ingeniería vigente | SPEC-001:L72 (D18) | decision | high |
| EVD-2026-0091 | Envío desde Gmail empresarial | SPEC-001:L73 (D19) | decision | high |
| EVD-2026-0092 | Si hay más de un Jefe de Ingeniería, a todos | SPEC-001:L74 (D20) | decision | high |
| EVD-2026-0094 | Credenciales en HashiCorp Vault | SPEC-001:L76 (D22) | decision | high |
| EVD-2026-0095 | Plazo en la base de datos, auditado | SPEC-001:L77 (D23) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Parcial | Necesita bajas y Jefe de Ingeniería vigente |
| Negociable | Sí | Plazo por defecto, reintentos y contenido abiertos |
| Valiosa | Sí | Evita olvidar anonimizaciones |
| Estimable | Parcial | Q-14 y US-025-Q1 cambian el alcance |
| Pequeña (Small) | Parcial | Mezcla configuración y envío automático; ver división |
| Testeable | Sí | Estados de aviso y envío verificables |

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
- [ ] Una prueba confirma que se genera el aviso al vencer el plazo (SPEC-001:L216)

## 17. Preparación y validación

- **Estado:** CONDITIONAL
- **Motivo:** configuración, destinatarios y estados del envío están sostenidos por BR-PTY-15 y D15 a D23; RCP2-Q3 y US-025-Q1 bloquean parte de la configuración.
- **Bloqueos de entrega:** US-020 y US-021; ADR-004 (previsto) para la custodia de credenciales.
- **Propuesta de división (si no es pequeña):** por paso de flujo: US-025a (configurar el plazo, AC-1) y US-025b (aviso automático por correo, AC-2 a AC-5). Se mantiene unida porque SPEC-001 la define como una sola capacidad (C11).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería responde RCP2-Q3 y US-025-Q1 y decide la división; el arquitecto responde Q-14.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
