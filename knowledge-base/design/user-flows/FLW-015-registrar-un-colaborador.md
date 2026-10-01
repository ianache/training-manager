---
type: User Flow
title: "FLW-015 — Registrar un colaborador"
description: "Happy path y excepciones para registrar un empleado o contratista con sus datos maestros, rol y nivel inicial."
tags: [ux-ui, user-flow, party, h1, administracion]
status: draft
generated:
  by: "user-flow-designer/1.0"
  at: "2026-09-30T00:00:00-05:00"
sources:
  - id: uxr-015
    resource: /knowledge-base/design/ux-requirements/UXR-015-registrar-un-colaborador.md
  - id: us-015
    resource: /knowledge-base/requirement/user-stories/US-015-registrar-un-colaborador.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# FLW-015 — Registrar un colaborador

## Trazabilidad

- **Requisito UX:** [UXR-015](../ux-requirements/UXR-015-registrar-un-colaborador.md)
- **Historia:** [US-015](../../requirement/user-stories/US-015-registrar-un-colaborador.md), criterios AC-1 a AC-7
- **Reglas:** BR-PTY-05 a BR-PTY-08, BR-PTY-10, BR-PTY-11, BR-PTY-17, BR-PTY-19; BR-PRF-02
- **Actor:** [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md)
- **Transversal:** [UXR-000](../ux-requirements/UXR-000-requisitos-ux-transversales.md) (acceso, estados de interfaz, auditoría)

## Precondiciones

- El usuario tiene el rol de Jefe de Ingeniería (BR-PTY-17)
- Existe al menos:
  - Una unidad registrada (US-017)
  - Un proveedor registrado (US-018)
  - Un rol vigente en el catálogo (US-001)
- El usuario accede desde el shell de la plataforma con sesión válida (UXR-000.1)

## Happy Path: Registrar un Empleado

**Actor:** Jefe de Ingeniería

**Flujo normal (Empleado):**

```
1. [Vista] "Alta de Colaborador"
   ↓
2. [Decisión] ¿Tipo de rol?
   Usuario elige: "Empleado"
   ↓
3. [Paso] Capturar datos de la persona
   Campos obligatorios: nombres, apellidos, identificación (tipo, número, país)
   Campo opcional: nombre preferido
   → Validación: identificación no existe (BR-PTY-07, AC-5)
   ↓
4. [Paso] Capturar correo laboral
   Campo obligatorio: correo (@comsatel.com.pe u otro dominio del empleado)
   → Validación: correo no existe entre vigentes (BR-PTY-08, AC-6)
   → Validación: formato correo válido
   ↓
5. [Paso] Seleccionar unidad
   Campo obligatorio: unidad del empleado (búsqueda/combobox)
   → Validación: unidad existe (US-017)
   → Validación: unidad tiene estado vigente
   ↓
6. [Paso] Seleccionar jefe directo
   Campo obligatorio: otra persona registrada como colaborador
   → Validación: jefe existe y está vigente (BR-PTY-04, H-1)
   → Nota: no aparece para contratista (BR-PTY-19)
   ↓
7. [Paso] Seleccionar Rol-Nivel inicial
   Campos obligatorios: rol (catálogo) + nivel (cualquier nivel válido del rol)
   → Validación: rol existe y vigente (BR-CAT-09)
   → Validación: nivel existe en el rol
   → Validación: nivel tiene requisitos de evidencia (BR-ACR-13, de UXR-001)
   Fecha desde: predeterminada a hoy (editable)
   → Validación: fecha válida (BR-PRF-02)
   ↓
8. [Paso] Revisar y confirmar
   Resumen: tipo, persona, identificación, correo, unidad, jefe directo, rol-nivel, fecha
   Acciones: [Guardar] [Cancelar]
   ↓
9. [Acción] Usuario hace clic en [Guardar]
   Sistema valida (nuevas validaciones en BD)
   ↓
10. [Estado] Éxito
    Mensaje: "Colaborador registrado"
    Muestra: código de colaborador generado (GUID, BR-PTY-06, D25, H-2)
    Acciones: [Registrar otro] [Volver a la lista]
    → Auditoría: quién registró y cuándo (BR-PTY-12)
```

## Happy Path: Registrar un Contratista

**Actor:** Jefe de Ingeniería

**Flujo normal (Contratista):**

```
1. [Vista] "Alta de Colaborador"
   ↓
2. [Decisión] ¿Tipo de rol?
   Usuario elige: "Contratista"
   ↓
3. [Paso] Capturar datos de la persona
   (Idéntico a Empleado: nombres, apellidos, identificación, nombre preferido opcional)
   → Validación: identificación no existe (BR-PTY-07, AC-5)
   ↓
4. [Paso] Capturar correo laboral
   Campo obligatorio: correo del proveedor (no COMSATEL)
   → Validación: correo no existe entre vigentes (BR-PTY-08, AC-6)
   → Validación: formato correo válido
   → NOTA: dominio del proveedor no se valida aún (US-015-Q1 abierta, D13)
   ↓
5. [Paso] Seleccionar proveedor
   Campo obligatorio: proveedor del contratista (búsqueda/combobox, US-018)
   → Validación: proveedor existe (BR-PTY-10)
   → Validación: proveedor tiene contratación vigente
   → NOTA: no se pide jefe directo (BR-PTY-19)
   ↓
6. [Paso] Seleccionar Rol-Nivel inicial
   (Idéntico a Empleado: rol + nivel obligatorios, fecha desde editable)
   ↓
7. [Paso] Revisar y confirmar
   Resumen: tipo, persona, identificación, correo, proveedor, rol-nivel, fecha
   Acciones: [Guardar] [Cancelar]
   ↓
8. [Acción] Usuario hace clic en [Guardar]
   ↓
9. [Estado] Éxito
   (Idéntico a Empleado: muestra código generado, auditoría)
```

## Excepciones y Estados de Error

### E1: Sin permisos

```
Precondición falla: usuario NO es Jefe de Ingeniería
↓
[Estado] Sin permisos
Mensaje: "No tienes permiso para registrar colaboradores. Solo el Jefe de Ingeniería puede hacerlo."
Acción: [Volver]
```

### E2: Sin unidades registradas (bloquea flujo Empleado)

```
Precondición falla: no hay unidades (US-017 aún no ejecutada)
↓
[Estado] Sin opciones
Paso 5 (Seleccionar unidad):
Mensaje: "No hay unidades registradas. Primero debe crear una estructura organizacional (US-017)."
Acción: [Crear unidad] (enlace a US-017 o volver)
```

### E3: Sin proveedores registrados (bloquea flujo Contratista)

```
Precondición falla: no hay proveedores (US-018 aún no ejecutada)
↓
[Estado] Sin opciones
Paso 5 (Seleccionar proveedor):
Mensaje: "No hay proveedores registrados. Primero debe registrar un proveedor (US-018)."
Acción: [Crear proveedor] (enlace a US-018 o volver)
```

### E4: Sin roles en el catálogo (bloquea ambos)

```
Precondición falla: catálogo vacío (US-001 aún no ejecutada)
↓
[Estado] Sin opciones
Paso 7 (Seleccionar Rol-Nivel):
Mensaje: "No hay roles vigentes en el catálogo. Primero debe definir el catálogo de roles y competencias (US-001)."
Acción: [Crear catálogo] (enlace a US-001 o volver)
```

### E5: Identificación duplicada (AC-5)

```
En cualquier momento, después de ingresar identificación:
↓
[Validación] Sistema verifica: ¿existe (tipo, número, país)?
→ SÍ (duplicada)
↓
[Estado] Error
Mensaje: "La identificación {tipo} {número} ({país}) ya está registrada."
Acción: [Corregir identificación] (foco al campo de identificación)
```

### E6: Correo laboral duplicado entre vigentes (AC-6)

```
En cualquier momento, después de ingresar correo:
↓
[Validación] Sistema verifica: ¿existe entre colaboradores vigentes?
→ SÍ (duplicado)
↓
[Estado] Error
Mensaje: "El correo {correo} ya está en uso por otro colaborador vigente."
Acción: [Corregir correo] (foco al campo de correo)
```

### E7: Unidad o Proveedor no vigente

```
Usuario elige unidad/proveedor, pero su estado cambió a no vigente antes de guardar:
↓
[Validación en Paso 5/6] Sistema verifica estado
→ No vigente
↓
[Estado] Error
Mensaje: "La unidad/proveedor seleccionada ya no está vigente. Elige otra."
Acción: [Seleccionar otra] (vuelve a Paso 5/6)
```

### E8: Rol o nivel no válido

```
Usuario elige rol-nivel, pero:
- El rol no existe o fue deprecado
- El nivel no existe en el rol
- El nivel no tiene requisitos de evidencia (BR-ACR-13)
↓
[Validación en Paso 7] Sistema verifica
→ No válido
↓
[Estado] Error
Mensaje: "El rol o nivel seleccionado no es válido. Asegúrate de que existe en el catálogo vigente y tiene requisitos de evidencia definidos."
Acción: [Seleccionar otra] (vuelve a Paso 7)
```

### E9: Faltan datos obligatorios

```
Usuario intenta guardar sin completar todos los campos obligatorios:
↓
[Validación en Paso 8] Sistema revisa formulario
→ Campos vacíos: nombres, apellidos, identificación, correo, [unidad|proveedor], [jefe directo si empleado], rol-nivel
↓
[Estado] Error de validación
Mensaje: "Por favor completa los campos requeridos:" [lista campos]
Acción: [Volver al formulario] (foco en primer campo vacío)
```

### E10: Error de base de datos al guardar

```
Usuario hace clic en [Guardar], validaciones pasan, pero BD rechaza la operación
(ej: constraint violation tardío, timeoutde transacción)
↓
[Estado] Error
Mensaje: "Hubo un problema al registrar el colaborador. Por favor intenta nuevamente. Código de error: {ID transacción}"
Acciones: [Reintentar] [Volver y empezar de nuevo]
```

### E11: Sesión vencida

```
Durante el flujo, la sesión del usuario caduca (UXR-000.4)
↓
[Estado] Sesión vencida
Mensaje: "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
Acción: [Ir a login] (enlace a ADR-002)
→ Nota: datos ingresados se pierden (no guardar en localStorage per privacidad)
```

## Notas sobre Estados

- **Validación en tiempo real vs. al guardar:** abierto (UXR-015-Q4). Supuesto: validación de identificación y correo duplicados se hace al abandonar el campo (real-time feedback); otras validaciones, al guardar.
- **Accesibilidad (UXR-000.3):** todos los estados deben cumplir WCAG 2.2 AA: mensajes de error con `role="alert"`, foco visible en campos con error, contraste suficiente.
- **Feedback usuario (UXR-015-Q5):** después del alta exitosa, se muestra código y opciones [Registrar otro] o [Volver]. Supuesto: esto es mejor que volver a la lista sin confirmación.

## Decisiones registradas

- Decisión humana (ianache, Jefe de Ingeniería, 2026-09-30): unidad y jefe directo obligatorios para empleado; nivel inicial obligatorio y puede ser cualquier nivel válido.
- Supuesto (flujo): validación de identificación y correo duplicados se hace en tiempo real; otras validaciones, al guardar.
- Supuesto (accesibilidad): todos los estados de error incluyen focusmanagement y mensajes accesibles.

## Preguntas abiertas heredadas de UXR-015

| ID | Pregunta | Impacto en flujo |
|---|---|---|
| US-015-Q1 | Validación de dominio del correo del proveedor | No bloquea flujo; se asume validación manual (E6 bloquea duplicados) |
| UXR-015-Q2 | Componentes de búsqueda (combobox, modal, lista) | Define UX de Pasos 5 y 7 (búsqueda/selección) |
| UXR-015-Q4 | Validación tiempo real vs. al guardar | Define cuándo se muestran E5, E6 |
| UXR-015-Q5 | Feedback después del alta (código mostrado, siguiente acción) | Define pantalla final (éxito) |
| P-50.2 | Estado de roles al crearse (DRAFT vs APPROVED) | Afecta qué roles ofrece el catálogo en Paso 7 |
