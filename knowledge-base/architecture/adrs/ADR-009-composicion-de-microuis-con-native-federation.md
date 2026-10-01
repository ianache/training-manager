---
type: ADR
id: ADR-009
title: Los microUIs Angular se componen en el shell en tiempo de ejecución con Native Federation
description: Propuesta RECHAZADA de componer los microUIs en el shell con Native Federation; la técnica de composición vuelve a quedar abierta en ADR-001.
tags: [architecture, adr, frontend, microui, micro-frontends, angular, native-federation, composicion]
status: published
adr_status: Rechazado
decision: { by: human:ianache, at: 2026-09-30T00:00:00-05:00, outcome: rechazado }
verified: { by: human:ianache, at: 2026-09-30T00:00:00-05:00 }
history:
  - { at: 2026-09-30, by: human:ianache, change: "Redactado como Aceptado a partir de la elección de Native Federation para el scaffold" }
  - { at: 2026-09-30, by: human:ianache, change: "Rechazado por el decisor. Motivo: [PENDIENTE]" }
related: [ADR-001, ADR-002, ADR-005, ADR-008, ACP-002, UXR-000, GEN-002, UI-INV-001]
generated: { by: architecture-adr-writer/claude-opus-5-5, at: 2026-09-30T22:30:00-05:00 }
sources:
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
    title: ADR-001 — Estructura de la plataforma (shell y microUIs en Angular, BFF)
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
    title: ADR-002 — Autenticación en el BFF con Keycloak y PKCE
  - id: adr-005
    resource: /knowledge-base/architecture/adrs/ADR-005-implementacion-pkce-tokens-y-sesiones.md
    title: ADR-005 — Implementación de PKCE, tokens y sesiones
  - id: adr-008
    resource: /knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md
    title: ADR-008 — Python + FastAPI como estándar para APIs REST
  - id: acp-002
    resource: /knowledge-base/architecture/ACP-002-context-pack-general.md
    title: ACP-002 — Architecture Context Pack general
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
    title: UXR-000 — Requisitos UX transversales
  - id: gen-002
    resource: /knowledge-base/design/stitch/GEN-002-shell-y-estados-transversales.md
    title: GEN-002 — Shell y estados transversales
  - id: ui-inv-001
    resource: /knowledge-base/components/ui-inventory.md
    title: UI-INV-001 — Inventario de pantallas y componentes
  - id: web-architecture
    resource: /codebase/apps/ARCHITECTURE.md
    title: Arquitectura de la aplicación web (decisión D-01)
  - id: portal-federation
    resource: /codebase/apps/portal/projects/shell/federation.config.mjs
    title: Configuración de Native Federation del shell (implementación de referencia)
---

# ADR-009 — Composición de microUIs con Native Federation

> **RECHAZADO** por `human:ianache` el 2026-09-30. Se conserva como registro. La técnica de composición de los microUIs vuelve a estar abierta en [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md), sección "No se decidió todavía". El desarrollo **no** debe tomar este documento como decisión vigente.

- **Estado:** Rechazado
- **Fecha:** 2026-09-30
- **Decisor:** ianache (`human:ianache`)
- **Redacción:** architecture-adr-writer/claude-opus-5-5. Se redactó como Aceptado porque el decisor eligió Native Federation para el scaffold del 2026-09-30; después, el mismo día, el decisor **rechazó** el ADR. Verificado y deprecado por `human:ianache` el 2026-09-30.
- **Motivo del rechazo:** Rechazado en 2026-09-30. Se conserva como referencia histórica; la técnica de composición queda abierta en ADR-001.
- **ASR relacionados:** ninguno. El [catálogo ASR](/knowledge-base/architecture/asr/asr-catalog.md) no tiene un candidato sobre la composición del frontend.
- **Depende de / Reemplaza a:** depende de [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md), cuya sección "No se decidió todavía" dejaba abierta esta técnica. No reemplaza a ningún ADR.

## Contexto

- [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md) decidió un shell y microUIs en Angular, pero dejó abierta *"la técnica de composición de los microUIs (por ejemplo, federación de módulos, web components u otra) y cómo se comparten dependencias y el design system"*. También pidió confirmarla con un *spike* antes de fijarla.
- La entrega es incremental por horizontes, y H2 y H3 agregan capacidades (Formación, Propuestas IA) sobre H1. ACP-002 §3.1 lista un microUI por capacidad.
- El shell es la única fuente de navegación global (ACP-002, TCON-006). La sesión debe valer para todos los microUIs con un solo inicio de sesión (UXR-000.1).
- La sesión vive en el BFF, con una cookie HTTP-only, y los tokens no llegan al navegador ([ADR-005](/knowledge-base/architecture/adrs/ADR-005-implementacion-pkce-tokens-y-sesiones.md) §1). Por eso el shell y los microUIs deben servirse desde el **mismo origen** que el BFF.
- El design system (tokens, atoms y molecules de [UI-INV-001](/knowledge-base/components/ui-inventory.md)) debe verse igual en todos los microUIs.
- El 2026-09-30 se construyó la aplicación web de referencia en `codebase/apps/portal` con esta técnica ([ARCHITECTURE.md](/codebase/apps/ARCHITECTURE.md), decisión D-01). Funciona como el *spike* que pedía ADR-001; ver "Evidencia del *spike*".

## Opciones consideradas

Las opciones y sus pros y contras son una reconstrucción del agente. El decisor no registró el análisis de alternativas; eligió entre las tres primeras opciones que el agente le presentó en la sesión.

1. **Native Federation (`@angular-architects/native-federation`) (elegida).** El shell es el *host* y cada microUI es un *remoto*. Los remotos se resuelven al ejecutar, desde `federation.manifest.json`, con módulos ES estándar e *import maps*. A favor: funciona con el builder esbuild de Angular (`@angular/build`) y comparte Angular, RxJS y las librerías internas como *singletons*. Cada microUI se compila y despliega por separado. En contra: es una dependencia de terceros que debe seguir el ritmo de las versiones de Angular, y las versiones compartidas tienen que estar alineadas.
2. **Monorepo con librerías cargadas por rutas *lazy* (un solo build).** A favor: es lo más simple y no tiene composición en tiempo de ejecución. En contra: cualquier cambio en un microUI obliga a recompilar y desplegar todo el portal, así que no hay independencia de despliegue por capacidad.
3. **Module Federation clásico (webpack).** A favor: es maduro. En contra: exige el builder webpack, que ya no es el de Angular, y se aleja de la cadena de herramientas por defecto del framework.
4. **Web components (Angular Elements).** A favor: aíslan el framework. En contra: duplican el runtime de Angular por microUI, complican compartir el router, la sesión y el design system, y dan otra semántica de accesibilidad y foco. Esta opción no se presentó al decisor.
5. ***Iframes* o aplicaciones separadas sin shell.** Ya los descartó ADR-001: rompen la experiencia unificada.

## Decisión propuesta (rechazada)

**Los microUIs Angular se componen en el shell en tiempo de ejecución con Native Federation (`@angular-architects/native-federation`). Cada microUI es un remoto que expone sus rutas y que el shell resuelve desde un manifiesto de federación propio de cada entorno.**

**Justificación:** [PENDIENTE]. El decisor no la registró.

**Argumentos del agente (no son del decisor):**
- Es la opción que mantiene independencia de despliegue por microUI sin abandonar el builder por defecto de Angular (esbuild).
- Compartir `@gf/core` (sesión, HTTP, guards) como *singleton* deja un único `SessionService` para el shell y todos los remotos, así que se inicia sesión una sola vez (UXR-000.1) y no hay una sesión por microUI.
- El manifiesto se genera al arrancar el contenedor con el origen público del entorno, y la misma imagen sirve en local, QA y PROD sin recompilar.

**Reglas de implementación**, tal como quedaron en la implementación de referencia. Son reglas propuestas por el agente; el decisor las puede cambiar sin un ADR nuevo, mientras no cambie la técnica:
- Cada remoto expone **solo** `./routes`, con rutas relativas: no conoce su prefijo de montaje ni importa el shell u otros remotos.
- El shell monta cada remoto bajo un prefijo, con `loadRemoteModule(<nombre>, './routes')` y el guard de rol que corresponda.
- Se comparten como *singleton*, con `strictVersion`, los paquetes de `package.json` y las librerías internas `@gf/core` y `@gf/ui`.
- El shell y los remotos se sirven desde el mismo origen que el BFF: shell en `/`, remotos en `/mfe/<nombre>/`. El manifiesto apunta a `<origen>/mfe/<nombre>/remoteEntry.json`.
- Si un remoto no carga, el shell no se cae: muestra un estado de "no disponible" y el resto de la plataforma sigue funcionando.

**No se decidió todavía**, y el desarrollo no debe asumirlo:
- **La partición en microUIs.** La implementación de referencia usa una por capacidad (catálogo, colaboradores) siguiendo ACP-002 §3.1, pero ADR-001 deja esta decisión al arquitecto responsable con el Jefe de Ingeniería.
- **Si los remotos se despliegan por separado** (imagen o *bucket* por microUI) o en una sola imagen del portal, como hoy en desarrollo. Decide: arquitecto responsable con DevOps.
- **La política de versiones compartidas** cuando un remoto necesite otra versión de Angular, y el procedimiento de actualización conjunta.
- **Dónde vive el manifiesto en QA y PROD** (archivo generado al arrancar, servicio de configuración u otro) y quién lo administra.
- **Si `@gf/ui` se publica como paquete NPM** en un registro corporativo, o se sigue compartiendo por *path mapping* dentro del repositorio.
- **El lenguaje del BFF.** No lo decide este ADR: ADR-001 dice Node.js y [ADR-008](/knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md) lo cambia a Python/FastAPI. Esta técnica de composición sirve con cualquiera de los dos, porque el portal solo habla con el BFF por rutas relativas.

## Evidencia del *spike* (2026-09-30)

Hechos verificados por el agente en la implementación de referencia, sin revisión humana:
- Angular 22.2 con `@angular-architects/native-federation` 22.2: el shell y los dos remotos compilan en modo producción.
- En Chromium, con el shell y los remotos servidos desde un solo origen y los remotos en `/mfe/<nombre>/`, el shell carga los dos remotos por sus rutas. La consola no muestra errores, la navegación muestra solo las secciones permitidas por rol, y un enlace directo a un remoto respeta el guard de rol.
- `@gf/core` se comparte como *singleton*: una sola sesión para el shell y los remotos.
- Prueba de punta a punta (navegador → nginx → BFF → microservicio → PostgreSQL) con la lista de colaboradores servida por el remoto `mfe-collaborators`.

Pendiente: la prueba con despliegues independientes por remoto y la medición de tiempos de carga. TSUP-003 de ACP-002 ("MicroUIs cargan en <2s") es un supuesto, no una meta aprobada.

## Metas de calidad

[PENDIENTE]: sin ASR aprobado con métrica. ACP-002 lista supuestos (TSUP-003) y NFR derivados que no tienen disposición humana.

## Consecuencias

**Positivas:**
- Cada capacidad puede crecer como un microUI propio y agregarse en H2 y H3 sin rehacer el shell. Basta con registrar el remoto en el manifiesto y montar su ruta.
- Hay una sola sesión y un solo design system en toda la plataforma.
- Las URLs de los remotos no se compilan dentro del shell, así que la misma imagen sirve en cualquier entorno.

**Negativas y riesgos:**
- Depende de `@angular-architects/native-federation`, que debe actualizarse junto con Angular.
- Si las versiones compartidas se desalinean entre el shell y los remotos, el error aparece al ejecutar, no al compilar (`strictVersion`).
- Hay más piezas que versionar y servir. Con despliegues independientes aparece el riesgo de remotos incompatibles con el shell; conviene tratar el contrato `./routes` y las versiones de `@gf/core` como API pública.
- Un remoto caído afecta su sección. La implementación lo contiene con un estado de error, pero no lo evita.

**Impacto en pruebas:**
- Prueba de composición: el shell carga cada remoto del manifiesto y monta sus rutas (smoke E2E con Playwright).
- Prueba de aislamiento: con un remoto inaccesible, el shell muestra el estado "no disponible" y las demás secciones siguen funcionando.
- Prueba de *singleton*: el shell y los remotos comparten la misma instancia de sesión.
- Conformidad automática: los microUIs no se importan entre sí ni importan el shell (`portal/tools/check-architecture.mjs`).
- Accesibilidad WCAG 2.2 AA por microUI y en la composición (ADR-001, UXR-000.3).
