---
type: UX Requirement
title: "UXR-003 — Certificar un nivel de competencia"
description: "Lo que el evaluador necesita para revisar las evidencias de un colaborador contra la rúbrica y los requisitos de evidencia, y certificar un nivel."
tags: [ux-ui, ux-requirement, certificacion, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-10-04T12:00:00-05:00"
sources:
  - id: us-003
    resource: /knowledge-base/requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
---

# UXR-003 — Certificar un nivel de competencia

## Trazabilidad

- **Historia:** [US-003](../../requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md), criterios AC-1 a AC-7.
- **Reglas:** BR-ACR-01 a BR-ACR-05, BR-ACR-07 a BR-ACR-13, BR-CAT-15, BR-CAT-17.
- **Conceptos (IMD-001):** Certificación, Evidencia, Requisito de evidencia, Rúbrica, Colaborador, Evaluador.
- **Actor:** [Evaluador](../../business/glossary/terms/TRM-0021-evaluador.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Decidir, con fundamento y dejando trazabilidad, si un colaborador alcanza un nivel de una competencia.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-003.1 | El colaborador, su rol asignado y el nivel que se evalúa en una competencia | BR-PRF-01; AC-1 |
| UXR-003.2 | El descriptor de la rúbrica para ese nivel | BR-CAT-15; AC-5 |
| UXR-003.3 | La lista de requisitos de evidencia de esa competencia y nivel, separando los "requerida" de los "deseada", con cuáles están cubiertos y cuáles faltan | BR-ACR-09, BR-ACR-12; AC-4, AC-6 |
| UXR-003.4 | Cada evidencia presentada: su categoría (formación, práctica evaluada, desempeño en proyecto) y, si es un entregable, el proyecto del que proviene | BR-ACR-01, BR-ACR-11 |
| UXR-003.5 | Las certificaciones anteriores del colaborador en esa competencia | BR-ACR-03; VIS-001:L76 |

## Acciones

| ID | El usuario puede… | Fuente |
|---|---|---|
| UXR-003.6 | Asociar a cada requisito, requerido o deseado, la evidencia que lo cumple | BR-ACR-07, BR-ACR-09, BR-ACR-12; AC-7 |
| UXR-003.7 | Certificar el nivel, con una confirmación explícita, que equivale a su firma | BR-ACR-02, BR-ACR-04 |

## Reglas que la interfaz debe hacer visibles

- La acción de certificar solo se habilita cuando cada requisito de evidencia "requerida" tiene una evidencia asociada (BR-ACR-09, BR-ACR-12). Si falta alguna requerida, la interfaz indica cuáles faltan.
- Los requisitos "deseada" no bloquean la certificación: la interfaz los presenta como opcionales (BR-ACR-12). Si deben mostrarse de algún modo especial en la certificación, depende de P-41.
- La certificación registra de forma automática quién certificó y cuándo; el evaluador no escribe esos datos (BR-ACR-03).
- En H1 no hay propuestas automáticas (BR-ACR-05). En H2 la plataforma propondrá certificar el nivel objetivo cuando las evidencias de un curso cumplan los requisitos requeridos (BR-ACR-14; P-07 respondida el 2026-09-27); esa propuesta necesitará la misma firma humana y no se diseña aquí. Quién la firma está abierto (P-07.4, P-49.2).
- La certificación registrada, con quién certificó, cuándo y con qué evidencias, la puede ver cualquier colaborador (BR-TRA-06; P-08 respondida el 2026-09-27). **Inferencia:** conviene que la confirmación de UXR-003.7 lo advierta. Si se muestran también calificaciones y el sustento del evaluador está abierto (P-54).

## Estados

- **Requisitos requeridos incompletos:** la certificación no está disponible.
- **Requeridos completos y deseados pendientes:** la certificación está disponible.
- **Competencia y nivel sin requisitos definidos:** posible porque la definición es progresiva (BR-CAT-17). La certificación **no está disponible** y la interfaz explica que primero hay que definir cómo se evidencia ese nivel (BR-ACR-13; P-39 respondida el 2026-09-27).
- **Certificación registrada:** se confirma y la certificación queda en el historial.
- **Sin permiso** y **error:** según UXR-000.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| ~~UXR-003-Q1~~ | ~~¿Cómo se incorpora una evidencia: se sube un archivo, se enlaza a Drive o GitLab, o se describe? No está definido~~ **Respondida (ianache, 2026-10-04):** las evidencias son referencias (URL) y una descripción, y las registra el colaborador (EVD-2026-0211, 0215). Subir archivos o enlazar a Drive no está definido. | Jefe de Ingeniería | Alta |
| ~~RCP-Q1~~ | ~~¿Quiénes son los evaluadores y cómo se les asigna una certificación? Define cómo llega el evaluador al caso~~ **Respondida (ianache, 2026-10-04):** los designa el Jefe de Ingeniería o ADMIN asignando el rol `evaluador`; cualquier usuario con él puede certificar a cualquier colaborador (EVD-2026-0189, 0199, 0200). | Jefe de Ingeniería | Alta |
| P-23 | ¿Se aceptan evidencias equivalentes? Define si hay una acción de "aceptar como equivalente". Parcialmente respondida el 2026-09-27: requeridas y deseadas (BR-ACR-12); la equivalencia sigue abierta **Respondida (2026-10-04):** no hay equivalencias, así que **no hay acción «aceptar como equivalente»** (EVD-2026-0202). | Jefe de Ingeniería | Media |
| ~~P-39~~ | ~~¿Se puede certificar un nivel sin requisitos de evidencia definidos?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no (BR-ACR-13). El estado "sin requisitos" bloquea la certificación | Jefe de Ingeniería | — |
| P-41 | ¿Cómo "refuerza" una evidencia deseada la certificación? Define si la certificación muestra algo distinto cuando las incluye **Respondida (2026-10-04):** la certificación no muestra nada distinto; las evidencias deseadas solo se registran y se ven (EVD-2026-0205). | Jefe de Ingeniería | Media |
| ~~P-14~~ | ~~¿Una certificación vence o se revoca? ¿Se puede recertificar hacia arriba o hacia abajo?~~ **Respondida (ianache, 2026-10-04):** las certificaciones no vencen; se revocan o se recertifican (EVD-2026-0185, 0190); no se certifica un nivel inferior (EVD-2026-0187). | Jefe de Ingeniería | Baja |
| ~~P-09~~ | ~~¿Un evaluador puede certificar a alguien de su equipo?~~ **Respondida (ianache, 2026-10-04):** la restricción del equipo se retiró; el rol `evaluador` basta (EVD-2026-0200). | Responsable de producto | Media |
| P-54 | ¿Las calificaciones y el sustento del evaluador son visibles para todos, o solo el resultado? **Respondida en parte (2026-10-04):** la descripción de una revocación es restringida (EVD-2026-0206); las calificaciones y el sustento son de cursos (H2). | Jefe de Ingeniería | Media |
| UXR-003-Q2 | ¿Quién inicia una certificación: el colaborador la solicita o el evaluador la abre? No está definido | Jefe de Ingeniería | Alta |

## Actualización del 2026-10-04 (decisiones EVD-2026-0185 a 0237)

**Qué cambia en lo que el evaluador ve y hace:**

| ID | Necesidad o acción | Fuente |
|---|---|---|
| UXR-003.8 | Ver cada evidencia presentada por el colaborador con su categoría, descripción y, si la tiene, su enlace (URL). Los enlaces de GitLab solo abren dentro de la organización o con VPN (EVD-2026-0207) | EVD-2026-0211, 0215 |
| UXR-003.9 | **Calificar cada pieza CUMPLE o NO CUMPLE** frente al requisito que intenta cumplir; un requisito se cumple si al menos una pieza está en CUMPLE | EVD-2026-0210, 0214, 0208; BR-ACR-19 |
| UXR-003.10 | **No aprobar**: registrar la evaluación no aprobada con un motivo tipificado (`REQUISITOS_NO_CUMPLIDOS`, `EVIDENCIA_INSUFICIENTE`, `EVIDENCIA_INVALIDA`, `OTRO`) y una descripción de 10 a 1000 caracteres | EVD-2026-0224, 0231, 0235, 0236 |
| UXR-003.11 | **Recertificar** una certificación vigente: exige evidencias nuevas, que no respaldaron la certificación reemplazada; la nueva reemplaza a la anterior | EVD-2026-0192, 0216, 0220 |
| UXR-003.12 | **Revocar** (solo Jefe de Ingeniería o ADMIN): motivo tipificado (`ERROR_DE_REGISTRO`, `EVIDENCIA_INVALIDA`, `REQUISITOS_NO_CUMPLIDOS`, `OTRO`) y una descripción de 10 a 1000 caracteres | EVD-2026-0191, 0194, 0195, 0196, 0201 |

**Reglas que la interfaz debe hacer visibles (además de las anteriores):**
- No hay equivalencias: solo se aceptan las evidencias que define el requisito (EVD-2026-0202); **no hay acción «aceptar como equivalente»**. Una misma evidencia puede respaldar varias competencias o niveles (EVD-2026-0204), y un requisito obligatorio se cumple con al menos una pieza (EVD-2026-0208).
- No se certifica un nivel inferior al vigente: la interfaz lo explica (EVD-2026-0187). Si ya hay una certificación vigente de ese nivel, se ofrece **recertificar** en lugar de certificar.
- La persona certificada debe ser un colaborador vigente (EVD-2026-0217).
- Cualquier usuario con el rol `evaluador` puede evaluar a cualquier colaborador: **no hay asignación previa** (EVD-2026-0199, 0200).
- Una evaluación no aprobada la ven el colaborador evaluado, el evaluador que la registró, el Jefe de Ingeniería y ADMIN; los demás no la ven (EVD-2026-0229, 0232).
- De una revocación todos ven el hecho, el motivo, quién y cuándo; la descripción solo la ven la persona certificada, los evaluadores, el Jefe de Ingeniería y ADMIN (EVD-2026-0206, 0209).
- Una certificación de nivel mayor o igual al exigido cumple lo que exige un Rol-Nivel (EVD-2026-0223): lo usa US-019, no esta pantalla.
- La persona certificada ve en la auditoría quién evaluó con su código de party; un usuario sin código se muestra solo con el nombre de su rol (EVD-2026-0222, 0226).

**Preguntas que siguen abiertas:**

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| UXR-003-Q2 | ¿Quién inicia una evaluación? Como cualquier evaluador puede evaluar a cualquier colaborador (sin asignación), se diseña que **el evaluador la abre** buscando al colaborador; la **solicitud del colaborador** no está definida | Jefe de Ingeniería | Alta |
| UXR-003-Q3 | **No hay una historia para que el colaborador registre sus evidencias** (EVD-2026-0215): US-003 solo describe al evaluador y US-004 es de lectura. Hace falta una historia nueva | Jefe de Ingeniería | Alta |
| UXR-003-Q4 | ¿Cómo se identifica al colaborador al buscarlo (nombre, correo, código)? No está definido | Jefe de Ingeniería | Media |
