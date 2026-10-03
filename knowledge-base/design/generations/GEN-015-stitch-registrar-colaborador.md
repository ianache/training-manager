---
type: Stitch Generation
title: "GEN-015 — Diseño Stitch: Registrar un colaborador"
description: "Prompts y variantes para generar UI en Google Stitch basado en SCR-015."
tags: [ux-ui, stitch, generation, party, h1, administracion]
status: draft
generated:
  by: "stitch-ui-generator/1.0"
  at: "2026-09-30T00:00:00-05:00"
sources:
  - id: scr-015
    resource: /knowledge-base/design/screens/SCR-015-registrar-un-colaborador.md
  - id: flw-015
    resource: /knowledge-base/design/user-flows/FLW-015-registrar-un-colaborador.md
  - id: uxr-015
    resource: /knowledge-base/design/ux-requirements/UXR-015-registrar-un-colaborador.md
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
---

> **Decisión de `human:ianache` (2026-10-02): se usan los componentes `gf-*` de `@gf/ui`, no Angular Material.** Las referencias `mat-*` de este documento son históricas; el equivalente vigente está en el [catálogo atómico](../components/dtc-015/atomic-component-catalog.md) (`gf-text-input`, `gf-select`, `gf-autocomplete`, `gf-date-input`, …). No se reescribe el detalle: no implementar con Material.

# GEN-015 — Diseño Stitch: Registrar un colaborador

## Trazabilidad

- **Especificación de pantallas:** [SCR-015](../screens/SCR-015-registrar-un-colaborador.md) (10 pantallas)
- **Flujo de usuario:** [FLW-015](../user-flows/FLW-015-registrar-un-colaborador.md)
- **Requisitos UX:** [UXR-015](../ux-requirements/UXR-015-registrar-un-colaborador.md)
- **Estándares:** UXR-000 (accesibilidad WCAG 2.2 AA, estados de interfaz)
- **Accesibilidad:** WCAG 2.2 AA (teclado, foco, contraste, nombres accesibles)

## Decisiones de diseño

### Design System (Referencia)

- **Plataforma:** Google Stitch
- **Framework frontend:** Angular 22 (shell + microUIs, ADR-001)
- **Colores:** Por definir (usar paleta neutra de Material Design 3 como base)
- **Tipografía:** Material Design 3 (Roboto para cuerpo, Roboto Flex para headings)
- **Espaciado:** 8px base (multiples: 8, 16, 24, 32, 48, 64)
- **Componentes base:** Material Angular (mat-form-field, mat-select, mat-input, mat-button, mat-radio-group, mat-datepicker)
- **Iconografía:** Material Icons (Google)
- **Breakpoints:** Desktop (1920, 1440), Tablet (768), Mobile (375)
- **A11y:** Material Angular incluye accesibilidad nativa (aria-*, role, keyboard)

### Variantes de pantalla

**Contexto:** 
- Actor: Jefe de Ingeniería
- Flujo: Empleado (5 pasos + revisar + éxito) vs. Contratista (4 pasos + revisar + éxito)
- Estados: normal, loading, error, success

---

## Especificación por pantalla

### 1. SCR-015-01: Seleccionar tipo de colaborador

**Propósito:** Elegir Empleado o Contratista

**Prompt para Stitch:**

```
Title: "Registrar un colaborador"
Subtitle: "¿Qué tipo de colaborador deseas registrar?"

Layout: Single column, centered

Components:
  - Radio Group (name="tipoColaborador")
    - Option 1:
      - Label: "Empleado"
      - Description: "Trabajador de COMSATEL con: • Unidad organizacional • Jefe directo • Correo @comsatel.com.pe"
      - Value: "empleado"
    - Option 2:
      - Label: "Contratista"
      - Description: "Trabajador externo con: • Relación de contratación • Proveedor • Correo del proveedor"
      - Value: "contratista"
    - State: Unselected (initial), Selected (after interaction)

Actions:
  - [Siguiente] (enabled after selection, primary button)
  - [Cancelar] (always enabled, secondary button)

Accessibility:
  - <fieldset> + <legend> for radio group
  - aria-describedby on legend pointing to description
  - Keyboard: Tab to group, Arrow keys to select, Enter to confirm
  - Focus outline visible (2px, high contrast)
  - Color contrast: 4.5:1 (text), 3:1 (graphics)
```

**Variantes:**
- `tipo-sin-seleccionar`: state inicial, botón Siguiente disabled
- `tipo-empleado-seleccionado`: empleado seleccionado
- `tipo-contratista-seleccionado`: contratista seleccionado

---

### 2. SCR-015-02 & 03: Datos persona + Identificación

**Propósito:** Capturar nombres, apellidos, nombre preferido, identificación

**Prompt para Stitch:**

```
Title: "Registrar un colaborador"
Subtitle: "Paso 1 de 5: Datos de la persona"

Layout: Single column, form

Components:
  Form Section 1: Datos de la persona
    - Text Input (name="nombres", required=true)
      - Label: "Nombres *"
      - Placeholder: "ej. Juan Carlos"
      - aria-required="true"
      - State: normal, focused, filled, error (red border + message)
    
    - Text Input (name="apellidos", required=true)
      - Label: "Apellidos *"
      - Placeholder: "ej. Pérez García"
      - aria-required="true"
      - State: normal, focused, filled, error
    
    - Text Input (name="nombrePreferido", required=false)
      - Label: "Nombre preferido (opcional)"
      - Placeholder: "ej. J.C."
      - Help text: "Si el usuario prefiere un nombre corto o un apodo, indícalo."
      - State: normal, focused, filled

  Form Section 2: Identificación
    - Select Dropdown (name="tipoIdentificacion", required=true)
      - Label: "Tipo de identificación *"
      - Options: ["DNI", "Carné de extranjería", "Pasaporte"]
      - aria-required="true"
      - State: normal, focused, open, error
    
    - Text Input (name="numeroIdentificacion", required=true)
      - Label: "Número *"
      - aria-required="true"
      - Pattern validation for number format
      - State: normal, focused, filled, validating, valid (✓), error (✗)
    
    - Select Dropdown (name="paisIdentificacion", required=true)
      - Label: "País emisor *"
      - Options: ["Perú", "Colombia", "Argentina", ...] (alphabetical)
      - aria-required="true"
      - State: normal, focused, open
    
    - Validation Message (real-time)
      - When user leaves "numeroIdentificacion" field:
      - If not duplicate: "✓ Identificación válida"
      - If duplicate: "✗ La identificación {tipo} {número} ({país}) ya está registrada."
      - aria-live="polite", role="status"

Actions:
  - [Siguiente] (primary button, enabled when required fields filled)
  - [Atrás] (secondary button)

Accessibility:
  - Tab order: nombres → apellidos → nombrePreferido → tipoIdentificacion → numeroIdentificacion → paisIdentificacion
  - Error messages in <fieldset> with aria-invalid="true"
  - Focus management on error: focus returns to first invalid field
  - Keyboard only: Select dropdown uses Arrow keys to navigate, Enter to select
```

**Variantes:**
- `persona-form-vacio`: estado inicial
- `persona-form-llenando`: algunos campos completos
- `persona-form-id-validando`: esperando validación de duplicados
- `persona-form-id-valida`: identificación única confirmada
- `persona-form-id-duplicada`: error de identificación duplicada (AC-5)
- `persona-form-error-falta-datos`: faltan campos obligatorios (E9)

---

### 3. SCR-015-04: Correo laboral

**Prompt para Stitch:**

```
Title: "Registrar un colaborador"
Subtitle: "Paso 2/3 de 5: Correo laboral"

Layout: Single column, form

Components:
  - Text Input (name="correoLaboral", type="email", required=true)
    - Label: "Correo laboral *"
    - Placeholder: "ejemplo@comsatel.com.pe"
    - aria-required="true"
    - aria-describedby="ayuda-correo"
    
  - Help text (id="ayuda-correo")
    - "Para empleados de COMSATEL, usa tu correo corporativo (@comsatel.com.pe).
      Para contratistas, usa el correo del proveedor."
    - Small text, secondary color
  
  - Validation Message (real-time, as user types)
    - Valid format: HTML5 <input type="email"> validates
    - Valid & not duplicate: "✓ Correo válido"
    - Duplicate (among active collaborators): "✗ El correo {correo} ya está en uso por otro colaborador vigente." (E6)
    - aria-live="polite"

Actions:
  - [Siguiente] (enabled when valid email & not duplicate)
  - [Atrás]

Accessibility:
  - aria-describedby linking to help text
  - aria-invalid="true" on error
  - Focus outline
  - High contrast in error message
```

**Variantes:**
- `correo-form-vacio`
- `correo-form-llenando`
- `correo-form-validando`
- `correo-form-valido`
- `correo-form-duplicado`: error AC-6 (E6)
- `correo-form-formato-invalido`

---

### 4. SCR-015-05: Unidad (Empleado) o Proveedor (Contratista)

**Prompt para Stitch:**

```
Title: "Registrar un colaborador"
Subtitle (Empleado): "Paso 3 de 5: Unidad organizacional"
Subtitle (Contratista): "Paso 3 de 4: Proveedor"

Layout: Single column, form

Components (EMPLEADO → UNIDAD):
  - Combobox (name="unidad", required=true)
    - Label: "Unidad *"
    - Placeholder: "Buscar unidad..."
    - aria-required="true"
    - aria-autocomplete="list"
    - aria-expanded="false" (then "true" when open)
    - aria-controls="unidad-listbox"
    - aria-owns="unidad-listbox"
    
    - List items (role="listbox", id="unidad-listbox")
      - When empty: "No hay unidades registradas. Crea una primero (US-017)." (E2)
      - When loading: Spinner + "Buscando unidades..."
      - When results: 
        - Item 1: "Ingeniería (COMSATEL > Ing)" (role="option")
        - Item 2: "Operaciones (COMSATEL > Op)"
        - Item 3: "Finanzas (COMSATEL > Fin)"
      - Keyboard: Arrow keys navigate, Enter selects, Escape closes
    
    - Selected value display below:
      - "[Seleccionada: Ingeniería]" (gray text, smaller font)

Components (CONTRATISTA → PROVEEDOR):
  - Combobox (name="proveedor", required=true)
    - Label: "Proveedor *"
    - Placeholder: "Buscar proveedor..."
    - Same structure as Unidad but with:
      - When empty: "No hay proveedores registrados. Crea uno primero (US-018)." (E3)
      - Items: "Accenture Perú", "Telefónica Tech", "IBM Latinoamérica"

Actions:
  - [Siguiente] (enabled when unit/provider selected)
  - [Atrás]

Accessibility:
  - ARIA Combobox pattern (APG)
  - aria-invalid on error
  - aria-live="polite" for results
  - Focus management: focus stays in input while list open
  - Keyboard: Ctrl+A to focus list (after typing), Escape to close
```

**Variantes:**
- `unidad-form-vacio`: sin buscar
- `unidad-form-buscando`: loading state
- `unidad-form-resultados`: lista de unidades (3 opciones)
- `unidad-form-seleccionada`: una unidad elegida
- `unidad-form-sin-opciones`: E2 (no hay unidades)
- `proveedor-form-*`: idénticas variantes para contratista

---

### 5. SCR-015-06: Jefe directo (Empleado solo)

**Prompt para Stitch:**

```
Title: "Registrar un colaborador (Empleado)"
Subtitle: "Paso 4 de 5: Jefe directo"

Layout: Single column, form

Components:
  - Combobox (name="jefeDirecto", required=true)
    - Label: "Jefe directo *"
    - Placeholder: "Buscar colaborador..."
    - aria-required="true"
    - Filters: only active collaborators (vigentes)
    
    - List items (when results):
      - "Juan Pérez (Jefe de Proyecto)"
      - "María García (Gerente Ingeniería)"
      - "Carlos López (Director)"
    
    - Help text: "Solo colaboradores vigentes pueden ser jefe directo."
  
  - Selected value:
    - "[Seleccionado: Juan Pérez]"

Actions:
  - [Siguiente]
  - [Atrás]

Accessibility:
  - ARIA Combobox pattern
  - aria-describedby on help text
  - aria-invalid on error (E7 if manager not active)
```

**Variantes:**
- `jefe-form-vacio`
- `jefe-form-buscando`
- `jefe-form-resultados`
- `jefe-form-seleccionado`
- `jefe-form-no-vigente`: E7 (manager no longer active)

---

### 6. SCR-015-07: Rol-Nivel inicial (ambos tipos)

**Prompt para Stitch:**

```
Title: "Registrar un colaborador"
Subtitle: "Paso 5/4 de 5: Rol-Nivel inicial"

Layout: Single column, form

Components:
  - Select Dropdown (name="rol", required=true)
    - Label: "Rol *"
    - Placeholder: "Selecciona rol..."
    - aria-required="true"
    - aria-controls="nivel-select" (linked to nivel dropdown)
    - Options: ["Developer", "QA", "Product Manager", "Designer UX", ...]
    - State: normal, focused, open, error (E4 if empty)
    - When empty catalog: Message "No hay roles vigentes en el catálogo. Crea el catálogo primero (US-001)." (E4)
    - On change: Reset nivel dropdown + filter nivel options by selected rol
  
  - Select Dropdown (name="nivel", required=true, id="nivel-select")
    - Label: "Nivel inicial *"
    - Placeholder: "Selecciona nivel..."
    - aria-required="true"
    - aria-describedby="info-nivel"
    - Options: Dynamic, filtered by rol
      - (Example for Developer): ["Developer Junior (Nivel 1)", "Developer Mid (Nivel 2)", "Developer Senior (Nivel 3)"]
    - Only levels with evidence requirements are shown (BR-ACR-13)
    - State: normal, focused, open, error (E8 if invalid)
  
  - Info text (id="info-nivel")
    - "ⓘ Solo niveles con requisitos de evidencia definidos están disponibles."
    - Small text, secondary color, info icon
  
  - Date Input (name="fechaDesde", type="date", required=true)
    - Label: "Vigente desde *"
    - Default value: Today (editable)
    - aria-required="true"
    - Picker or text input (YYYY-MM-DD format)
  
  - Validation:
    - If nivel selected but has no evidence requirements (BR-ACR-13):
      - Show error: "El nivel seleccionado no tiene requisitos de evidencia definidos. Elige otro." (E8)
    - If rol changed: Reset nivel (warn if nivel was already selected)

Actions:
  - [Siguiente] (enabled when rol + nivel + fecha valid)
  - [Atrás]

Accessibility:
  - aria-controls linking rol → nivel
  - aria-describedby on nivel input
  - aria-invalid on error
  - Keyboard: Tab through, Arrow keys in dropdowns
  - Focus management: If rol changes, focus moves to nivel dropdown after filtering
```

**Variantes:**
- `rol-nivel-form-vacio`: initial state
- `rol-nivel-form-rol-seleccionado`: rol chosen, nivel options filtered
- `rol-nivel-form-nivel-seleccionado`: both rol and nivel chosen
- `rol-nivel-form-sin-roles`: E4 (empty catalog)
- `rol-nivel-form-nivel-invalido`: E8 (no evidence requirements)
- `rol-nivel-form-completo`: all fields valid

---

### 7. SCR-015-08: Revisar y confirmar

**Prompt para Stitch:**

```
Title: "Registrar un colaborador"
Subtitle: "Paso Final: Revisar y confirmar"

Layout: Two column (left: summary, right: actions)

Components:
  Summary Section (read-only):
    - "Revisa los datos antes de registrar:"
    
    - Row 1: Label "Tipo de colaborador:" Value "Empleado"
    - Row 2: Label "Datos de la persona:" Value "Juan Carlos Pérez García (Nombre preferido: J.C.)"
    - Row 3: Label "Identificación:" Value "DNI 12345678 (Perú)"
    - Row 4: Label "Correo laboral:" Value "juan.perez@comsatel.com.pe"
    - Row 5: Label "Unidad:" Value "Ingeniería" [for empleado]
           OR Label "Proveedor:" Value "Accenture Perú" [for contratista]
    - Row 6: Label "Jefe directo:" Value "María García Sánchez" [empleado only]
    - Row 7: Label "Rol-Nivel inicial:" Value "Developer Junior (Nivel 1)"
    - Row 8: Label "Vigente desde:" Value "2026-09-30"
    
    - Layout: Definition list (<dl>, <dt>, <dd>) for accessibility
    
  Edit Link:
    - "[Editar] (vuelve a paso anterior)" (small link, editable=true)
  
Actions Section:
  - [Guardar] (primary button, full width, large)
    - On click: Show loading spinner
    - Validate all fields again
    - On error: Show E5-E10 error states (from FLW-015)
    - On success: Navigate to SCR-015-09 (éxito)
  
  - [Cancelar] (secondary button, full width)
    - Confirm: "¿Descartar los cambios?"
    - If yes: Return to inicio (clear form)

Accessibility:
  - <dl> semantic structure for summary
  - aria-label on [Guardar] button: "Registrar colaborador"
  - Loading state: aria-busy="true", aria-label="Guardando..."
  - Focus management: Focus moves to [Guardar] after user enters review screen
```

**Variantes:**
- `revisar-form-empleado`: all employee fields
- `revisar-form-contratista`: contratista fields (no jefe directo)
- `revisar-form-guardando`: loading state (spinner, buttons disabled)
- `revisar-form-error`: error message shown (E5-E10)

---

### 8. SCR-015-09: Éxito

**Prompt para Stitch:**

```
Title: "Registrar un colaborador"
Subtitle: "✓ ¡Colaborador registrado!"

Layout: Centered, success state

Components:
  Success Icon:
    - Large checkmark (✓) icon, green color (semantic success)
    - aria-label="Éxito"
  
  Title:
    - "¡Colaborador registrado!" (h2, large)
  
  Code Section:
    - Label: "Código de colaborador (único):"
    - Code Display (monospace, read-only field):
      - "a3b2c5d4-e7f1-4a2b-8c3d-9e4f5a6b7c8d" (GUID generated)
      - Background: light gray
      - Padding: 16px
      - Border: 1px solid gray
    
    - [Copiar] button (right side of code field)
      - On click: Copy to clipboard, show toast "Copiado" (2s timeout)
      - aria-label="Copiar código de colaborador"
  
  Help text:
    - "Puedes usar este código para referencia o comunicación."
  
  Next Actions Section:
    - "¿Qué deseas hacer ahora?"
    - Three options (buttons):
      - [Registrar otro colaborador] (primary)
        - On click: Reset form, go to SCR-015-01
      - [Volver a la lista] (secondary)
        - On click: Navigate to party-list view (US-016)
      - [Ir al dashboard] (tertiary)
        - On click: Navigate to home/dashboard

Audit:
  - System logs: user (current), timestamp (now), action "registrar-colaborador"
  - (Not visible in UI, but logged)

Accessibility:
  - Success announced with role="status" aria-live="assertive"
  - Code field is focusable, selectable (for copy)
  - [Copiar] button keyboard accessible
  - Focus moves to code field after success
  - Toast notification: aria-live="polite"
```

**Variantes:**
- `exito-form-codigo-mostrado`: initial state (code visible, ready to copy)
- `exito-form-codigo-copiado`: after [Copiar] click (button shows "✓ Copiado" 2s)

---

### 9. Error States (SCR-015-10)

**Prompt para Stitch (Por excepción):**

```
# Error States (E1-E11)

E1: Sin permisos
  Container: Full page overlay
  Message: "No tienes permiso para registrar colaboradores. Solo el Jefe de Ingeniería puede hacerlo."
  Icon: Lock icon
  Action: [Volver]
  aria-label="Error: sin permisos"

E2: Sin unidades (Empleado)
  Container: SCR-015-05 (Unidad field)
  Message: "No hay unidades registradas. Crea una primero (US-017)."
  Style: Empty state with icon
  Action: [Crear unidad] or [Volver]

E3: Sin proveedores (Contratista)
  Container: SCR-015-05 (Proveedor field)
  Message: "No hay proveedores registrados. Crea uno primero (US-018)."
  Action: [Crear proveedor] or [Volver]

E4: Sin roles en catálogo
  Container: SCR-015-07 (Rol dropdown)
  Message: "No hay roles vigentes en el catálogo. Crea el catálogo primero (US-001)."
  Action: [Crear catálogo] or [Volver]

E5: Identificación duplicada (AC-5)
  Container: SCR-015-03 (Identificación field)
  Message: "La identificación {tipo} {número} ({país}) ya está registrada."
  Icon: ✗ (red X)
  Color: Red border on field
  aria-invalid="true"
  aria-describedby pointing to error message
  On blur: Validation triggered (real-time)

E6: Correo duplicado entre vigentes (AC-6)
  Container: SCR-015-04 (Correo field)
  Message: "El correo {correo} ya está en uso por otro colaborador vigente."
  Icon: ✗ (red X)
  aria-invalid="true"
  On blur: Validation triggered

E7: Unidad/Proveedor no vigente
  Container: SCR-015-05
  Message: "La unidad/proveedor ya no está vigente. Elige otra."
  Icon: ⚠️ (warning)
  Color: Orange/amber
  Action: [Seleccionar otra]

E8: Rol/Nivel inválido (no evidence requirements)
  Container: SCR-015-07 (Nivel dropdown)
  Message: "El nivel seleccionado no tiene requisitos de evidencia definidos. Elige otro."
  aria-invalid="true"

E9: Faltan datos obligatorios (E9)
  Container: SCR-015-08 (Review screen)
  Message: Summary list "Por favor completa los campos requeridos:"
    - [] Nombres
    - [] Apellidos
    - [] Identificación
    - [] Correo
    - [] Unidad / Proveedor
    - [] Jefe directo (if empleado)
    - [] Rol-Nivel
  Action: [Volver al formulario] → focus on first invalid field
  role="alert" aria-live="assertive"

E10: Error de base de datos
  Container: Modal dialog
  Title: "Error al registrar"
  Message: "Hubo un problema al registrar el colaborador. Por favor intenta nuevamente. Código de error: {transaction-id}"
  Actions: [Reintentar] [Volver y empezar de nuevo]
  role="alertdialog"
  aria-labelledby on title
  aria-describedby on message

E11: Sesión vencida
  Container: Full page overlay
  Message: "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
  Action: [Ir a login] (redirects to ADR-002 login flow)
  aria-label="Error: sesión vencida"
```

**Variantes:**
- `error-sin-permisos`
- `error-sin-unidades`
- `error-sin-proveedores`
- `error-sin-roles`
- `error-id-duplicada`
- `error-correo-duplicado`
- `error-unidad-no-vigente`
- `error-nivel-invalido`
- `error-faltan-datos`
- `error-base-datos`
- `error-sesion-vencida`

---

## Prompts para reproducir en Stitch

### Prompt 1: Flujo Empleado (SCR-015-01 → SCR-015-08 → SCR-015-09)

```
Crea un formulario de registro de colaborador (Empleado) en Google Stitch 
con los siguientes elementos:

Paso 1: Seleccionar tipo
  - Radio button group (Empleado / Contratista)
  - Descripción breve de cada tipo
  - Botones: [Siguiente] [Cancelar]

Paso 2: Datos de la persona
  - Nombres (text, required)
  - Apellidos (text, required)
  - Nombre preferido (text, optional)
  - Botones: [Siguiente] [Atrás]

Paso 3: Identificación
  - Tipo (dropdown: DNI, Carné, Pasaporte)
  - Número (text, required, pattern validation)
  - País (dropdown, alphabetical)
  - Real-time validation: ✓ valid, ✗ duplicate (AC-5)
  - Botones: [Siguiente] [Atrás]

Paso 4: Correo laboral
  - Correo (text email, required)
  - Help text: diferencia empleado/contratista
  - Real-time validation: ✓ valid, ✗ duplicate (AC-6)
  - Botones: [Siguiente] [Atrás]

Paso 5: Unidad organizacional
  - Combobox con búsqueda
  - Opciones: Ingeniería, Operaciones, Finanzas, ...
  - Mostrar selección actual
  - Botones: [Siguiente] [Atrás]

Paso 6: Jefe directo
  - Combobox con búsqueda de colaboradores vigentes
  - Mostrar nombre + rol/título
  - Botones: [Siguiente] [Atrás]

Paso 7: Rol-Nivel inicial
  - Rol (dropdown, dinámico)
  - Nivel (dropdown, filtrado por rol, solo con evidence requirements)
  - Fecha desde (date picker, default=today)
  - Help text: "Solo niveles con requisitos de evidencia definidos"
  - Botones: [Siguiente] [Atrás]

Paso 8: Revisar y confirmar
  - Summary en format definition list
  - [Editar] link
  - [Guardar] (primary) [Cancelar] (secondary)

Paso 9: Éxito
  - Checkmark icon + "¡Colaborador registrado!"
  - Código (GUID) con botón [Copiar]
  - Opciones: [Registrar otro] [Volver a la lista] [Ir al dashboard]

Accesibilidad: WCAG 2.2 AA (teclado, foco, contraste, aria-*, roles)
Responsive: Desktop (1440px), Tablet (768px), Mobile (375px)
```

### Prompt 2: Flujo Contratista (simplificado, sin jefe)

```
Crea un formulario de registro de colaborador (Contratista) similar al flujo 
Empleado pero con:
- Paso 5: Proveedor (combobox, no unidad)
- Omitir paso 6 (sin jefe directo para contratista, BR-PTY-19)
- Total 4 pasos (sin jefe)

Resto idéntico: Tipo → Persona → ID → Correo → Proveedor → Rol-Nivel → Revisar → Éxito
```

### Prompt 3: Estados de error

```
Crea variantes de error para cada pantalla:
- E2/E3: Sin unidades/proveedores (empty state en SCR-015-05)
- E4: Sin roles (empty state en SCR-015-07)
- E5: ID duplicada (inline error en SCR-015-03)
- E6: Correo duplicado (inline error en SCR-015-04)
- E7: Unidad/Proveedor no vigente (warning state)
- E8: Nivel sin evidence requirements (invalid state)
- E9: Faltan datos (summary error)
- E10: Error BD (modal dialog)
```

---

## Variantes de pantalla

**Matriz de variantes por flujo:**

| Pantalla | Empleado | Contratista | Estados |
|---|---|---|---|
| SCR-015-01 | ○ tipo-sin-seleccionar, tipo-empleado-sel, tipo-contratista-sel | (idéntica) | 3 |
| SCR-015-02/03 | Personas + ID | (idéntica) | 6: vacio, llenando, validando, válida, duplicada, error |
| SCR-015-04 | Correo | (idéntica) | 6: vacio, llenando, validando, válido, duplicado, formato-inválido |
| SCR-015-05 | Unidad (combobox) | Proveedor (combobox) | 6: vacio, buscando, resultados, seleccionado, sin-opciones (E2/E3) |
| SCR-015-06 | Jefe directo | **OMITIDO** | 5: vacio, buscando, resultados, seleccionado, no-vigente |
| SCR-015-07 | Rol-Nivel | (idéntica) | 7: vacio, rol-sel, nivel-sel, sin-roles (E4), nivel-inválido (E8) |
| SCR-015-08 | Revisar (con jefe) | Revisar (sin jefe) | 4: empleado, contratista, guardando, error |
| SCR-015-09 | Éxito (empleado) | Éxito (contratista) | 2: codigo-mostrado, codigo-copiado |

**Total variantes:** ~50 pantallas/estados

---

## Decisiones de implementación

### Componentes Material Angular

- `<mat-radio-group>`: para selector de tipo
- `<mat-form-field>`: para agrupar labels + inputs + help text + errors
- `<mat-input>`: para text, email, date inputs
- `<mat-select>`: para dropdowns (rol, nivel, tipo ID, país)
- `<mat-datepicker>`: para date picker (fecha desde)
- `<mat-button>`: para botones primarios/secundarios
- `<mat-error>`: para mensajes de error (dinámicos)
- `<mat-hint>`: para help text
- `<mat-spinner>`: para estados de carga

### Validación (Angular Reactive Forms)

- `Validators.required`: campos obligatorios
- `Validators.email`: correo
- `pattern`: número de identificación (regex)
- `asyncValidator`: verificar duplicados (API call a backend)
- Real-time feedback: `valueChanges.pipe(debounceTime(300), distinctUntilChanged())`

### Accesibilidad nativa

- Material Angular incluye aria-* automáticamente
- Keyboard navigation con Tab, Arrow keys (built-in)
- Focus management con `cdkTrapFocus` (modal-like)
- `aria-describedby` linking labels → help text
- `aria-invalid` en campos con error
- `aria-live="polite"` en mensajes de validación

### Breakpoints (responsive)

- Desktop: 1440px (1 column, full width form)
- Tablet: 768px (1 column, reduced padding)
- Mobile: 375px (1 column, stacked fields, full-width buttons)

---

## Próximos pasos

1. **Implementación en Angular:** Crear componentes reutilizables (form-field, form-step, form-review)
2. **Integración con API:** Backend endpoints para validación de duplicados, obtener unidades/proveedores/roles
3. **Pruebas de aceptación (AC-015):** Validar cada pantalla/estado contra requisitos UX
4. **Pruebas de accesibilidad:** Auditoría WCAG 2.2 AA con herramientas (axe, WAVE)
5. **User testing:** Validar flujo con 3-5 Jefes de Ingeniería (si presupuesto permite)

---

## Ejecución en Stitch — 2026-10-01 (stitch-ui-generator 2.0)

> Diseño **exploratorio** (`exploration_design`). No aprobado ni gobernado. El vínculo SCR↔artefacto vive en [DTM-PPM-001](../traceability/DTM-PPM-001-plataforma-ppm.md); el proyecto, en [STP-PPM-001](../projects/STP-PPM-001-plataforma-ppm.md). No se copian aquí.

- **Preflight:** `READY` · `REUSE` de `STP-PPM-001` (perfil `production`).
- **Proyecto Stitch:** el indicado por ianache (`projects/13050549605434273903`, «Plataforma PPM»). Verificado en vivo con `get_project` (existe, `OWNER`, vacío al inicio). **Visibilidad `PUBLIC`.**
- **Dispositivo:** solo `DESKTOP`, por decisión de ianache (2026-10-01): `responsive: [desktop]`. Cierra la parte de dispositivos de UXR-015-Q1.
- **Design system:** Stitch creó automáticamente «Sovereign Enterprise» (`assets/bcea74e59ec041d7bc9ccac7f22e82dd`, v1) en la primera generación y se reutilizó. No es un design system corporativo; su texto afirma contrastes («exceeds WCAG AAA») **sin verificar**.
- **Versión del artefacto:** Stitch no expone versión; se registró `not-exposed-by-stitch`. La obsolescencia no puede detectarse mientras no haya otra forma de comparar.
- **Verificación de existencia:** `list_screens` devuelve solo 3 de las 9 pantallas generadas; cada una se verificó con `get_screen`. No usar `list_screens` como prueba de ausencia.

### Pantallas generadas (referencias en el DTM)
SCR-015-01, 02, 03, 04, 06, 07, 08, 09, 10: una por SCR. Los pasos con varios estados (02, 03, 04, 06, 07, 08) salieron como **tarjetas comparativas de estados en una sola pantalla**, no como pantallas separadas por estado.

**SCR-015-05 (Unidad / Proveedor):** la primera llamada agotó el tiempo y no dejó ID. Con la aprobación de ianache se regeneró una vez con restricciones explícitas (sin migas, campana, avatar ni subtextos). Artefacto registrado en el DTM. **Puede existir un duplicado huérfano de la primera llamada**, no localizable (`list_screens` es poco fiable): revisar el proyecto en Stitch.

### Revisión crítica
Basada en el texto de los prompts que Stitch devolvió y en sus resúmenes. **No se inspeccionaron visualmente las capturas.**

| ID | SCR | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|---|
| F-01 | 04, 06, 07, 08, 09, 10 | Stitch reescribió los prompts y añadió navegación no pedida: migas «Gestión de Personal > Registrar un colaborador», etiqueta «REGISTRO DE PERSONAL», campana de notificaciones, avatar y el subtexto «Operaciones de Formación» bajo el usuario | Media | Stitch | Quitar o decidir con UX; «Operaciones de Formación» no existe en las fuentes |
| F-02 | 07 | El estado válido «confirma que el nivel cuenta con evidencias configuradas»: mezcla evidencia con requisito de evidencia (BR-ACR-11; GEN-001 F-09) | Alta | Stitch | Usar «requisitos de evidencia» |
| F-03 | 10 | El H1 pasó a «Catálogo de estados de error y excepciones», con subtítulo y badge «Referencia técnica (E1 - E11)»; se pidió «Registrar un colaborador» | Baja | Stitch | **Resuelto por decisión de ianache:** SCR-015-10 es una hoja de referencia de mensajes de error (`kind: reference-sheet`); el título de Stitch es aceptable como tal |
| F-04 | 01 | Añadió un conmutador de estados «para testing» no especificado | Baja | Stitch | Quitar |
| F-05 | 06, 08 | Datos de ejemplo con campos fuera de la especificación: código de unidad «ING-HQ-01»; «Marina Ramos Vargas (Subgerente de Operaciones)» con avatar y «etiqueta de vigencia» | Baja | Stitch | Marcar como ilustrativos; quitar el código de unidad |
| F-06 | 03, 04 | Los textos E5/E6 llevan datos ilustrativos concretos (DNI 12345678; juan.perez@…); deben ser plantillas `{tipo} {número} ({país})` | Baja | Prompt del agente | Sustituir por placeholders en Figma |
| F-07 | todas | El design system afirma contraste «WCAG AAA»; no hay evidencia | Media | Stitch | Solo `accessibility-reviewer` puede afirmarlo |
| F-08 | 02–08 | Estados como tarjetas comparativas: no son frames implementables por estado | Media | Stitch | Figma debe tener un frame por estado (`states_covered`) |

### Hallazgos de la especificación (no de Stitch)
- **Q-1:** SCR-015 tiene contadores de pasos incoherentes («Paso 1 de 5» … «Paso 6 de 5»; el flujo del empleado tiene 7 pasos antes de revisar). Los prompts omitieron los totales; hay que corregir SCR-015.
- ~~**Q-2:**~~ Dispositivos: **solo escritorio** (ianache, 2026-10-01).
- ~~**Q-3:**~~ Tokens: **«Sovereign Enterprise»** (ianache, 2026-10-01) → [TKN-SET-001](../tokens/TKN-SET-001-sovereign-enterprise.md). Conflicto interno de color de error (`#DC2626` vs `#BA1A1A`) pendiente.
- ~~**Q-4:**~~ Visibilidad `PUBLIC` aceptada por ianache (2026-10-01).
- **Q-5:** el proyecto anterior `projects/7424057371727816981` (GEN-001/002) queda sin registrar como activo; archivarlo es decisión humana.
- **Q-6:** `plataforma-gestion-formacion` (iniciativa) es un identificador asumido.

## Regeneración con «Comsatel Styled» — 2026-10-03

Autorizada por `human:ianache` (2026-10-03, «conforme»): las pantallas de SCR-015 estaban en el azul de «Sovereign Enterprise», que `TKN-SET-002` reemplazó para toda la plataforma. `apply_design_system` no sirvió: creó 14 pantallas nuevas que quedaron vacías. Se regeneró cada pantalla con `generate_screen_from_text` y `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1`.

### Método

Un agente delegado regeneró 9 de las 10 pantallas, una a la vez; la décima (SCR-015-07) la generé yo después de dos timeouts del agente. Para cada una se descargó el HTML de la original, se extrajo su texto y se construyó un prompt que reproduce la misma estructura, copia y estados, **excluyendo las invenciones de Stitch** de la generación original (migas «Gestión de Personal >», «REGISTRO DE PERSONAL», campana, avatar, «Operaciones de Formación», códigos de unidad, conmutador «para testing», afirmaciones de accesibilidad). Luego se descargó el HTML nuevo y se comparó con el original.

### Estado vigente (registrado en `DTM-PPM-001`; las azules pasan a `exploration_history`)

| SCR | Artefacto vigente | Anterior (azul) |
|---|---|---|
| SCR-015-01 | `screens/88640e9417d246e3b034678b7c5973c7` | `f5b64988…` |
| SCR-015-02 | `screens/1d9d232d10e5496ab8014c1e06540bc6` | `7247fb71…` |
| SCR-015-03 | `screens/ff5a651ba54b4c55b8fd02e8f63e8144` | `06800801…` |
| SCR-015-04 | `screens/6ed6fd69ad0647cf901e7d96f59091b0` | `bff6b7d0…` |
| SCR-015-05 | `screens/0712677573e94bfbbab46e33a64576db` | `a01ff233…` |
| SCR-015-06 | `screens/d4f4196947134746bf67b40783934d75` | `613b62fb…` |
| SCR-015-07 | `screens/4020d7f8ddcc46298ffda4e20aedb745` | `c56f08a0…` |
| SCR-015-08 | `screens/5af6c7ab36504923b6c64c52a9793c4f` | `6263b835…` |
| SCR-015-09 | `screens/3b1e5075ba9549b6a645e9307d211b53` | `25b1bbaf…` |
| SCR-015-10 | `screens/8b485b64f2624e08bcc1734b92ea9505` | `bd6d7454…` |

Los IDs se verificaron con `get_screen` (existen, con alto distinto de cero y el título esperado).

### Verificación (solo texto y estructura del HTML descargado)

- Sin rastro de la paleta azul anterior (`#0f4c81`, `#00355f`, `#1f2937`, `#0284c7`, `#0d3f6b`) en ninguna de las 10; `#bc0100` y `#0059ba` presentes.
- Sin menciones de WCAG o accesibilidad, códigos «COL-», «Hoy», AM/PM, «Operaciones de Formación», «REGISTRO DE PERSONAL», «ING-HQ» ni migas «Gestión de Personal».
- **No se inspeccionó ninguna captura**: no se afirma fidelidad visual.

### Diferencias respecto de las originales

- **Datos de ejemplo:** se usaron los de la especificación (Juan Carlos Pérez García, DNI 12345678, `juan.perez@comsatel.com.pe`, 30/09/2026) en lugar de los inventados por Stitch.
- **Contadores de paso omitidos:** SCR-015 tiene totales incoherentes («Paso 6 de 5»); se conserva solo la insignia «Paso actual».
- **SCR-015-10:** Stitch cambió el título a «Hoja de referencia de mensajes de error (E1–E11)», que es el de la especificación; se pierde el rótulo pequeño «Registrar un colaborador».
- **SCR-015-09:** Stitch agregó un texto de retroalimentación «¡Copiado!» en el botón de copiar.
- **SCR-015-08:** conserva el ejemplo «Código: ERR-REG-8492» tomado de la hoja de errores original (es un código de error de ejemplo, no un identificador de auditoría); conviene sustituirlo por `{ID}`.
- **SCR-015-06:** Stitch cambió «Campo inicial» por «Campos iniciales».
- **SCR-015-03 y -04:** se omitieron a propósito los textos «Los datos serán validados automáticamente.», «Disponible para registro nuevo en la plataforma.» e «Información».
- **SCR-015-05:** son 20 tarjetas de estado (2 grupos de 5), sin el título «Especificación…».

### Residuos en el proyecto Stitch (no se pueden borrar con las herramientas disponibles)

- Las 10 pantallas azules anteriores (siguen en el historial del DTM) y las 4 duplicadas que el proyecto ya tenía (Selección de Tipo, Correo laboral, Identificación y Unidad).
- Las **14 pantallas vacías** que dejó `apply_design_system` (ver GEN-016).
- Posibles duplicados por timeouts: el primer intento de SCR-015-03 y los dos de SCR-015-07 pudieron dejar pantallas con IDs desconocidos.

### Preguntas abiertas

- ¿Se vuelve a pasar la implementación del wizard (US-015) contra estas pantallas? La implementación ya usa los tokens de «Comsatel Styled», pero se construyó mirando las pantallas azules.
- El proyecto sigue con «Sovereign Enterprise» como tema por defecto; no hay herramienta para fijar «Comsatel Styled» sin sobrescribirlo.
