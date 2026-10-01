---
type: User Flow
title: "FLW-016 — Actualizar datos y medios de contacto"
description: "Happy paths y excepciones para edición de datos por Jefe y auto-edición de Colaborador."
tags: [user-flow, party, data-maintenance, vigencia, permissions]
status: draft
generated:
  by: "user-flow-designer/1.0"
  at: "2026-10-01T00:00:00-05:00"
sources:
  - id: uxr-016
    resource: /knowledge-base/design/ux-requirements/UXR-016-actualizar-datos-y-contactos.md
---

# FLW-016 — Actualizar datos y medios de contacto

## Flow 1: Jefe edita datos simples

**Actor:** Jefe de Ingeniería  
**Goal:** Corregir nombres, apellidos, o identificación de una persona  
**Precondition:** Persona registrada en sistema

```
START
  ↓
[Jefe abre lista de Colaboradores]
  ↓
[Busca persona]
  ↓
[Click en nombre → abre ficha]
  ↓
[Click "Editar datos"]
  ↓
FORM APPEARS: nombres, apellidos, nombrePreferido, tipoIdentificacion, numeroIdentificacion, paisIdentificacion
  ↓
[Ingresa corrección]
  ↓
VALIDATION:
  - ✓ Si datos válidos → habilitado botón "Guardar"
  - ✗ Si datos inválidos → campo rojo + error message
  ↓
[Click "Guardar"]
  ↓
BACKEND:
  1. Valida permisos (solo Jefe)
  2. Persiste cambio
  3. Registra auditoría
  ↓
SUCCESS SCREEN: "Datos actualizados" + vuelve a ficha
  ↓
END

EXCEPTIONS:
E1: No autorizado
  - Error: "No tienes permiso para editar esta persona"
  - Action: Mostrar botón "Solicitar acceso"
  
E2: Datos inválidos
  - Error message en campo rojo (real-time)
  - Submit deshabilitado
  
E3: Perso anonimizada
  - Error: "No se puede editar persona anonimizada"
  - Action: Bloquear acceso
```

---

## Flow 2: Jefe cambia medios de contacto (con vigencia)

**Actor:** Jefe de Ingeniería  
**Goal:** Actualizar correo laboral o teléfono, preservando historial  
**Precondition:** Persona con vigencia activa

```
START
  ↓
[Abre ficha de persona]
  ↓
[Click "Editar contactos"]
  ↓
FORM APPEARS:
  - correoLaboral (current vigente) [read-only badge "Vigente"]
  - nuevoCorreoLaboral [input, placeholder: "ej. newemail@comsatel.com.pe"]
  - numeroTelefonico (current vigente) [read-only badge "Vigente"]
  - nuevoNumeroTelefonico [input, placeholder: "+51 999 999 999"]
  ↓
[Ingresa al menos 1 cambio]
  ↓
VALIDATION (real-time):
  - Email: formato email + uniqueActive (check async)
  - Teléfono: formato +51XXXXXXXXX
  ↓
VALIDATION RESULT:
  - ✓ Nuevo email válido y único → "✓ Email disponible"
  - ✗ Email duplicado → "✗ Ya en uso por [persona]"
  ↓
[Click "Guardar"]
  ↓
BACKEND:
  1. Valida permisos
  2. Para cada campo nuevo:
     a. Cierra vigencia anterior (fecha_hasta = TODAY)
     b. Abre vigencia nueva (fecha_desde = TODAY)
  3. Registra auditoría
  ↓
CONFIRMATION:
  - Modal: "Contactos actualizados"
  - Muestra: old→new (correo X → Y, tel X → Y)
  ↓
[Click OK]
  ↓
Retorna a ficha (muestra nuevos contactos, historial accesible)
  ↓
END

EXCEPTIONS:
E1: Email/teléfono duplicado
  - Real-time error: "✗ [Email/Teléfono] ya en uso por [persona]"
  - Submit deshabilitado
  
E2: Formato inválido
  - Real-time error: "Formato: +51 999999999"
  - Submit deshabilitado
  
E3: No hay cambios
  - Submitbutton disabled ("Ingresa al menos 1 cambio")
  
E4: Vigencia incierta (OPEN)
  - Question: ¿Permitir cambiar fecha_desde/fecha_hasta, o siempre TODAY?
  - Current: Siempre TODAY (simple)
```

---

## Flow 3: Colaborador edita perfiles profesionales

**Actor:** Colaborador (auto-edición)  
**Goal:** Agregar, editar, eliminar perfiles profesionales  
**Precondition:** Usuario autenticado como Colaborador

```
START (Usuario en su propio perfil)
  ↓
[Click "Editar perfiles profesionales"]
  ↓
CURRENT STATE:
  - Lista de perfiles existentes (si hay)
  - Botón "+ Agregar perfil"
  ↓
[Click "+ Agregar perfil"]
  ↓
FORM APPEARS:
  - Dropdown "Plataforma": [GitHub, LinkedIn, Twitter, Gitlab, Otros]
  - Input "URL": [text input con placeholder: "https://github.com/username"]
  ↓
[Selecciona plataforma]
  ↓
[Ingresa URL]
  ↓
VALIDATION (real-time):
  - isValidURL: ✓ o ✗
  - Si plataforma conocida: valida dominio (github.com, linkedin.com, etc.)
  ↓
[Click "Agregar"]
  ↓
BACKEND:
  1. Valida URL
  2. Verifica permisos (solo puede agregar a su propio perfil)
  3. Crea entrada en perfilesProf (vigente)
  4. Registra auditoría
  ↓
SUCCESS:
  - Perfil nuevo aparece en lista
  - Muestra: [GitHub] https://github.com/username [Eliminar]
  ↓
[Usuario puede agregar más o click "Guardar"]
  ↓
END

DELETE PROFILE:
  [Click "Eliminar" en perfil existente]
    ↓
  Confirmación: "¿Eliminar perfil GitHub?"
    ↓
  [Click "Eliminar"]
    ↓
  Perfil desaparece de lista (soft-delete? OPEN QUESTION)
    ↓
  Auditoría registra eliminación

EXCEPTIONS:
E1: URL inválida
  - Real-time error: "URL inválida"
  - Submit deshabilitado
  
E2: Dominio no coincide plataforma
  - Warning: "¿La URL es de GitHub? (detectamos dominio X)"
  - Allow to proceed or correct
  
E3: Acceso denegado
  - Error: "No puedes editar perfiles de otra persona"
  - (Enforce by user_id check)
```

---

## Flow 4: Colaborador edita teléfono laboral

**Actor:** Colaborador (auto-edición)  
**Goal:** Cambiar su propio teléfono laboral  
**Precondition:** Usuario autenticado como Colaborador

```
START (Usuario en su propio perfil)
  ↓
[Click "Editar teléfono laboral"]
  ↓
CURRENT STATE:
  - numeroTelefonico vigente [read-only badge "Vigente"]
  - Badge: "Abierto desde [fecha]"
  ↓
FORM APPEARS:
  - Nuevo teléfono [input, placeholder: "+51 999 999 999"]
  ↓
[Ingresa nuevo número]
  ↓
VALIDATION (real-time):
  - Pattern: ^+51\d{9}$
  - Si válido: ✓ "Formato correcto"
  - Si inválido: ✗ "Formato: +51 999 999 999"
  ↓
[Click "Guardar"]
  ↓
BACKEND:
  1. Valida formato
  2. Verifica permisos (solo Colaborador puede editar propio teléfono)
  3. Cierra vigencia anterior
  4. Abre vigencia nueva con nuevo número
  5. Registra auditoría
  ↓
CONFIRMATION:
  - Modal: "Teléfono actualizado"
  - Muestra: +51 XXX XXX XXX → +51 YYY YYY YYY
  ↓
[Click OK]
  ↓
Retorna a ficha (muestra nuevo teléfono, historial accesible)
  ↓
END

EXCEPTIONS:
E1: Formato inválido
  - Real-time error: "Formato: +51 999 999 999"
  - Submit deshabilitado
  
E2: Sin cambios
  - Si nuevo teléfono = actual → info: "El teléfono es igual al actual"
  - Submit deshabilitado
  
E3: Acceso denegado
  - Error: "No puedes editar teléfono de otra persona"
  - (Enforce by user_id)
```

---

## States & Permissions

**Estados de datos:**
- Vigente: fecha_desde ≤ TODAY ≤ fecha_hasta (NULL)
- Histórico: fecha_hasta < TODAY (closed)
- Pendiente: fecha_desde > TODAY (future - if allowed)

**Permisos:**
- Jefe: CAN edit any person (full fields)
- Colaborador: CAN edit self (perfiles + teléfono only)
- Otros: NO access (error E1)

**Auditoría:**
- Todos los cambios registran: user_id, action, timestamp, old_value, new_value

---

## Traceability

- **Upstream:** UXR-016 → US-016
- **Downstream:** SCR-016 (screen specs for each flow)
- **Dependencies:** US-015 (persona debe existir), Vigencia model (BR-PTY-12)
- **Permissions:** D8 (auto-edit), D11 (Jefe authority)

## Definition of Done

✅ 4 happy paths defined (Jefe datos, Jefe contactos, Colaborador perfiles, Colaborador teléfono)  
✅ Exception paths enumerated (duplicates, invalid format, permissions, edge cases)  
✅ Vigencia handling explicit (close old, open new)  
✅ Auditoría trail specified  
✅ Open questions identified  
✅ Ready for ui-spec-writer → SCR-016

