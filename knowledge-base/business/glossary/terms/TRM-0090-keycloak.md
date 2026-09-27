---
type: Business Term
title: "Keycloak"
description: "Sistema de gestión de identidad y acceso donde viven los usuarios de la plataforma; se gestiona aparte y la plataforma solo guarda el identificador del usuario de cada persona."
tags: [glossary, business-term, término, party]
status: draft
generated:
  by: "af-business-glossary-curator/1.1"
  at: "2026-09-27T11:00:00-05:00"
sources:
  - id: keycloak-org
    resource: https://www.keycloak.org/
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
---

# Keycloak

- **ID:** TRM-0090
- **Tipo:** término
- **Sinónimos:** —
- **Definición:** Sistema de gestión de identidad y acceso donde viven los usuarios de la plataforma; se gestiona aparte y la plataforma solo guarda el identificador del usuario de cada persona.
- **Definición de referencia:** Solución de código abierto de gestión de identidad y acceso ("Identity and Access Management") para añadir autenticación a aplicaciones y proteger servicios.
- **Ámbito:** general
- **Fuentes:**
  - [N1] Keycloak, sitio oficial — https://www.keycloak.org/ — consultada 2026-09-27
  - [N2] SPEC-001 — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L58 — consultada 2026-09-27
  - [N2] BRC-001 — /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L246 — consultada 2026-09-27
  - [N2] ADR-002 — /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md:L56 — consultada 2026-09-27
- **Clasificación:** fact
- **Confianza:** high
- **Responsable:** Por definir
- **Relacionados:** [Identidad de acceso](TRM-0089-identidad-de-acceso.md)
- **Notas:** Ninguna fuente asigna un responsable del término (GQ-24). ADR-002 lo usa como proveedor de identidad del BFF (L56).
