---
type: ADR
id: ADR-001
title: La plataforma se estructura con un shell y microUIs en Angular, y un BFF en Node.js que intermedia con los microservicios
description: El frontend se compone de un shell y microUIs en Angular, y todo acceso a los microservicios pasa por un BFF en Node.js.
tags: [architecture, adr, frontend, microui, micro-frontends, angular, bff, nodejs, microservicios]
status: draft
adr_status: Aceptado
decision: { by: human:ianache, at: 2026-09-27T00:29:16-05:00 }
related: [ADR-002, ADR-009, ADR-010, ACP-001, ADB-001, AIM-001, asr-BR-INT-02, asr-BR-ACR-04]
generated: { by: architecture-adr-writer/claude-opus-5-5, at: 2026-09-27T00:29:16-05:00 }
sources:
  - id: acp-001
    resource: /knowledge-base/architecture/ACP-001-architecture-context-pack.md
    title: ACP-001 — Architecture Context Pack de la Plataforma de Gestión de Formación
  - id: adb-001
    resource: /knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md
    title: ADB-001 — Descubrimiento de arquitectura
  - id: asr-catalog
    resource: /knowledge-base/architecture/asr/asr-catalog.md
    title: Catálogo de candidatos ASR
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    title: VIS-001 — Plataforma de Gestión de Formación del Recurso Humano
  - id: asr-br-int-02
    resource: /knowledge-base/architecture/asr/asr-BR-INT-02.md
    title: ASR candidato — Contingencia ante fallas de integración con Google Classroom
  - id: asr-br-acr-04
    resource: /knowledge-base/architecture/asr/asr-BR-ACR-04.md
    title: ASR candidato — Ninguna certificación sin firma humana
  - id: asr-br-tra-01
    resource: /knowledge-base/architecture/asr/asr-BR-TRA-01.md
    title: ASR candidato — Privacidad y visibilidad de datos de desempeño
---

# ADR-001 — Estructura de la plataforma: shell y microUIs en Angular, BFF en Node.js intermediario con los microservicios

- **Estado:** Aceptado
- **Fecha:** 2026-09-27
- **Decisor:** ianache (`human:ianache`)
- **Redacción:** architecture-adr-writer/claude-opus-5-5, a partir de la decisión del decisor en la sesión del 2026-09-27. Falta que un humano revise el texto: no hay `verified`.
- **ASR relacionados:** [asr-BR-INT-02](/knowledge-base/architecture/asr/asr-BR-INT-02.md) y [asr-BR-ACR-04](/knowledge-base/architecture/asr/asr-BR-ACR-04.md), ambos candidatos sin disposición. Ninguno está aprobado.
- **Depende de / Reemplaza a:** —. Se complementa con [ADR-002](/knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md) (seguridad). La propuesta [ADR-009](/knowledge-base/architecture/adrs/ADR-009-composicion-de-microuis-con-native-federation.md) (Native Federation) fue **rechazada** el 2026-09-30: la técnica de composición sigue abierta. [ADR-010](/knowledge-base/architecture/adrs/ADR-010-lenguaje-del-bff-nodejs.md) (2026-09-30) confirma el BFF en Node.js frente a [ADR-008](/knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md).

## Contexto

- La plataforma es nueva: no hay evidencia de un sistema previo ([ACP-001](/knowledge-base/architecture/ACP-001-architecture-context-pack.md), supuesto A-01).
- Hay 9 capacidades en tres horizontes (H1 a H3), con 7 actores y 4 integraciones externas: Classroom, Drive, GitLab y docsuite ([ADB-001](/knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md), "Actors and capabilities").
- La entrega es incremental por horizontes, y H2 y H3 se agregan sobre H1 (ADB-001, preocupación AC-10).
- No se conocían los estándares, las tecnologías ni el alojamiento corporativos. Era el vacío KG-01, con prioridad 1 entre las preguntas de ADB-001. Esta decisión responde la parte de tecnología y estructura.
- El pack ACP-001 está en estado NOT READY_FOR_ARQ_102. Este ADR se registra por decisión del decisor, sin esperar ese estado.

## Opciones consideradas

Las opciones y sus pros y contras son una reconstrucción del agente. El decisor no registró el análisis de alternativas. Los pros y contras son razonamiento del agente y no se respaldan en fuentes consultadas en esta sesión.

**Frontend:**

1. **Una SPA monolítica en Angular.** A favor: menos piezas que integrar y desplegar. En contra: las capacidades de H2 y H3 crecerían dentro de una sola aplicación.
2. **Un shell y microUIs en Angular (elegida).** A favor: cada capacidad u horizonte puede crecer como una pieza separada dentro de una experiencia unificada. En contra: más complejidad de composición, versionado y dependencias compartidas.
3. **Aplicaciones separadas sin shell.** En contra: rompe la experiencia unificada que busca la plataforma (VIS-001 §6, "experiencia unificada", citada en ADB-001).

**Acceso a los microservicios:**

1. **El frontend llama directamente a los microservicios.** En contra: expone cada servicio al navegador y reparte en el frontend la composición y la seguridad.
2. **Un BFF en Node.js como intermediario (elegida).** A favor: un único punto de entrada para el frontend. En contra: el BFF puede volverse un cuello de botella o concentrar lógica que no le corresponde.
3. **Un API gateway genérico sin BFF.** En contra: no adapta las respuestas a las necesidades de la interfaz.

## Decisión

**La plataforma se estructura en un shell y microUIs desarrollados en Angular, y un BFF en Node.js que es el único intermediario entre el frontend y los microservicios.**

**Justificación:** [PENDIENTE]. El decisor no la registró.

**Argumentos del agente (no son del decisor):**
- La entrega por horizontes (ADB-001 AC-10) encaja con agregar microUIs nuevos sin rehacer los existentes.
- Un BFF intermediario deja un solo punto de control para aplicar la separación "la IA propone, un humano certifica" ([asr-BR-ACR-04](/knowledge-base/architecture/asr/asr-BR-ACR-04.md)) y la visibilidad de datos por rol ([asr-BR-TRA-01](/knowledge-base/architecture/asr/asr-BR-TRA-01.md)). Aplicarlas no queda decidido por este ADR.

**No se decidió todavía**, y el desarrollo no debe asumirlo:
- La técnica de composición de los microUIs (por ejemplo, federación de módulos, web components u otra) y cómo se comparten dependencias y el design system. Decide: arquitecto responsable.
- La partición en microUIs: por capacidad, por horizonte o por actor. Decide: arquitecto responsable, con el Jefe de Ingeniería.
- Si hay un BFF único o uno por microUI o canal.
- El protocolo entre el BFF y los microservicios (REST, gRPC, eventos) y el contrato de sus APIs.
- La descomposición en microservicios y sus límites, incluido qué servicio integra Classroom, Drive, GitLab y docsuite, y cómo se aísla Classroom para la contingencia ([asr-BR-INT-02](/knowledge-base/architecture/asr/asr-BR-INT-02.md)).
- Las versiones de Angular y Node.js, el alojamiento y el despliegue (ADB-001 KG-01, pregunta 1, parte de alojamiento).
- La seguridad del BFF está en [ADR-002](/knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md).

## Metas de calidad

[PENDIENTE]: sin ASR aprobado con métrica. Los candidatos del [catálogo ASR](/knowledge-base/architecture/asr/asr-catalog.md) no tienen disposición humana, y ninguna fuente fija metas de rendimiento ni de disponibilidad (ADB-001 KG-06).

## Consecuencias

**Positivas:**
- Hay una estructura de referencia para planificar H1 y agregar H2 y H3.
- El frontend no depende directamente de la forma interna de los microservicios.

**Negativas y riesgos:**
- Más piezas que versionar, desplegar y observar: shell, microUIs, BFF y microservicios. Sin metas de calidad (KG-06) no se puede dimensionar.
- Si el BFF acumula lógica de negocio, se vuelve un monolito intermedio. Conviene definir qué responsabilidades le tocan.
- Las opciones del frontend dependen de la técnica de composición, que todavía está abierta. Confirmar con un *spike* antes de fijarla.

**Impacto en pruebas:**
- Pruebas de integración del shell con cada microUI (navegación y contratos de carga).
- Pruebas de contrato entre los microUIs y el BFF, y entre el BFF y los microservicios.
- Pruebas de accesibilidad WCAG 2.2 AA por microUI y en la composición. El objetivo viene de la guía del repositorio (ADB-001, restricción C-09).
