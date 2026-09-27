---
type: Business Term
title: "Código de colaborador"
description: "Código interno, único y obligatorio, que identifica a cada persona colaboradora. La plataforma lo genera automáticamente como un GUID. No se anonimiza, para que las certificaciones y la auditoría sigan mostrando quién actuó."
tags: [glossary, business-term, concepto, party]
status: draft
generated:
  by: "af-business-glossary-curator/1.1"
  at: "2026-09-27T17:10:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# Código de colaborador

- **ID:** TRM-0087
- **Tipo:** concepto
- **Sinónimos:** —
- **Definición:** Código interno, único y obligatorio, que identifica a cada persona colaboradora. La plataforma lo genera automáticamente como un GUID. No se anonimiza, para que las certificaciones y la auditoría sigan mostrando quién actuó.
- **Ámbito:** Plataforma de Gestión de Formación
- **Fuentes:**
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L63 — consultada 2026-09-27
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L70 — consultada 2026-09-27
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L106 — consultada 2026-09-27
  - [N2] BRC-001 — /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L236 — consultada 2026-09-27
  - [N2] BRC-001 — /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L244 — consultada 2026-09-27
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L79 — consultada 2026-09-27
  - [N2] BRC-001 — /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L294 — consultada 2026-09-27
- **Clasificación:** decision
- **Confianza:** high
- **Responsable:** Jefe de Ingeniería
- **Relacionados:** [Persona](TRM-0071-persona.md) · [Colaborador](TRM-0013-colaborador.md) · [Anonimización](TRM-0096-anonimizacion.md)
- **Notas:** Se genera automáticamente como GUID (SPEC-001 D25, respuesta a Q-01; BR-PTY-06; GQ-22 cerrada). Como ningún otro sistema comparte el GUID y nunca se reutiliza, el riesgo de cuasi-identificador baja. Riesgo registrado: el código conservado es un cuasi-identificador de las personas anonimizadas (SPEC-001:L116). Responsable según BRC-001 BR-PTY-17 (/knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L247).
