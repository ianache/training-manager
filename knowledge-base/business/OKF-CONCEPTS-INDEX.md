---
type: Index
title: "OKF Concepts Index — Business Context Pack BCP-001"
description: "Navegación de conceptos OKF (Business Objective, Stakeholder, Capability, Constraint, Risk, Assumption, Open Question) que sustentan el BCP-001."
status: draft
generated:
  at: "2026-09-29T10:45:00-05:00"
---

# OKF Concepts Index — Business Context Pack BCP-001

## 📊 Business Objectives (BO-*)

Resultados medibles que la iniciativa busca lograr.

| ID | Título | Descripción | Horizonte | KPIs |
|----|--------|-------------|-----------|------|
| [BO-001](objectives/BO-001-catalog-governance.md) | Governance del Catálogo | Catálogo único de roles y competencias, gobernado por Jefe de Ingeniería | H1–H3 | KPI 1, 6 |
| [BO-002](objectives/BO-002-demand-supply-matching.md) | Matching Demanda-Oferta | Asignación rápida y medible de personal vs. requerimientos | H1–H3 | KPI 2, 3, 6 |
| [BO-003](objectives/BO-003-transparent-certification.md) | Certificación Transparente | Niveles certificados con evidencia trazable y aprobación humana | H1–H3 | KPI 1, 3, 5 |

---

## 👥 Stakeholders (STK-*)

Actores con intereses y responsabilidades en la plataforma.

| ID | Rol | Responsabilidad Principal | Horizonte | Permisos Clave |
|----|-----|--------------------------|-----------|----------------|
| [STK-001](stakeholders/STK-001-chief-engineering.md) | Jefe de Ingeniería | Dueño del catálogo; gobernanza y aprobaciones | H1–H3 | Lectura/Escritura: Catálogo, Certificaciones, Datos maestros |
| [STK-002](stakeholders/STK-002-project-manager.md) | Jefe de Proyecto (PM) | Declara requerimientos; busca candidatos | H1–H3 | Lectura/Escritura: Requerimientos de su proyecto; Lectura: Candidatos |
| [STK-003](stakeholders/STK-003-collaborator.md) | Colaborador | Participa en formación; ve su perfil y propuestas | H1–H3 | Lectura: Su perfil, catálogo; Escritura: Medios de contacto |

**Notas:**
- STK-004 (Responsable de Producto), STK-005 (Evaluador), STK-006 (Gestor de Formación), STK-007 (Dirección), STK-008 (ADMIN) — por generar.

---

## 🛑 Constraints (BCON-*)

Restricciones de negocio que deben cumplirse.

| ID | Restricción | Por Qué | Horizonte |
|----|-------------|--------|-----------|
| [BCON-001](constraints/BCON-001-human-approval.md) | Aprobación Humana Obligatoria | Confian

za, responsabilidad, evitar sesgo de IA | H1–H3 |
| BCON-002 | Catálogo Único y Común | Evitar silos; asignación objetiva | H1–H3 |
| BCON-003 | Trazabilidad Completa | Auditoría; compliance; confianza | H1–H3 |
| BCON-004 | Integración, No Hospedaje | Reutilizar herramientas existentes (Classroom, Drive, GitLab) | H1–H3 |
| BCON-005 | Plataforma = Sistema de Registro | No integración con RR.HH.; altas/bajas en la plataforma | H1–H3 |

---

## ⚠️ Risks (BRISK-*)

Riesgos identificados con probabilidad e impacto.

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|----|--------|-------------|--------|-----------|
| [BRISK-001](risks/BRISK-001-catalog-drift.md) | Catálogo Desactualizado o Falta de Consenso | Media | Alto | Governance clara del Jefe de Ingeniería; versionado (P-02); comunicación con responsables. |
| BRISK-002 | GitLab Percibido como Vigilancia | Media | Medio | Transparencia al colaborador; uso interno; comunicación. |
| BRISK-003 | Fallo de Integración Classroom | Baja | Alto | Contingencia: gestión propia de material (post-H2). |
| BRISK-004 | Sesgo de IA | Baja | Medio | Firma humana obligatoria; justificación trazable. |
| BRISK-005 | Datos Pobres en GitLab | Media | Medio | Convenciones mínimas de etiquetado por producto. |

---

## 🤔 Assumptions (BAS-*)

Supuestos explícitos que deben validarse.

| ID | Supuesto | Validación | Confianza | Horizonte |
|----|----------|-----------|----------|-----------|
| [BAS-001](assumptions/BAS-001-no-common-catalog.md) | Hoy No Existe Catálogo Común | Sesión con Jefe de Ingeniería; falta evidencia documental | Media | Crítico (H1) |
| BAS-002 | Niveles L1–L4 se Restan como Números | Derivado de modelo; por confirmar en ejecución | Media | H1 |
| BAS-003 | Responsable de Producto Aporta Conocimiento sin Gobernar | Sesión; papel exacto por confirmar | Media | H1 |

---

## ❓ Open Questions (BOQ-*)

Preguntas abiertas que bloquean o informan la ejecución.

### Bloqueantes (deben resolverse antes de H1)

| ID | Pregunta | Propietario | Impacto | Estado |
|----|----------|-------------|--------|--------|
| [BOQ-001](open-questions/BOQ-001-catalog-versioning.md) | ¿Cómo se versiona el catálogo? | Jefe de Ingeniería | Governance, auditoría | Abierta (P-02) |
| [BOQ-002](open-questions/BOQ-002-evaluators.md) | ¿Quiénes son los evaluadores exactamente? | Jefe de Ingeniería | Escalabilidad, permisos | Abierta (RCP-Q1) |

### No Bloqueantes (enriquecen pero no frenan)

| ID | Pregunta | Propietario | Impacto | Estado |
|----|----------|-------------|--------|--------|
| — | ¿Papel exacto del Responsable de Producto? | Jefe de Ingeniería | Governance | Abierta (P-06) |
| — | ¿Convenciones de etiquetado en GitLab? | Jefe de Ingeniería (H3) | Calidad de datos IA | Abierta (P-45) |

---

## 📊 Capabilities (BC-*)

Capacidades de negocio que la plataforma debe ofrecer.

Consultar: [BCP-001 § 5. Capacidades de Negocio](BCP-001-business-context-pack.md#5-capacidades-de-negocio)

| # | Capacidad | Horizonte |
|---|-----------|-----------|
| 1 | Catálogo de competencias | H1 |
| 2 | Perfil de competencias | H1 |
| 3 | Requerimientos de proyecto | H1 |
| 4 | Brechas y búsqueda de personal | H1 |
| 5 | Rutas de formación | H2 |
| 6 | Certificación | H1–H3 |
| 7 | Evidencia de GitLab asistida por IA | H3 |
| 8 | Certificados de curso | H2 |
| 9 | Tablero de capacidad | H3 |

---

## 🔗 Lineage & Cross-References

```
BCP-001 (Business Context Pack)
├── BO-001, BO-002, BO-003 (Objetivos)
├── STK-001, STK-002, STK-003 (Stakeholders)
├── BCON-001 (Constraints)
├── BRISK-001 (Risks)
├── BAS-001 (Assumptions)
├── BOQ-001, BOQ-002 (Open Questions)
└── Referencias cruzadas a:
    ├── VIS-001 (Product Vision)
    ├── RCP-001, RCP-002 (Requirements Context Packs)
    ├── BRC-001 (Business Rules)
    ├── SPEC-001 (Specification: Collaborators)
    └── GLS-001 (Glossary)
```

**Flujo downstream:**
- BCP-001 → AF-101 (Requirements Analysis) → RCP-001/002 (detalladas)
- BCP-001 → UX-101 (UX Discovery) → Flujos, personas, wireframes
- BCP-001 → ARQ-101 (Architecture) → ACP-001 actualizado

---

## 📋 Definition of Done para OKF Concepts

✅ Cada concepto tiene:
- Título y descripción claros
- Propósito o restricción articulado
- Fuentes trazables (VIS-001, RCP-001, BRC-001, SPEC-001, GLS-001)
- Status `draft` (sin "verified" fabricado)
- `generated.by` y timestamp
- Enlaces cruzados a conceptos relacionados

✅ Bloqueantes (P-02, RCP-Q1) identificadas explícitamente.

✅ Horizontes (H1, H2, H3) mapeados a cada concepto.

---

## 🚀 Próximos Pasos

1. **Validación humana** de este índice por Jefe de Ingeniería.
2. **Generar conceptos faltantes:**
   - STK-004 a STK-008 (Responsable de Producto, Evaluador, Gestor de Formación, Dirección, ADMIN)
   - BCON-002 a BCON-005 (Constraints adicionales)
   - BRISK-002 a BRISK-005 (Risks adicionales)
   - BAS-002 a BAS-003 (Assumptions adicionales)
   - BC-001 a BC-009 (Business Capabilities)
3. **Derivar Requirements Analysis** (AF-101) a partir de BCP-001.

---

**Documento Generado:** 2026-09-29  
**Estado:** Draft  
**Responsable:** Business Context Builder  
**Validación Pendiente:** Jefe de Ingeniería
