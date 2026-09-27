---
type: ASR Candidate
title: "ASR candidato — Identidad y autorización por rol (BR-ACR-02)"
description: "Siete actores con permisos distintos sobre catálogo, requerimientos, certificaciones y perfiles, con una fuente de identidad todavía desconocida."
tags: [asr, seguridad, autorizacion, identidad, roles]
related: [ADR-002, ADR-001]
status: draft
generated:
  by: "asr-discovery/1.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
---

# ASR candidato — Identidad y autorización por rol

- **Requisito de origen:** BR-ACR-02 (solo un evaluador certifica), junto con BR-CAT-04 (solo el Jefe de Ingeniería gobierna el catálogo) y BR-REQ-02 (el Jefe de proyecto declara requerimientos) ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)).
- **Atributo de calidad:** seguridad (autenticación y autorización).
- **Tipo:** atributo de calidad transversal.

## Enunciado

La plataforma distingue siete actores con permisos diferentes. Cada acción restringida (gobernar el catálogo, declarar requerimientos, certificar) solo la puede hacer el rol autorizado, sobre el ámbito que le corresponde.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Un usuario autenticado sin el rol requerido |
| Estímulo | Intenta modificar el catálogo, certificar o declarar requerimientos de un proyecto ajeno |
| Entorno | Operación normal |
| Artefacto | Catálogo, certificaciones, requerimientos |
| Respuesta | La acción se rechaza |
| Medida de respuesta | **UNKNOWN** |

## Por qué puede ser significativo

- Los permisos dependen del rol **y** del ámbito: producto, proyecto propio, colaborador propio (EVD-2026-0045; VIS-001:L42 "su proyecto"). Eso condiciona el modelo de autorización (INFERENCE).
- La fuente de identidad y de datos de las personas no está definida: podría ser el sistema de RR. HH. (VIS-001:L153). Esa decisión afecta a la integración y al alta de usuarios (UNKNOWN).
- Algunas asignaciones de rol son inciertas: quién designa a los evaluadores (RCP-Q1) y el papel del Responsable de producto (P-06).

## Perspectivas afectadas

Seguridad · Integración (identidad, RR. HH.) · Datos · Operación

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0045 | Siete actores en alcance con valores y responsabilidades distintas | VIS-001:L37-L51 | FACT | Alta |
| EVD-2026-0005 | El Jefe de Ingeniería es dueño del catálogo | VIS-001:L51 | FACT | Alta |
| EVD-2026-0011 | Un evaluador certifica | VIS-001:L80 | FACT | Alta |
| EVD-2026-0047 | Integrar el sistema de RR. HH. como fuente de la ficha del colaborador está abierto | VIS-001:L153 | UNKNOWN | Alta |

Evidencia compartida: `source_type: document`, `freshness: current`, `status: sin verificar`.

## Evidencia faltante

- El proveedor de identidad corporativo y cómo se obtienen los roles.
- ~~Si los permisos de Jefe de proyecto se limitan a sus proyectos (US2-Q2).~~ Respondida el 2026-09-27: solo el Jefe de proyecto de ese proyecto declara sus requerimientos (BRC-001 BR-REQ-02); el permiso por ámbito de proyecto deja de ser inferencia para esta acción.
- La matriz de permisos completa (qué ve y qué hace cada actor), incluida la visibilidad de perfiles ajenos (P-08). *2026-09-27:* P-08 respondida (BR-TRA-03 a BR-TRA-06, BR-IA-04) y la asignación la hacen el Jefe de Ingeniería o un ADMIN (BR-REQ-04, P-05); el Instructor, asignado a una edición de curso, es un permiso nuevo con ámbito de edición (BR-FOR-05, P-49). Sigue abierto qué es ADMIN (P-45) y P-54. *Nota del agente; la disposición no cambia.*

## Preguntas para el arquitecto

1. ¿Existe un proveedor de identidad corporativo obligatorio?
2. ¿Los roles se administran en la plataforma o vienen de un sistema externo?

## Decisiones que lo atienden

- [ADR-002](/knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md), Aceptado, 2026-09-27, `human:ianache`: Keycloak es el proveedor de identidad, integrado en el BFF de Node.js mediante PKCE. Atiende **en parte** este candidato: responde la pregunta 1 (proveedor de identidad). Siguen abiertos el modelo de roles y permisos, la visibilidad de datos ajenos (P-08) y el origen de los usuarios (KG-03). El candidato sigue sin disposición.
- [SPEC-001](/knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md), decisiones D2 y D4 de `human:ianache`, 2026-09-27: responde **en parte** KG-03. Las personas se registran en la propia plataforma, sin integración con RR. HH. (BR-PTY-01), y se vinculan con su usuario de Keycloak solo por identificador (BR-PTY-16). No es un ADR y no cambia la disposición del candidato. Sigue abierto cómo se crean los usuarios en Keycloak.

## Disposición humana

- **Recomendación del agente (no es decisión):** INVESTIGATE. La necesidad está sostenida, pero falta la fuente de identidad para valorar su impacto.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
