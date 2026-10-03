---
type: User Story
title: "US-015 — Registrar un colaborador"
description: "El Jefe de Ingeniería da de alta a un empleado o contratista con su identificación, correo laboral, rol vigente, unidad, jefe directo (solo empleados), proveedor si aplica y su nivel inicial del rol que se le asigna (Rol-Nivel); la plataforma genera su código de colaborador como un GUID."
tags: [user-story, colaboradores, party, c1, alta]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T16:40:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-015 — Registrar un colaborador

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-015 |
| Épica / capacidad | SPEC-001 C1 — Registrar un colaborador (SPEC-001:L139) |
| Horizonte / release | Por definir (feature transversal, prerrequisito de H1) |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería (decisor de SPEC-001) |
| Prioridad | Must: sin colaboradores registrados no hay perfil, certificación ni búsqueda (SPEC-001:L151-L153) |
| Estimación | |
| Dependencias | US-017 y US-029 (organización interna y unidades), US-018 (proveedores), US-001 (Rol-Nivel del catálogo, para el nivel inicial) |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** registrar a un empleado o contratista con sus datos maestros, **para** que exista en la plataforma como colaborador y pueda tener perfil, Rol-Nivel y certificaciones.

## 3. Contexto y valor

- **Problema que resuelve:** no se sabía de dónde salían los colaboradores (VIS-001 §11.4); la plataforma pasa a ser el sistema de registro (D2, BR-PTY-01).
- **Valor esperado:** cada colaborador existe una sola vez, identificable y con su vínculo laboral vigente.
- **Métrica o KPI que impacta:** KPI 6 Adopción (perfiles activos), de forma indirecta (RCP-001 §2).

## 4. Alcance

- **Incluye:**
  - Crear la persona con nombres, apellidos, nombre preferido opcional, identificación, correo laboral y rol de Empleado o Contratista con fecha desde (SPEC-001:L112). El código de colaborador no se ingresa: la plataforma lo genera automáticamente como un GUID (D25, BR-PTY-06).
  - Registrar su pertenencia a una unidad; si es empleado, su jefe directo; si es contratista, su relación de contratación con un proveedor y ningún jefe directo (C1; D26, BR-PTY-19).
  - Asignarle un nivel inicial del rol que se le asigna (Rol-Nivel del catálogo), con fecha desde (BR-PRF-02, EVD-2026-0103). Se registra con las mismas reglas de US-019.
- **Excluye:**
  - Vincular el usuario de Keycloak (US-022); puede quedar vacío en el alta.
  - Cambiar de nivel o asignar otros Rol-Nivel después del alta (US-019), y roles del programa (US-020).
  - Evaluar la evolución de sus competencias (se hace después, por cursos o desempeño en proyectos, US-003; BR-PRF-02) y decidir el paso al siguiente nivel (P-42).
  - Crear unidades (US-017) y proveedores (US-018).

## 5. Criterios de aceptación

### AC-1 — Alta de un empleado

```gherkin
Escenario: Registrar un empleado
  Dado que soy el Jefe de Ingeniería y existe la organización interna COMSATEL con una unidad
  Cuando registro una persona con nombres, apellidos, una identificación, un correo laboral de COMSATEL, el rol de Empleado con fecha desde, su unidad y su jefe directo
  Entonces la persona queda registrada como colaborador con su rol de Empleado vigente
  Y la plataforma le asigna un código de colaborador generado automáticamente (GUID)
```

- **Regla / fuente:** BR-PTY-05, BR-PTY-06, BR-PTY-08; SPEC-001:L112; D25

### AC-2 — Alta de un contratista

```gherkin
Escenario: Registrar un contratista con su proveedor
  Dado que existe un proveedor registrado
  Cuando registro una persona con el rol de Contratista, una relación de contratación vigente con ese proveedor y el correo laboral del proveedor
  Entonces la persona queda registrada como colaborador contratista vinculado a su proveedor
  Y no se le registra jefe directo dentro de COMSATEL
```

- **Regla / fuente:** BR-PTY-08, BR-PTY-10, BR-PTY-19; D13, D26

### AC-3 — Alta sin vínculo de acceso

```gherkin
Escenario: Registrar sin identificador de Keycloak
  Dado una persona sin usuario de Keycloak conocido
  Cuando la registro
  Entonces el alta se completa con la identidad de acceso vacía
```

- **Regla / fuente:** SPEC-001:L112; BR-PTY-16

### AC-4 — Código de colaborador generado y único

```gherkin
Escenario: La plataforma genera el código
  Dado que existen colaboradores registrados, incluidas personas anonimizadas
  Cuando registro una persona nueva
  Entonces el formulario no me pide el código de colaborador
  Y la plataforma le asigna un GUID distinto del código de cualquier otra persona, incluidas las anonimizadas
```

- **Regla / fuente:** BR-PTY-06; D25. Los códigos de personas anonimizadas no se reutilizan (LDM-001 DM-Q-02, resuelta por D25)

### AC-5 — Identificación duplicada

```gherkin
Escenario: Rechazar una identificación repetida
  Dado que existe una persona con DNI 12345678 emitido en Perú
  Cuando registro otra persona con DNI 12345678 emitido en Perú
  Entonces el alta no se completa y se indica que la identificación ya existe
```

- **Regla / fuente:** BR-PTY-07

### AC-6 — Correo laboral repetido entre vigentes

```gherkin
Escenario: Rechazar un correo laboral en uso
  Dado un colaborador vigente con el correo laboral "ana@comsatel.com.pe"
  Cuando registro otra persona con ese correo laboral
  Entonces el alta no se completa y se indica que el correo ya está en uso
```

- **Regla / fuente:** BR-PTY-08

### AC-7 — Nivel inicial del rol

```gherkin
Escenario: Asignar el nivel inicial al registrar
  Dado que el catálogo tiene el rol Developer con los niveles Developer Junior (Nivel 1) a (Nivel 3)
  Cuando registro a una persona y le asigno el rol Developer con el nivel inicial Developer Junior (Nivel 1) desde una fecha
  Entonces la persona queda registrada como colaborador con Developer Junior (Nivel 1) vigente desde esa fecha
```

- **Regla / fuente:** BR-PRF-02, BR-PTY-11, BR-CAT-09; EVD-2026-0103

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Falta la identificación, el correo laboral o el rol | El alta no se completa | BR-PTY-08; SPEC-001:L112 |
| Tipo de identificación distinto de DNI, carné de extranjería o pasaporte | Se rechaza (el RUC es para organizaciones) | BR-PTY-07 |
| Contratista sin relación de contratación vigente con un proveedor | El alta no se completa | BR-PTY-10 |
| Contratista con correo que no es del proveedor | Sin regla operativa: D13 dice que es el del proveedor, pero no cómo se comprueba | US-015-Q1 |
| Mismo número de documento con otro país emisor | Se acepta: la unicidad es por tipo, número y país | BR-PTY-07 |
| Identificación o correo de una persona anonimizada | No bloquea el alta | BR-PTY-14 |
| Código de una persona anonimizada | No se reutiliza: la persona nueva recibe un GUID nuevo | BR-PTY-06; D25 |
| Se intenta ingresar o elegir el código a mano | No es posible: lo genera la plataforma | BR-PTY-06; D25 (Q-01) |
| Se intenta registrar un jefe directo para un contratista | El alta no lo admite: la relación de reporte es solo para empleados | BR-PTY-19; D26 (Q-02) |
| Un usuario que no es Jefe de Ingeniería intenta registrar | No puede | BR-PTY-17 |
| Nivel inicial que no existe en el catálogo o que el rol no define | Se rechaza | BR-CAT-09; SPEC-001:L91 |
| Alta sin nivel inicial de rol | Sin regla: BR-PRF-02 dice que se asigna al registrar, pero no si el alta se puede completar sin él | US-015-Q3 |
| Asignar como nivel inicial uno que no es el primero del rol (por ejemplo, un Developer Senior) | Sin regla: "según el rol" no dice cuál; se supone que lo elige el Jefe de Ingeniería | US-015-Q3 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-01 | La plataforma es el sistema de registro | BRC-001 §Colaboradores |
| BR-PTY-04 | Relaciones de empleo, contratación, pertenencia y reporte | BRC-001 |
| BR-PTY-05 | Colaborador = rol vigente de Empleado o Contratista | BRC-001 |
| BR-PTY-06 | Código único y obligatorio, generado automáticamente como GUID | BRC-001 |
| BR-PTY-07 | Identificaciones aceptadas y únicas | BRC-001 |
| BR-PTY-08 | Correo laboral según tipo, único entre vigentes | BRC-001 |
| BR-PTY-10 | Contratista con contratación vigente | BRC-001 |
| BR-PTY-12 | Todo cambio auditado | BRC-001 |
| BR-PTY-17 | Solo el Jefe de Ingeniería mantiene la información | BRC-001 |
| BR-PTY-19 | Un contratista no tiene jefe directo en COMSATEL | BRC-001 |
| BR-PRF-02 | Al registrar un colaborador se le asigna un nivel inicial del rol; la evolución se evalúa después | BRC-001 §Transparencia |
| BR-PTY-11 | Un nivel vigente por rol | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Colaborador | Resultado del alta (concepto derivado, D7) | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) (definición en actualización por SPEC-001) |
| COMSATEL | Organización interna del empleado | [TRM-0015](../../business/glossary/terms/TRM-0015-comsatel.md) |
| Código de colaborador, Empleado, Contratista, Proveedor, Unidad organizacional, Identificación | Datos del alta | Términos nuevos de SPEC-001 en curso (artefacto #3, af-business-glossary-curator) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** nombres, identificación y correo son PII; solo los campos de SPEC-001:L102-L109 (minimización, asr-BR-TRA-01).
- **Otros:** auditoría de quién registró y cuándo (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** elegir Empleado o Contratista → datos de la persona → identificación → correo laboral → unidad; jefe directo si es empleado; proveedor si es contratista → confirmar. El código lo genera la plataforma (D25); mostrarlo al terminar el alta es una propuesta (H-2).
- **Estados de la interfaz:** éxito; error por duplicado (identificación, correo); faltan datos obligatorios; sin permisos; sin proveedores o unidades registrados.
- **Contenido clave:** qué correo corresponde según el tipo (D13) y qué campos son obligatorios.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-017 (organización interna) y US-029 (unidades), US-018 (proveedores) y US-001 (Rol-Nivel del catálogo).
- **Es prerrequisito de:** US-016, US-019, US-020, US-021, US-022, US-023; y de US-003, US-004 y US-006.
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: el jefe directo de un empleado es otra persona registrada (relación de reporte persona ↔ jefe directo, BR-PTY-04; solo empleados, BR-PTY-19); confirma el Jefe de Ingeniería. H-2: mostrar el código generado al terminar el alta es una propuesta de UX del agente, no una decisión.

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| Q-01 | ¿Cómo se genera el código de colaborador? | Jefe de Ingeniería | Media | No | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D25): automáticamente, como un GUID. Reescribe AC-1 y AC-4 |
| Q-02 | ¿Un contratista tiene jefe directo dentro de COMSATEL? | Jefe de Ingeniería | Media | No | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D26): no (BR-PTY-19). Precisa AC-2 |
| US-015-Q1 | ¿Cómo se comprueba que el correo de un contratista es del proveedor (por ejemplo, por dominio)? | Jefe de Ingeniería | Baja | No | Abierta |
| US-015-Q2 | ¿Unidad y jefe directo son obligatorios en el alta? | Jefe de Ingeniería | Media | No | Abierta |
| P-28 | ¿Un colaborador tiene un nivel de rol? ¿Se certifica o se deduce? | Jefe de Ingeniería | Alta | No | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): se asigna un nivel inicial al registrarlo y después se evalúa su evolución (BR-PRF-02). Origina AC-7 |
| US-015-Q3 | ¿El nivel inicial de rol es obligatorio para completar el alta? ¿Puede ser cualquier nivel del rol o solo el primero? | Jefe de Ingeniería | Media | Sí (AC-7) | Nueva |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0076 | La plataforma es el sistema de registro | SPEC-001:L57 (D2) | decision | high |
| EVD-2026-0080 | Colaborador derivado | SPEC-001:L61 (D7) | decision | high |
| EVD-2026-0082 | Código único y obligatorio | SPEC-001:L63 (D9) | decision | high |
| EVD-2026-0083 | Identificaciones aceptadas | SPEC-001:L64 (D10) | decision | high |
| EVD-2026-0085 | Correo laboral del contratista es del proveedor | SPEC-001:L67 (D13) | decision | high |
| EVD-2026-0103 | Al registrar un colaborador se le asigna un nivel inicial según el rol; después se evalúa su evolución por cursos o desempeño en proyectos | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-28 | decision | high |
| EVD-2026-0119 | El código de colaborador se genera automáticamente como un GUID | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 Q-01 (D25) | decision | high |
| EVD-2026-0120 | Un contratista no tiene jefe directo dentro de COMSATEL | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 Q-02 (D26) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Parcial | Necesita unidades y proveedores (US-017, US-018) |
| Negociable | Sí | Obligatoriedad de unidad y jefe abierta |
| Valiosa | Sí | Origen de todos los colaboradores |
| Estimable | Sí | Q-01 y Q-02 respondidas (D25, D26); US-015-Q3 solo afecta a la obligatoriedad del nivel inicial |
| Pequeña (Small) | Sí | Un alta con validaciones |
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
- [ ] El alta queda auditada (quién y cuándo)

## 17. Preparación y validación

- **Estado:** CONDITIONAL
- **Motivo:** actor, valor y validaciones sostenidos por BR-PTY; el nivel inicial de rol, por BR-PRF-02 (P-28, respondida el 2026-09-27). Q-01 (código, D25) y Q-02 (jefe directo del contratista, D26) se respondieron el 2026-09-27 y ya no bloquean. Sigue CONDITIONAL porque US-015-Q3 (obligatoriedad del nivel inicial) bloquea AC-7 y falta la validación del PO.
- **Bloqueos de entrega:** US-017, US-029 y US-018 (redactadas, no implementadas).
- **Propuesta de división (si no es pequeña):** No aplica. Si crece, dividir por variación de regla: alta de empleado y alta de contratista.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería responde US-015-Q3 y valida la historia.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
