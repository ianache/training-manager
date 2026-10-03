---
id: IB-016
type: Intent Brief
title: "IB-016 — Exploración de diseño: Actualizar datos y medios de contacto"
description: "Intención, restricciones y ejes de exploración para las pantallas SCR-016-01 a SCR-016-05 antes de generar alternativas en Claude Design."
tags: [ux-ui, intent-brief, exploration, party, contactos]
status: draft
generated:
  by: "claude-design-orchestrator/1.1"
  at: "2026-10-02T23:00:00-05:00"
sources:
  - id: flw-016
    resource: /knowledge-base/design/user-flows/FLW-016-actualizar-datos-y-contactos.md
  - id: scr-016
    resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
  - id: uxr-016
    resource: /knowledge-base/design/ux-requirements/UXR-016-actualizar-datos-y-contactos.md
  - id: us-016
    resource: /knowledge-base/requirement/user-stories/US-016-actualizar-datos-y-contactos.md
  - id: tkn-set-002
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
flow: FLW-016
screens: [SCR-016-01, SCR-016-02, SCR-016-03, SCR-016-04, SCR-016-05, SCR-016-06]
---

# IB-016 — Exploración de diseño: Actualizar datos y medios de contacto

**Estado de la exploración:** Intent Brief listo; **alternativas pendientes**. Claude Design no estaba conectado al redactar este documento (HTTP 401, requiere `/login`), así que no se generó ni se criticó ninguna alternativa. No hay Design Decision (DD): requiere un decisor humano y alternativas que elegir.

## Intención

Que el Jefe de Ingeniería corrija datos de una persona y cambie sus medios de contacto sin perder el historial, y que el colaborador mantenga por sí mismo solo sus perfiles profesionales y su teléfono laboral (US-016). Las pantallas deben dejar claro qué puede editar cada actor, qué valor está vigente y qué cambiará al guardar.

## Hechos (con fuente)

- 5 pantallas en escritorio, WCAG 2.2 AA, tokens `TKN-SET-002` (SCR-016).
- Jefe: edita todo salvo personas anonimizadas; colaborador: solo perfiles y teléfono propios (BR-PTY-14, BR-PTY-17).
- Cambiar correo o teléfono cierra la vigencia anterior y abre una nueva (BR-PTY-12); el correo laboral es obligatorio y único entre vigentes (BR-PTY-08); el teléfono es opcional (BR-PTY-09).
- Plataformas de perfil: LinkedIn, GitHub y «Otro», lista ampliable (BR-PTY-09).
- Estados exigidos por pantalla: ver `required_states` de cada SCR-016-NN.
- Componentes: `@gf/ui`, sin Material; CMP-015 no cubre teléfono, URL, validación asíncrona del correo, badge de vigencia ni lista de perfiles.

## Qué explorar (ejes, no alternativas)

1. **Estructura de la página de edición (SCR-016-01 a -04):** la edición es una **página** (decisión humana, SCR-016-Q1). Explorar su composición: cabecera con contexto de la persona, agrupación de campos, ubicación de acciones y confirmación.
2. **Cambio de contacto con vigencia (SCR-016-02):** cómo mostrar el valor vigente junto al nuevo y el efecto «anterior → nuevo» antes de confirmar. Incluye el **organismo teléfono** (selector de país + número, SCR-016-Q2).
3. **Perfiles profesionales (SCR-016-03):** lista con acciones por fila frente a tarjetas; estado vacío; confirmación de «Eliminar», que **cierra la vigencia** y conserva el historial (SCR-016-Q5).
4. **Historial de cambios (SCR-016-06):** el historial hace falta (SCR-016-Q15). Evaluar la propuesta de entrada (pestaña «Historial» en la ficha, enlaces contextuales en las páginas de edición y «Ver historial» tras guardar) frente a alternativas, y cómo se presenta (tabla de auditoría con anterior y nuevo, vigencias, filtros) (SCR-016-Q18).
5. **Puntos de entrada en la ficha (SCR-016-05):** cómo se distinguen las acciones del Jefe de las del colaborador y qué se ve cuando no hay permiso (SCR-016-Q8).

## Criterios de crítica

Cada alternativa se evaluará contra: AC-1 a AC-5 de US-016, requisitos de UXR-016 y UXR-000, los estados requeridos, WCAG 2.2 AA (contrastes, foco, anuncio de errores, teclado), uso exclusivo de tokens semánticos de `TKN-SET-002` y reutilización de componentes de CMP-015 antes de proponer nuevos.

## Supuestos (no confirmados)

- Solo escritorio, heredado de SCR-015 (SCR-016-Q10).

## Decisiones humanas (`human:ianache`, 2026-10-02)

| ID | Decisión | Efecto en la exploración |
|---|---|---|
| SCR-016-Q1 | La edición es una **página** | Se exploran páginas; no hay modales |
| SCR-016-Q2 | Teléfono = **selector de país + número**, como **organismo** | Se explora como organismo compuesto de átomos existentes (select y text-input) |
| SCR-016-Q5 | Eliminar un perfil **cierra su vigencia** | La confirmación comunica que se conserva el historial |
| SCR-016-Q6 | Corregir datos simples **conserva la historia con auditoría** | El historial es parte del diseño |
| SCR-016-Q12 | **Todo componente tiene su CMP** | Los CMP se especificaron en CMP-016 (11 componentes, `REQUIRES_REVIEW`) |
| SCR-016-Q15 | **Sí** hace falta historial | Nueva pantalla SCR-016-06 |
| SCR-016-Q16 | Países **Perú (predeterminado) y Estados Unidos**, con **bandera**; validación por país y número internacional completo **confirmados** | El selector del organismo teléfono muestra bandera, nombre y prefijo |
| SCR-016-Q17 | **ok**: se actualizan US-016 y BR-PTY-12 | La historia de datos simples es requisito, no hipótesis |
| SCR-016-Q18 | Propuesta de historial **confirmada**; el colaborador ve el suyo y el **Jefe de Ingeniería** el de cualquiera | El diseño contempla dos actores en SCR-016-06 |
| SCR-016-Q19 | El acceso se mantiene **solo para el Jefe de Ingeniería**; el ADMIN queda fuera | Sin vistas para ADMIN; el filtro «realizado por» es solo del Jefe |
| SCR-016-Q9 / CMP-016-Q11 | El cambio de contacto **aplica de inmediato**; sin fechas futuras ni estado «pendiente» | La etiqueta de vigencia solo tiene vigente y cerrada |
| CMP-016-Q10 | «Otro» pide un **nombre de plataforma libre** (ejemplo «Training Portal») | SCR-016-03 agrega el campo «Nombre de la plataforma» al elegir «Otro» |
| CMP-016-Q3, Q4, Q6, Q7, Q8, Q12, Q13 | Resueltas (sin separadores en el teléfono, país no soportado de solo lectura, fecha dd/mm/aaaa y hora de Lima, 10 por página, `tablist`, `gf-badge`, selector con CSS) | Ver CMP-016 |

## Preguntas abiertas que condicionan la exploración

Las preguntas de SCR-016 que condicionaban la exploración están resueltas. Quedan las de componentes en [CMP-016](../components/CMP-016-componentes-actualizar-datos-y-contactos.md) (CMP-016-Q1 a Q13). Las que más afectan al diseño:

| ID | Pregunta | Efecto |
|---|---|---|
| CMP-016-Q9 | No existe endpoint de historial; contrato de datos por acordar | Qué columnas se pueden mostrar con datos reales |
| CMP-016-Q14 (SCR-016-Q20) | Longitud y almacenamiento del nombre libre de «Otro»; el modelo guarda solo un código de plataforma | Campo adicional en SCR-016-03 |

Las demás preguntas de SCR-016 (Q3, Q4, Q7 a Q11, Q13, Q14) no bloquean la exploración.

## Trazabilidad

US-016 → UXR-016 → FLW-016 → SCR-016-01..05 → IB-016. Siguiente: alternativas en Claude Design y, con decisión humana, DD-016.
