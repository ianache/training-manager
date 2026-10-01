---
type: Screen
title: "SCR-015 — Registrar un colaborador"
description: "Especificación de pantallas para el flujo de alta de empleados y contratistas."
tags: [ux-ui, screen, party, h1, administracion]
status: draft
generated:
  by: "ui-spec-writer/1.0"
  at: "2026-09-30T00:00:00-05:00"
sources:
  - id: flw-015
    resource: /knowledge-base/design/user-flows/FLW-015-registrar-un-colaborador.md
  - id: uxr-015
    resource: /knowledge-base/design/ux-requirements/UXR-015-registrar-un-colaborador.md
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
---

# SCR-015 — Registrar un colaborador

## Trazabilidad

- **Flujo:** [FLW-015](../user-flows/FLW-015-registrar-un-colaborador.md) (happy path, excepciones)
- **Requisitos UX:** [UXR-015](../ux-requirements/UXR-015-registrar-un-colaborador.md), [UXR-000](../ux-requirements/UXR-000-requisitos-ux-transversales.md)
- **Reglas:** BR-PTY-05 a BR-PTY-08, BR-PTY-10, BR-PTY-11, BR-PTY-17, BR-PTY-19
- **Accesibilidad:** WCAG 2.2 AA (UXR-000.3)
- **Privacidad:** minimización de datos (SPEC-001:L102-L109, ASR-BR-TRA-01)

## Pantallas

### SCR-015-01: Seleccionar tipo de colaborador

**Propósito:** Usuario elige si registra un empleado o contratista (diferencia el flujo)

**Ubicación en flujo:** FLW-015 Paso 1-2

**Layout:**
```
┌─────────────────────────────────────┐
│ Plataforma de Gestión de Formación  │
├─────────────────────────────────────┤
│ (Shell + navegación global)          │
├─────────────────────────────────────┤
│                                      │
│  Registrar un colaborador            │
│  ─────────────────────────────────   │
│                                      │
│  ¿Qué tipo de colaborador deseas    │
│  registrar?                          │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ ○ Empleado                      │ │
│  │                                 │ │
│  │  Trabajador de COMSATEL con:    │ │
│  │  • Unidad organizacional        │ │
│  │  • Jefe directo                 │ │
│  │  • Correo @comsatel.com.pe      │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ ○ Contratista                   │ │
│  │                                 │ │
│  │  Trabajador externo con:        │ │
│  │  • Relación de contratación     │ │
│  │  • Proveedor                    │ │
│  │  • Correo del proveedor         │ │
│  └─────────────────────────────────┘ │
│                                      │
│                  [Siguiente] [Cancelar]│
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Título: "Registrar un colaborador" (nivel h1)
- Subtítulo: "¿Qué tipo de colaborador deseas registrar?" (nivel h2)
- Radio button group con 2 opciones: Empleado, Contratista
  - Cada opción tiene etiqueta + descripción breve (ayuda contextual)
  - Estado: sin seleccionar (inicial), seleccionado (después de interacción)
- Botones: [Siguiente] (enabled después de seleccionar), [Cancelar] (siempre enabled)

**Estados:**
- **Inicial (vacío):** no hay opción seleccionada; botón Siguiente está disabled
- **Seleccionado:** el usuario eligió una opción; botón Siguiente está enabled

**Accesibilidad:**
- `<fieldset>` + `<legend>` para agrupar opciones
- Cada radio tiene `<label>` asociado
- Descripción breve fuera de la etiqueta, con `aria-describedby` si es necesario
- Foco visible en radio buttons
- Contraste 4.5:1 en texto

---

### SCR-015-02: Datos de la persona (ambos tipos)

**Propósito:** Capturar nombres, apellidos, nombre preferido, identificación

**Ubicación en flujo:** FLW-015 Paso 3

**Layout:**
```
┌─────────────────────────────────────┐
│ Registrar un colaborador            │
│ (Tipo: Empleado | Contratista)      │
├─────────────────────────────────────┤
│                                      │
│ Paso 1 de 5: Datos de la persona    │
│ ─────────────────────────────────   │
│                                      │
│ Nombres *                            │
│ ┌──────────────────────────────────┐ │
│ │ [____________]                   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Apellidos *                          │
│ ┌──────────────────────────────────┐ │
│ │ [____________]                   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Nombre preferido (opcional)          │
│ ┌──────────────────────────────────┐ │
│ │ [____________]                   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Ayuda: si el usuario prefiere un     │
│ nombre corto o un apodo, indícalo.   │
│                                      │
│                  [Siguiente] [Atrás]  │
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Indicador de progreso: "Paso 1 de 5" (empleado) o "Paso 1 de 4" (contratista)
- Campos de texto:
  - Nombres (obligatorio): `type="text"`, `required`
  - Apellidos (obligatorio): `type="text"`, `required`
  - Nombre preferido (opcional): `type="text"`
- Etiquetas y ayuda contextual
- Botones: [Siguiente], [Atrás]

**Estados:**
- **Validación:** campos vacíos se marcan con borde rojo y mensaje "Requerido"
- **Completado:** cuando los campos obligatorios están llenos, Siguiente se habilita

**Accesibilidad:**
- `<label>` para cada campo
- Atributo `aria-required="true"` en campos obligatorios
- Mensajes de error con `role="alert"`
- Foco en primer campo inválido al intentar avanzar

---

### SCR-015-03: Identificación

**Propósito:** Capturar tipo, número y país de identificación (única, BR-PTY-07, AC-5)

**Ubicación en flujo:** FLW-015 Paso 3 (continuación)

**Layout:**
```
┌─────────────────────────────────────┐
│ Registrar un colaborador            │
│ (Tipo: Empleado | Contratista)      │
├─────────────────────────────────────┤
│                                      │
│ Paso 2 de 5: Identificación         │
│ ─────────────────────────────────   │
│                                      │
│ Tipo de identificación *             │
│ ┌──────────────────────────────────┐ │
│ │ [Selecciona...     ▼]             │ │
│ │  - DNI                            │ │
│ │  - Carné de extranjería           │ │
│ │  - Pasaporte                      │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Número *                             │
│ ┌──────────────────────────────────┐ │
│ │ [____________]                   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ País emisor *                        │
│ ┌──────────────────────────────────┐ │
│ │ [Perú           ▼]                │ │
│ │  - Perú                           │ │
│ │  - Colombia                       │ │
│ │  - Argentina                      │ │
│ │  - ...                            │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ✓ Identificación no existe           │
│ (validación en tiempo real, E5)      │
│                                      │
│                  [Siguiente] [Atrás]  │
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Selector de tipo: dropdown con 3 opciones (DNI, carné, pasaporte)
- Campo de número: `type="text"`, `pattern` para validación básica
- Selector de país: dropdown con lista de países (combobox con búsqueda si >20)
- Validación en tiempo real: icono ✓ si identificación no existe (E5)
- Mensaje de error si existe (AC-5): "La identificación {tipo} {número} ({país}) ya está registrada."

**Estados:**
- **Validación pendiente:** mientras el usuario tipea el número
- **Válida:** se muestra ✓
- **Duplicada:** se muestra ✗ y mensaje de error (E5)

**Accesibilidad:**
- Selects accesibles con `<select>` o `<combobox>` si es búsqueda
- Foco visible, contraste suficiente
- Mensaje de error con `aria-live="polite"` para validación en tiempo real

---

### SCR-015-04: Correo laboral

**Propósito:** Capturar correo del colaborador (único entre vigentes, BR-PTY-08, AC-6)

**Ubicación en flujo:** FLW-015 Paso 4

**Layout:**
```
┌─────────────────────────────────────┐
│ Registrar un colaborador            │
│ (Tipo: Empleado | Contratista)      │
├─────────────────────────────────────┤
│                                      │
│ Paso 3 de 5: Correo laboral         │
│ ─────────────────────────────────   │
│                                      │
│ Correo laboral *                     │
│ ┌──────────────────────────────────┐ │
│ │ [ejemplo@comsatel.com.pe]        │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Nota: para empleados de COMSATEL,    │
│ usa tu correo corporativo            │
│ (@comsatel.com.pe).                  │
│ Para contratistas, usa el correo     │
│ del proveedor.                       │
│                                      │
│ ✓ Correo válido                      │
│ (validación en tiempo real, E6)      │
│                                      │
│                  [Siguiente] [Atrás]  │
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Campo de texto: `type="email"`, `required`
- Etiqueta y ayuda contextual (diferencia empleado/contratista)
- Validación en tiempo real: ✓ si correo válido y no existe; ✗ si existe (AC-6)
- Mensaje de error si duplicado: "El correo {correo} ya está en uso por otro colaborador vigente."

**Estados:**
- **Validación:** formato correo válido
- **Única entre vigentes:** validación en tiempo real (E6)

**Accesibilidad:**
- `<label>` asociado
- Mensaje de error con `aria-live="polite"`
- Foco visible, contraste

---

### SCR-015-05: Unidad (Empleado) o Proveedor (Contratista)

**Propósito:** Seleccionar unidad o proveedor (búsqueda / combobox)

**Ubicación en flujo:** FLW-015 Paso 5

**Variante A: Empleado → Unidad**

```
┌─────────────────────────────────────┐
│ Registrar un colaborador (Empleado) │
├─────────────────────────────────────┤
│                                      │
│ Paso 4 de 5: Unidad organizacional  │
│ ─────────────────────────────────   │
│                                      │
│ Unidad *                             │
│ ┌──────────────────────────────────┐ │
│ │ [Buscar unidad...]               │ │
│ │                                  │ │
│ │ Resultados:                      │ │
│ │  ○ Ingeniería (COMSATEL > Ing)  │ │
│ │  ○ Operaciones (COMSATEL > Op)  │ │
│ │  ○ Finanzas (COMSATEL > Fin)    │ │
│ │                                  │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [Seleccionada: Ingeniería]           │
│                                      │
│                  [Siguiente] [Atrás]  │
│                                      │
└─────────────────────────────────────┘
```

**Variante B: Contratista → Proveedor**

```
┌─────────────────────────────────────┐
│ Registrar un colaborador(Contratista)│
├─────────────────────────────────────┤
│                                      │
│ Paso 4 de 4: Proveedor              │
│ ─────────────────────────────────   │
│                                      │
│ Proveedor *                          │
│ ┌──────────────────────────────────┐ │
│ │ [Buscar proveedor...]            │ │
│ │                                  │ │
│ │ Resultados:                      │ │
│ │  ○ Accenture Perú               │ │
│ │  ○ Telefónica Tech              │ │
│ │  ○ IBM Latinoamérica            │ │
│ │                                  │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [Seleccionado: Accenture Perú]      │
│                                      │
│                  [Siguiente] [Atrás]  │
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Combobox con búsqueda (si hay >10 opciones)
- Lista de resultados dinámicos (filtrada al escribir)
- Muestra selección actual en etiqueta debajo

**Estados:**
- **E2 (sin unidades):** mensaje "No hay unidades registradas. Crea una primero (US-017)."
- **E3 (sin proveedores):** mensaje "No hay proveedores registrados. Crea uno primero (US-018)."
- **Válida:** unidad/proveedor existe y está vigente
- **No vigente:** E7 (error si cambió antes de guardar)

**Accesibilidad:**
- `<combobox>` con `aria-expanded`, `aria-controls`
- Resultados con `role="listbox"` y opciones `role="option"`
- Foco management en lista abierta/cerrada

---

### SCR-015-06: Jefe directo (Empleado)

**Propósito:** Seleccionar jefe directo (solo empleado, BR-PTY-19)

**Ubicación en flujo:** FLW-015 Paso 6 (solo empleado)

**Layout:**
```
┌─────────────────────────────────────┐
│ Registrar un colaborador (Empleado) │
├─────────────────────────────────────┤
│                                      │
│ Paso 5 de 5: Jefe directo           │
│ ─────────────────────────────────   │
│                                      │
│ Jefe directo *                       │
│ ┌──────────────────────────────────┐ │
│ │ [Buscar colaborador...]          │ │
│ │                                  │ │
│ │ Resultados:                      │ │
│ │  ○ Juan Pérez (Jefe de Proyecto)│ │
│ │  ○ María García (Gerente Ing)   │ │
│ │  ○ Carlos López (Director)      │ │
│ │                                  │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [Seleccionado: Juan Pérez]          │
│                                      │
│ Nota: solo colaboradores vigentes   │
│ pueden ser jefe directo.             │
│                                      │
│                  [Siguiente] [Atrás]  │
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Combobox con búsqueda (filtra colaboradores vigentes)
- Muestra nombre + rol/título (contexto)
- Selección actual en etiqueta

**Estados:**
- **Válido:** jefe existe y está vigente (BR-PTY-04)
- **E7:** si cambió a no vigente antes de guardar

**Accesibilidad:**
- `<combobox>` con búsqueda
- Foco management
- Contraste suficiente

---

### SCR-015-07: Rol-Nivel inicial

**Propósito:** Seleccionar rol y nivel inicial (cualquier nivel válido, BR-PRF-02, AC-7)

**Ubicación en flujo:** FLW-015 Paso 7 (ambos tipos)

**Layout:**
```
┌─────────────────────────────────────┐
│ Registrar un colaborador            │
├─────────────────────────────────────┤
│                                      │
│ Paso 6 de 5: Rol-Nivel inicial      │
│ ─────────────────────────────────   │
│                                      │
│ Rol *                                │
│ ┌──────────────────────────────────┐ │
│ │ [Selecciona rol...      ▼]       │ │
│ │  - Developer                      │ │
│ │  - QA                             │ │
│ │  - Product Manager                │ │
│ │  - Designer UX                    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Nivel inicial *                      │
│ ┌──────────────────────────────────┐ │
│ │ [Selecciona nivel...    ▼]       │ │
│ │  - Developer Junior (Nivel 1)    │ │
│ │  - Developer Mid (Nivel 2)       │ │
│ │  - Developer Senior (Nivel 3)    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ⓘ Solo niveles con requisitos de    │
│   evidencia definidos están         │
│   disponibles.                       │
│                                      │
│ Vigente desde *                      │
│ ┌──────────────────────────────────┐ │
│ │ [2026-09-30]                     │ │
│ │ (hoy, editable)                  │ │
│ └──────────────────────────────────┘ │
│                                      │
│                  [Siguiente] [Atrás]  │
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Selector de rol: dropdown (lista de roles vigentes del catálogo)
- Selector de nivel: dropdown (dinámico, muestra niveles del rol seleccionado)
  - Solo niveles con requisitos de evidencia (BR-ACR-13)
  - Puede ser cualquier nivel, no solo el primero (EVD-2026-0103)
- Selector de fecha: `type="date"`, predeterminado a hoy (editable)
- Nota informativa sobre requisitos de evidencia

**Estados:**
- **E4:** si no hay roles en catálogo (mensaje "No hay roles vigentes...")
- **E8:** si nivel no tiene requisitos de evidencia (E8 bloqueado en UI)
- **Válido:** rol existe, nivel válido, fecha válida

**Accesibilidad:**
- `<label>` para cada campo
- Atributo `aria-required="true"`
- Foco management al cambiar rol (resetea nivel)
- Contraste en nota informativa

---

### SCR-015-08: Revisar y confirmar

**Propósito:** Resumen antes de guardar (FLW-015 Paso 8)

**Layout:**
```
┌─────────────────────────────────────┐
│ Registrar un colaborador            │
├─────────────────────────────────────┤
│                                      │
│ Paso Final: Revisar y confirmar     │
│ ─────────────────────────────────   │
│                                      │
│ Revisa los datos antes de registrar: │
│                                      │
│ Tipo de colaborador:                 │
│  Empleado                            │
│                                      │
│ Datos de la persona:                 │
│  Juan Carlos Pérez García            │
│  (Nombre preferido: J.C.)            │
│                                      │
│ Identificación:                      │
│  DNI 12345678 (Perú)                 │
│                                      │
│ Correo laboral:                      │
│  juan.perez@comsatel.com.pe          │
│                                      │
│ Unidad:                              │
│  Ingeniería                          │
│                                      │
│ Jefe directo:                        │
│  María García Sánchez                │
│                                      │
│ Rol-Nivel inicial:                   │
│  Developer Junior (Nivel 1)          │
│  Vigente desde: 2026-09-30           │
│                                      │
│ [Editar] (vuelve a paso anterior)    │
│                                      │
│              [Guardar] [Cancelar]    │
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Resumen de datos en formato lectura
- Botón [Editar] (opcional, para volver)
- Botones: [Guardar] (primary), [Cancelar] (secondary)

**Estados:**
- **Validación al guardar:** (FLW-015 Paso 9)
  - Si hay validaciones nuevas en BD, mostrar E5, E6, E7, E8, E10
- **Éxito:** (FLW-015 Paso 10)

---

### SCR-015-09: Éxito

**Propósito:** Confirmación y código generado (H-2, D25)

**Layout:**
```
┌─────────────────────────────────────┐
│ Registrar un colaborador            │
├─────────────────────────────────────┤
│                                      │
│ ✓ ¡Colaborador registrado!           │
│                                      │
│ Código de colaborador (único):       │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ a3b2c5d4-e7f1-4a2b-8c3d-      │  │
│  │ 9e4f5a6b7c8d                   │  │
│  │ [Copiar]                       │  │
│  └────────────────────────────────┘  │
│                                      │
│ Puedes usar este código para         │
│ referencia o comunicación.            │
│                                      │
│ ¿Qué deseas hacer ahora?             │
│                                      │
│      [Registrar otro colaborador]    │
│      [Volver a la lista]             │
│      [Ir al dashboard]               │
│                                      │
└─────────────────────────────────────┘
```

**Componentes:**
- Icono de éxito (✓, checkmark)
- Título "¡Colaborador registrado!"
- Código generado (GUID) en campo de solo lectura con botón [Copiar]
- Opciones de siguiente acción

**Estados:**
- **Éxito:** se muestra código y opciones
- **Auditoría:** quién registró (usuario actual) y cuándo (timestamp)

**Accesibilidad:**
- Anuncio de éxito con `role="status"` o `aria-live="assertive"`
- Botón [Copiar] accesible
- Foco en el código (para copiar con Ctrl+C)

---

### SCR-015-10: Estados de error

**Tabulación de estados de error (E1-E11, FLW-015):**

| Excepción | Pantalla | Mensaje | Acción |
|---|---|---|---|
| E1: Sin permisos | Página acceso | "No tienes permiso para registrar colaboradores. Solo el Jefe de Ingeniería puede hacerlo." | [Volver] |
| E2: Sin unidades | SCR-015-05 (Empleado) | "No hay unidades registradas. Crea una primero (US-017)." | [Crear unidad] o [Volver] |
| E3: Sin proveedores | SCR-015-05 (Contratista) | "No hay proveedores registrados. Crea uno primero (US-018)." | [Crear proveedor] o [Volver] |
| E4: Sin roles | SCR-015-07 | "No hay roles vigentes en el catálogo. Crea el catálogo primero (US-001)." | [Crear catálogo] o [Volver] |
| E5: ID duplicada | SCR-015-03 | "La identificación {tipo} {número} ({país}) ya está registrada." | [Corregir identificación] |
| E6: Correo duplicado | SCR-015-04 | "El correo {correo} ya está en uso por otro colaborador vigente." | [Corregir correo] |
| E7: Unidad/Proveedor no vigente | SCR-015-05 | "La unidad/proveedor ya no está vigente. Elige otra." | [Seleccionar otra] |
| E8: Rol/Nivel inválido | SCR-015-07 | "El rol o nivel no es válido. Asegúrate de que existe en el catálogo vigente." | [Seleccionar otra] |
| E9: Faltan datos | Múltiple | "Por favor completa los campos requeridos: [lista]" | [Volver al formulario] + foco en primer campo |
| E10: Error BD | SCR-015-08 | "Hubo un problema al registrar. Por favor intenta nuevamente. Código: {ID}" | [Reintentar] [Volver] |
| E11: Sesión vencida | Pantalla login | "Tu sesión ha expirado. Por favor inicia sesión nuevamente." | [Ir a login] |

---

## Requisitos de Diseño

### Accesibilidad (WCAG 2.2 AA, UXR-000.3)

- ✓ **Teclado:** todos los campos son navigables con Tab/Shift+Tab
- ✓ **Foco visible:** cada elemento interactivo tiene outline visible (mín. 2px, contraste 3:1)
- ✓ **Contraste:** texto 4.5:1 (normal), 3:1 (gráfico)
- ✓ **Nombres accesibles:** `<label>`, `aria-label`, `aria-labelledby` para todos los inputs
- ✓ **Mensajes de error:** `role="alert"` con `aria-live="polite"`
- ✓ **Validación en tiempo real:** anuncios con `aria-live="polite"` (no interrumpe flujo)
- ✓ **Sin dependencia de color:** estados de error usan icono + texto
- ✓ **Campos obligatorios:** `aria-required="true"` en atributo + asterisco (*) visible

### Privacidad (SPEC-001:L102-L109, ASR-BR-TRA-01)

- ✓ Se capturan solo los campos mínimos: nombres, apellidos, identificación, correo, unidad/proveedor, jefe, rol-nivel
- ✓ No se piden: escala salarial, responsabilidades (MOF), criterios de nivel (años de experiencia)
- ✓ Datos no se guardan en localStorage (sesión vencida = pérdida de datos)
- ✓ Auditoría registrada: quién (usuario actual) y cuándo (timestamp, BR-PTY-12)

### Estados de interfaz (UXR-000.4)

- ✓ **Carga:** spinner/skeleton mientras se buscan opciones (unidad, proveedor, rol)
- ✓ **Vacío:** sin unidades, sin proveedores, sin roles (E2, E3, E4)
- ✓ **Error:** validación (E5-E10), sin permisos (E1), sesión vencida (E11)
- ✓ **Éxito:** código mostrado, auditoría registrada

---

## Preguntas abiertas heredadas

| ID | Pregunta | Impacto en diseño |
|---|---|---|
| UXR-015-Q2 | ¿Combobox, dropdown, modal para búsqueda de unidad/proveedor/jefe/rol? | Define componente en SCR-015-05, 06, 07 |
| UXR-015-Q4 | Validación tiempo real vs. al guardar | Define cuándo se muestran E5, E6 (implementación: real-time para duplicados) |
| UXR-015-Q5 | Feedback después del alta (mostrar código, siguiente acción) | Define SCR-015-09 (implementación: mostrar código + 3 opciones) |
| UXR-015-Q1 | Validación de dominio del proveedor | No se valida (US-015-Q1 abierta): E6 bloquea solo duplicados |

---

## Próximos pasos

1. **CMP-015:** especificar componentes reutilizables (text-input, select, combobox, radio-group, button, alert)
2. **AC-015:** criterios de aceptación por pantalla (test cases, validaciones)
3. **Diseño visual:** wireframes/mockups en Figma o Google Stitch (GEN-015)
