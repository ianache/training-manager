---
type: UX Requirement
title: "UXR-016 — Actualizar datos y medios de contacto"
description: "Requisitos UX para que Jefe de Ingeniería corrija datos y Colaborador auto-edite perfiles."
tags: [ux-requirement, party, party-data, contactos, vigencia]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-10-01T00:00:00-05:00"
sources:
  - id: us-016
    resource: /knowledge-base/requirement/user-stories/US-016-actualizar-datos-y-contactos.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: br-party
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md#BR-PTY-09-BR-PTY-17
---

# UXR-016 — Actualizar datos y medios de contacto

## Requirements

### Actors & Permissions

**Actor 1: Jefe de Ingeniería** (Full Edit Authority)
- Can edit: nombres, apellidos, nombre preferido, tipoIdentificacion, numeroIdentificacion, paisIdentificacion
- Can edit: correoLaboral, numeroTelefonico, perfilesProf
- Rule: All edits are audited (quién, cuándo)
- Rule: Can close old vigencias and open new ones (BR-PTY-12)

**Actor 2: Colaborador** (Self-Edit Authority)
- Can edit: ONLY perfilesProf + numeroTelefonico
- Cannot: touch nombres, apellidos, identificación, correo laboral
- Rule: Can only edit own record
- Decision: D8, D11 (colaborador autonomía)

### Key Flows

**Flow 1: Jefe de Ingeniería edita datos simples**
1. Abre ficha de persona
2. Click "Editar datos"
3. Form aparece con campos: nombres, apellidos, nombre preferido, tipo/número/país identificación
4. Edita campo(s)
5. Click "Guardar"
6. Sistema registra cambio con auditoría (quién, cuándo)
7. Retorna a vista de ficha actualizada

**Flow 2: Jefe de Ingeniería cambia medios de contacto (con vigencia)**
1. Abre ficha → "Editar contactos"
2. Form muestra: correoLaboral (actual vigente), numeroTelefonico (actual vigente)
3. Ingresa nuevo correo/teléfono
4. Click "Guardar"
5. Sistema CIERRA vigencia anterior (fecha_hasta = hoy)
6. Sistema ABRE vigencia nueva (fecha_desde = hoy, fecha_hasta = NULL)
7. Historial preservado (BR-PTY-12)

**Flow 3: Colaborador edita sus perfiles profesionales**
1. Usuario abre su propio perfil
2. Click "Editar perfiles profesionales"
3. Form muestra lista de plataformas (GitHub, LinkedIn, Twitter, etc.)
4. Ingresa URL del perfil
5. Click "Agregar"
6. Perfil se agrega a su ficha (vigente)
7. Puede eliminar perfil existente

**Flow 4: Colaborador edita su teléfono laboral**
1. Usuario abre su propio perfil
2. Click "Editar teléfono laboral"
3. Form muestra: numeroTelefonico actual
4. Ingresa nuevo número
5. Click "Guardar"
6. Sistema CIERRA vigencia anterior
7. Sistema ABRE vigencia nueva con nuevo número

### Acceptance Criteria (Elaborated)

**AC-1: Corregir un dato simple**
- [ ] Jefe puede abrir modal/form de edición
- [ ] Puede editar: nombres, apellidos, nombre preferido
- [ ] Campo validado (minLength, no caracteres especiales, etc.)
- [ ] Click "Guardar" persiste cambio
- [ ] Auditoría registra: "Jefe modificó [campo] de [persona] el [fecha hora]"
- [ ] Ficha actual muestra dato corregido
- [ ] Historial preservado (si existe versión anterior)

**AC-2: Cambiar medio de contacto con vigencia**
- [ ] Jefe puede editar: correoLaboral, numeroTelefonico
- [ ] Vigencia anterior se cierra automáticamente (fecha_hasta = today)
- [ ] Vigencia nueva se abre (fecha_desde = today, fecha_hasta = NULL)
- [ ] Error si nuevo email/teléfono duplicado → mostrar "Ya en uso por [persona]"
- [ ] Historial muestra ambas vigencias (old closed, new open)
- [ ] Auditoría: "Cambio vigencia de [campo]"

**AC-3: Colaborador edita perfiles profesionales**
- [ ] Colaborador puede ver form "Mis perfiles profesionales"
- [ ] Dropdown de plataformas: GitHub, LinkedIn, Twitter, etc.
- [ ] Ingresa URL (validar formato)
- [ ] Click "Agregar" → aparece en lista
- [ ] Puede eliminar perfil existente (click "Eliminar")
- [ ] Solo ve/edita sus propios perfiles
- [ ] No acceso a perfiles de otros

**AC-4: Colaborador edita teléfono laboral**
- [ ] Colaborador accede a "Editar teléfono laboral"
- [ ] Form muestra número actual (para referencia)
- [ ] Ingresa nuevo número (validar formato: +51 999 999 999)
- [ ] Anterior vigencia se cierra
- [ ] Nueva vigencia se abre
- [ ] Historial preservado

### Data Validation Rules

| Field | Type | Required | Validator | Error Message |
|-------|------|----------|-----------|----------------|
| nombres | text | YES | minLength(2), noSpecialChars | "Mínimo 2 caracteres, sin caracteres especiales" |
| apellidos | text | YES | minLength(2), noSpecialChars | "Mínimo 2 caracteres, sin caracteres especiales" |
| nombrePreferido | text | NO | maxLength(50) | "Máximo 50 caracteres" |
| correoLaboral | email | YES (if editing) | email, uniqueActive | "Formato inválido" / "Correo ya en uso" |
| numeroTelefonico | tel | YES (if editing) | pattern(^+51\d{9}$) | "Formato: +51 999999999" |
| urlPerfil | url | YES (for profiles) | isValidURL | "URL inválida" |

### Permission & Security Rules

- Colaborador CAN ONLY view/edit own record (enforce by user_id)
- Jefe CAN view/edit anyone (enforce by role JEFE_INGENIERIA)
- Audit trail MUST record: user_id, action, timestamp, old_value, new_value
- No soft-delete on vigencias (preserve history per BR-PTY-12)
- Email/phone changes trigger notification? (OPEN QUESTION)

### Accessibility Requirements

- WCAG 2.2 AA compliance (mandatory)
- Form labels linked to inputs (aria-label / htmlFor)
- Error messages: role="alert", aria-live="polite"
- Keyboard navigation: Tab order, Enter to submit
- Focus visible on all interactive elements (2px outline)
- Color contrast: 4.5:1 text, 3:1 graphics

### Open Questions

1. **Notification on contact change:** Should system notify Colaborador or Jefe when contact updated?
2. **Profile deletion:** Should deleted profiles be soft-deleted (preserve history) or hard-deleted?
3. **Bulk edit:** Can Jefe edit multiple personas at once, or one-at-a-time only?
4. **Vigencia dates:** When Jefe closes vigencia and opens new, should it be same day or allow different dates?
5. **History view:** Should there be a "View history" section showing all past vigencias?

---

## Traceability

- **Upstream:** US-016 → SPEC-001:C2 → BR-PTY-09, BR-PTY-12, BR-PTY-17
- **Downstream:** FLW-016 (flows), SCR-016 (screens)
- **Decisions:** D8 (self-edit), D11 (Jefe authority)
- **Accessibility:** UXR-000 (WCAG 2.2 AA)

## Definition of Done

✅ All AC elaborated with examples  
✅ Validation rules enumerated  
✅ Open questions identified (5 total)  
✅ Traceability to US + SPEC + Rules  
✅ Ready for user-flow-designer

