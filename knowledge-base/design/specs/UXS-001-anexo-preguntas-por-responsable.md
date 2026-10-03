---
type: UX Open Questions Digest
title: "UXS-001 anexo — Preguntas abiertas por responsable"
description: "Consolida las 77 preguntas abiertas de UXR/FLW/SCR 017, 028, 029 y 030 en 44 preguntas fusionadas, agrupadas por responsable y tema, con prioridad, qué desbloquean, marca de negocio y una sugerencia no vinculante; columna Respuesta vacía."
tags: [ux-open-questions, party, estructura-organizacional, unidades]
status: draft
generated:
  by: "ux-ui-orchestrator/1.0"
  at: "2026-10-03T18:00:00-05:00"
sources:
  - id: uxr-017
    resource: /knowledge-base/design/ux-requirements/UXR-017-registrar-la-organizacion-interna.md
  - id: uxr-028
    resource: /knowledge-base/design/ux-requirements/UXR-028-listar-y-buscar-unidades-organizacionales.md
  - id: uxr-029
    resource: /knowledge-base/design/ux-requirements/UXR-029-registrar-y-editar-unidades-organizacionales.md
  - id: uxr-030
    resource: /knowledge-base/design/ux-requirements/UXR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: flw-017
    resource: /knowledge-base/design/user-flows/FLW-017-registrar-la-organizacion-interna.md
  - id: flw-028
    resource: /knowledge-base/design/user-flows/FLW-028-listar-y-buscar-unidades-organizacionales.md
  - id: flw-029
    resource: /knowledge-base/design/user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md
  - id: flw-030
    resource: /knowledge-base/design/user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: scr-017
    resource: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
  - id: scr-028
    resource: /knowledge-base/design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md
  - id: scr-029
    resource: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
  - id: scr-030
    resource: /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: uxs-001
    resource: /knowledge-base/design/specs/UXS-001-gestion-de-unidades-organizacionales.md
---

# UXS-001 anexo — Preguntas abiertas por responsable

> Resumen para responder en una sola pasada. No agrega preguntas ni decisiones: cada fila fusiona preguntas ya registradas en los artefactos fuente y lista los IDs que cierra. La columna **Sugerencia** es solo una sugerencia no vinculante; la decisión es de quien responde. Ningún artefacto fuente fue editado.

## Conteo

| Fuente | Esperado | Contado |
|---|---|---|
| UXR (017: 3, 028: 5, 029: 5, 030: 4) | 17 | 17 |
| FLW (017: 5, 028: 6, 029: 7, 030: 6) | 24 | 24 |
| SCR (017: 8, 028: 5, 029: 15, 030: 8) | 36 | 36 |
| **Total** | **77** | **77** |

Las listas «Heredadas» de FLW y SCR repiten IDs de UXR/FLW y no se cuentan aparte. Las 77 preguntas se fusionan en **44** (cada ID aparece en una sola fila). Referencias externas a estas preguntas: SCR-016-Q10 y SCR-016-Q13 (artefacto fuera de alcance), Q-UXS-4 de UXS-001 (textos sin fuente, cubierto por Q-C05).

## Leyenda

- **Tipo**: **Negocio** = regla o decisión de negocio; se deriva a `af-requirements-orchestrator` y **no se responde en diseño**. **Diseño** = decisión de UX/UI. **Arquitectura** = decisión técnica.
- **Prioridad**: la más alta entre las preguntas fusionadas según la fuente. Las SCR no traen prioridad propia: se derivó Baja, o Media si la fuente las marca Gate/Diseño. La colisión de tokens es Alta según UXS-001 §5.
- **Desbloquea**: Stitch, Figma, Gate (DESIGN_READY_FOR_DEV), QA. Ninguna pregunta bloquea el preflight.

## 1. Jefe de Ingeniería — reglas de negocio (derivar a af-requirements-orchestrator)

| ID | Pregunta fusionada | Cierra | Tipo | Prior. | Desbloquea | Sugerencia (no vinculante) | Respuesta |
|---|---|---|---|---|---|---|---|
| Q-A01 | Formato y longitud del RUC (11 dígitos), dígito verificador y país emisor (selector libre o fijo en Perú) | UXR-017-Q1, FLW-017-Q2 | Negocio | Media | QA (validaciones), Stitch | Sugerencia: 11 dígitos, validar dígito verificador, país prefijado en Perú; confirmar con negocio. | |
| Q-A02 | ¿Se puede editar razón social o RUC tras registrar la organización? | UXR-017-Q2 | Negocio | Baja | Alcance de FLW-017 | Sugerencia: no editable en esta iniciativa (US-017 no incluye edición). | |
| Q-A03 | ¿Puede haber más de una organización interna? | UXR-017-Q3 | Negocio | Media | Variante de entrada (Q-C01), QA | Sugerencia: una sola, acorde al texto «la organización interna». | |
| Q-A04 | ¿Cómo se registra la unidad superior (sin padre) y se permite otra si ya existe? | UXR-029-Q5, FLW-029-Q4, SCR-029-Q3 | Negocio | Media | Stitch/Figma (selector de padre), QA | Sugerencia: una sola unidad superior, la primera registrada sin padre; confirmar H-2 de US-029. | |
| Q-A05 | ¿La unidad lleva más datos (código, descripción, responsable) además de nombre y padre? | UXR-029-Q4 | Negocio | Media | Campos del formulario SCR-029 | Sugerencia: solo nombre y padre, como piden las historias. | |
| Q-A06 | Longitud máxima y caracteres permitidos del nombre de unidad | UXR-029-Q1, SCR-029-Q1 | Negocio | Baja | QA, validaciones | Sugerencia: definir un máximo y juego de caracteres único para toda la plataforma. | |
| Q-A07 | Longitud máxima y reglas de la razón social | SCR-017-Q2 | Negocio | Baja | QA, validaciones | Sugerencia: resolver junto con Q-A01 y Q-A06. | |
| Q-A08 | ¿El nombre repetido se compara sin distinguir mayúsculas y acentos? | UXR-029-Q3 | Negocio | Baja | QA, mensaje de duplicado | Sugerencia: comparar sin distinguir mayúsculas ni acentos. | |
| Q-A09 | Al mover una unidad, ¿se valida nombre ya existente bajo el nuevo padre y con qué mensaje? (BR-PTY-26) | SCR-029-Q11 | Negocio | Media | Estados de error de SCR-029, QA | Sugerencia: validar y bloquear con mensaje claro, coherente con la regla de nombre único. | |
| Q-A10 | ¿Qué ocurre con las descendientes al mover el padre y debe mostrarse? | SCR-029-Q15 | Negocio | Media | Contenido de confirmación (BR-PTY-22), QA | Sugerencia: las descendientes se mueven con la unidad; indicarlo en la confirmación. | |
| Q-A12 | Reglas de la fecha desde: ¿pasada, futura u hoy?, ¿anterior a la vigencia previa en reactivación?, valor por defecto y texto de error (registro, cambio de padre, reactivación) | UXR-029-Q2, UXR-030-Q3, FLW-030-Q5, SCR-029-Q2, SCR-030-Q2 | Negocio | Media | Stitch/Figma (campo fecha), QA; BR-PTY-12 no lo precisa | Sugerencia: hoy por defecto y editable; definir si admite pasado o futuro. | |
| Q-A13 | En el registro de la organización, ¿la «vigencia desde» la ingresa el Jefe o la fija el sistema? | FLW-017-Q1 | Negocio | Media | Campos de SCR-017-01 | Sugerencia: fijarla el sistema a la fecha de registro. | |
| Q-A14 | ¿Se puede cambiar el padre de una unidad Inactiva? | FLW-029-Q3, SCR-029-Q7 | Negocio | Media | Estados de SCR-029, QA | Sugerencia: no permitir hasta definir la reactivación (relacionado con US-030). | |
| Q-A15 | ¿La edición de nombre pide fecha desde o motivo? | FLW-029-Q2, SCR-029-Q5 | Negocio | Baja | Campos de SCR-029-02 | Sugerencia: no pedirlos; la fuente los exige solo al registrar y cambiar padre. | |
| Q-A16 | ¿La desactivación pide motivo para auditoría? | UXR-030-Q2 | Negocio | Baja | Diálogo SCR-030, auditoría | Sugerencia: no pedirlo; la historia exige quién, cuándo y valores. | |
| Q-A17 | En listado y bloqueo, ¿basta el conteo de personas vigentes o debe mostrarse quiénes son? (expone datos personales; BR-PTY-20) | UXR-028-Q5, UXR-030-Q1 | Negocio | Media | Contenido de SCR-028 y SCR-030-02, privacidad | Sugerencia: solo conteo, como pide la historia. | |
| Q-A18 | ¿Se ofrece reubicar en lote personas o unidades hijas que impiden desactivar? | UXR-030-Q4 | Negocio | Baja | Alcance de FLW-030 | Sugerencia: fuera de alcance; se resuelve una por una. | |
| Q-A19 | ¿Se avisa del efecto de reactivar sobre hijas Inactivas (siguen Inactivas)? | FLW-030-Q6 | Negocio | Baja | Texto de SCR-030-03 | Sugerencia: avisar en la confirmación. | |
| Q-A20 | Destino de «ir a resolverlas» en el bloqueo y pantalla de US-016 que sirve para reubicar personas | FLW-030-Q3 | Negocio | Media | Navegación de SCR-030-02, Stitch | Sugerencia: enlazar al listado de hijas filtrado; identificar la pantalla de reubicación de US-016. | |
| Q-A21 | En jerarquía filtrada por Inactiva o Todas, ¿cómo se muestra una unidad Inactiva cuyo padre no cumple el filtro? | FLW-028-Q6 | Negocio | Media | Árbol de SCR-028, QA | Sugerencia: mostrarla bajo su padre atenuado para conservar el contexto. | |

## 2. Jefe de Ingeniería — comportamiento del flujo (decisión de diseño con el Jefe)

| ID | Pregunta fusionada | Cierra | Tipo | Prior. | Desbloquea | Sugerencia (no vinculante) | Respuesta |
|---|---|---|---|---|---|---|---|
| Q-B01 | ¿Cuántas unidades se esperan? Define paginación y profundidad máxima | UXR-028-Q1 | Diseño | Media | Tabla/árbol en Stitch y Figma | Sugerencia: partir de decenas, sin paginación, y revisar si crece. | |
| Q-B02 | Orden por defecto (por nombre o jerárquico) | UXR-028-Q2 | Diseño | Baja | SCR-028, QA | Sugerencia: por nombre en lista, jerárquico en árbol. | |
| Q-B03 | ¿Resaltar la coincidencia y mostrar ancestras de un resultado en la jerarquía? | UXR-028-Q3 | Diseño | Baja | SCR-028 | Sugerencia: resaltar y mostrar ancestras. | |
| Q-B04 | ¿Se conservan filtros, búsqueda, orden y vista (entre sesiones, tras error al reintentar, al volver de editar/desactivar) y cómo se confirma el resultado? | UXR-028-Q4, FLW-028-Q3, FLW-028-Q4 | Diseño | Media | SCR-028, QA | Sugerencia: conservar dentro de la sesión; no entre sesiones. | |
| Q-B05 | Punto de entrada de «Registrar unidad» cuando ya hay unidades | FLW-028-Q2 | Diseño | Media | SCR-028/029, Stitch | Sugerencia: botón principal en la cabecera del listado. | |
| Q-B06 | En «Sin permisos», ¿solo mensaje o redirección? | FLW-028-Q5 | Diseño | Baja | SCR-028, QA | Sugerencia: mensaje con enlace de salida. | |
| Q-B07 | Tras registrar la organización, ¿ir al listado automáticamente o permanecer con enlace/botón? | FLW-017-Q3, SCR-017-Q3 | Diseño | Baja | SCR-017-01 | Sugerencia: permanecer con botón «Ir a unidades». | |
| Q-B08 | ¿Confirmación al cancelar el registro con datos sin guardar? | FLW-017-Q5 | Diseño | Baja | SCR-017-01, QA | Sugerencia: confirmar solo si hay datos. | |
| Q-B09 | Contenido del resumen «de X a Y» además de los padres (fecha, descendientes afectadas) | FLW-029-Q5, SCR-029-Q6 | Diseño | Baja | SCR-029-03/04 | Sugerencia: padres y fecha; el número de descendientes depende de Q-A10. | |
| Q-B10 | Historial de relaciones: punto de acceso (pestaña, panel, enlace en fila) y columnas | FLW-029-Q6, SCR-029-Q13, SCR-029-Q14 | Diseño | Baja | SCR-029, Figma | Sugerencia: panel desde la fila de la unidad. | |
| Q-B11 | Con padre Inactivo, ¿«Reactivar» habilitado que bloquea al clic, o deshabilitado con explicación? | FLW-030-Q4 | Diseño | Baja | SCR-030-04, a11y | Sugerencia: deshabilitado con explicación accesible. | |

## 3. UX / Design System (con el Jefe donde se indica)

| ID | Pregunta fusionada | Cierra | Tipo | Prior. | Desbloquea | Sugerencia (no vinculante) | Respuesta |
|---|---|---|---|---|---|---|---|
| Q-C01 | Pantalla de entrada: ¿SCR-017-01 sustituye al listado cuando no hay organización o el listado remite a aquél? (Jefe / UX) | FLW-017-Q4, SCR-017-Q1 | Diseño | Media | Fusionar o separar pantallas; Stitch | Sugerencia: el listado remite a SCR-017-01, como indica UXR-028. | |
| Q-C02 | ¿Lista y jerarquía son una pantalla con alternancia (pestañas con ruta o control sin ruta) o dos? (Jefe / UX) | FLW-028-Q1, SCR-028-Q3 | Diseño | Baja | SCR-028, Stitch | Sugerencia: una pantalla con control sin ruta (propuesta ya en SCR-028-Q3). | |
| Q-C03 | ¿Registrar y editar nombre son formularios distintos o uno solo? | FLW-029-Q1, SCR-029-Q4 | Diseño | Baja | SCR-029-01/02 | Sugerencia: un solo formulario con dos modos. | |
| Q-C04 | ¿Confirmaciones y bloqueos son diálogos modales o pantallas/paneles, y son cuatro pantallas o variantes de una? (Jefe / UX) | FLW-030-Q1, SCR-030-Q1 | Diseño | Media | Número de SCR-030, Stitch (falta SCR-030-04) | Sugerencia: variantes de un diálogo modal. | |
| Q-C05 | Textos sin fuente: SCR-017-03 (mensaje, salida, «Solicitar acceso»), vacío/sin resultados/error/sin permisos, error de nombre vacío, consecuencia/éxito/error de SCR-030 | SCR-017-Q4, SCR-028-Q5, SCR-029-Q8, SCR-030-Q4 | Diseño | Media | QA (aserciones, Q-UXS-4), Stitch | Sugerencia: redactar borrador y validarlo con negocio. | |
| Q-C06 | ¿Qué controles se deshabilitan en `loading`? | SCR-028-Q4 | Diseño | Baja | SCR-028, QA | Sugerencia: deshabilitar búsqueda y acciones de fila. | |
| Q-C07 | Con un solo tipo de dependencia, ¿mostrar el otro conteo en cero u omitirlo? | SCR-030-Q3 | Diseño | Baja | SCR-030-02 | Sugerencia: omitirlo. | |
| Q-C08 | Confirmación tras éxito de desactivar/reactivar: ¿toast o mensaje en el listado? | SCR-030-Q8 | Diseño | Baja | SCR-030, a11y | Sugerencia: mensaje en el listado con anuncio accesible. | |
| Q-C09 | TKN-SET-001 y TKN-SET-002 definen los mismos IDs con valores distintos: ¿cuál rige? Falta token semántico de éxito (Gate) | SCR-017-Q7, SCR-029-Q10, SCR-030-Q6 | Diseño | Alta | Gate de desarrollo; consistencia en Figma | Sugerencia: confirmar TKN-SET-002 (el que ya asume SCR-030) y crear el token de éxito. | |
| Q-C10 | Componentes faltantes: estado vacío genérico, tabla ordenable, árbol, selector de padre, chips de filtros, diálogo informativo, conteo de dependencias; ¿se crean como CMP nuevos? (UX / Arquitecto frontend) | SCR-017-Q5, SCR-028-Q2, SCR-030-Q7 | Diseño | Media | Gate; spec de componentes; Stitch sin inventar | Sugerencia: especificarlos como CMP nuevos antes de Figma. | |
| Q-C11 | No existe AC-017 como artefacto de diseño; se usan AC-1 y AC-2 de US-017 | SCR-017-Q8 | Diseño | Baja | Trazabilidad | Sugerencia: aceptar AC-1/AC-2 de US-017 como referencia. | |

## 4. Responsable de producto

| ID | Pregunta fusionada | Cierra | Tipo | Prior. | Desbloquea | Sugerencia (no vinculante) | Respuesta |
|---|---|---|---|---|---|---|---|
| Q-D01 | ¿Solo escritorio o también tableta/móvil? (hoy se hereda de SCR-015/016; UXR-000 debe confirmarlo) | SCR-017-Q6, SCR-028-Q1, SCR-029-Q9, SCR-030-Q5 | Diseño | Media | `responsive` de las 12 pantallas; Figma | Sugerencia: solo escritorio, coherente con el resto de la plataforma. | |

## 5. Arquitecto (con el Jefe de Ingeniería)

| ID | Pregunta fusionada | Cierra | Tipo | Prior. | Desbloquea | Sugerencia (no vinculante) | Respuesta |
|---|---|---|---|---|---|---|---|
| Q-E01 | Concurrencia: ¿qué pasa si otro usuario modificó la unidad o su padre antes de confirmar? ¿Cuándo se calculan las dependencias (al abrir o al confirmar) y qué ocurre si cambian entre ambos? | FLW-029-Q7, SCR-029-Q12, FLW-030-Q2 | Negocio / Arquitectura | Media | Estados de conflicto de SCR-029/030, QA | Sugerencia: revalidar al confirmar y mostrar estado de conflicto con opción de recargar. | |

> La parte de negocio de Q-E01 (qué debe ocurrir ante el conflicto) va a `af-requirements-orchestrator`; la parte técnica (versionado, momento del cálculo) es del Arquitecto.

## Resumen para derivar a af-requirements-orchestrator

Preguntas de negocio, no se responden en diseño (21 filas): Q-A01 a Q-A10, Q-A12 a Q-A21 (20 filas) y la parte de negocio de Q-E01. Q-A11 no existe: la numeración salta de Q-A10 a Q-A12 porque la concurrencia se movió a Q-E01.

## Orden de respuesta sugerido

1. Q-C09 (token, Alta, Gate), 2. Q-C01 (entrada), 3. Q-A12 (fecha desde), 4. Q-A04 (unidad superior), 5. Q-D01 (solo escritorio), 6. Q-E01 (concurrencia).
