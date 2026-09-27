---
type: Business Term
title: "Aviso de anonimización"
description: "Aviso que la plataforma genera para una persona dada de baja al vencer el plazo de anonimización, y que envía por correo automático a todos los correos vigentes de las personas con rol vigente de Jefe de Ingeniería. Registra su fecha, sus destinatarios, si fue atendido y si el envío se hizo o falló."
tags: [glossary, business-term, concepto, party]
status: draft
generated:
  by: "af-business-glossary-curator/1.1"
  at: "2026-09-27T11:00:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# Aviso de anonimización

- **ID:** TRM-0098
- **Tipo:** concepto
- **Sinónimos:** —
- **Definición:** Aviso que la plataforma genera para una persona dada de baja al vencer el plazo de anonimización, y que envía por correo automático a todos los correos vigentes de las personas con rol vigente de Jefe de Ingeniería. Registra su fecha, sus destinatarios, si fue atendido y si el envío se hizo o falló.
- **Ámbito:** Plataforma de Gestión de Formación
- **Fuentes:**
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L72 — consultada 2026-09-27
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L74 — consultada 2026-09-27
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L125 — consultada 2026-09-27
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L169 — consultada 2026-09-27
  - [N2] BRC-001 — /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L245 — consultada 2026-09-27
- **Clasificación:** decision
- **Confianza:** high
- **Responsable:** Jefe de Ingeniería
- **Relacionados:** [Plazo de anonimización](TRM-0097-plazo-de-anonimizacion.md) · [Anonimización](TRM-0096-anonimizacion.md) · [Jefe de Ingeniería](TRM-0036-jefe-de-ingenieria.md) · [Correo laboral](TRM-0085-correo-laboral.md)
- **Notas:** Se envía desde la cuenta de Gmail empresarial de la empresa (SPEC-001 D19, L73). Si no hay ningún Jefe de Ingeniería con correo vigente, queda registrado como no enviado (SPEC-001:L125). Estados: pendiente o atendido; envío enviado, fallido o con reintentos (SPEC-001:L169). Responsable según BRC-001 BR-PTY-17 (/knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L247).
