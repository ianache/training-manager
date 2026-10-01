---
type: Acceptance Criteria
title: "AC-015 — Criterios de aceptación UI: Registrar un colaborador"
description: "Test cases y validaciones por pantalla para el flujo de registro de colaboradores (empleado/contratista)."
tags: [ux-ui, acceptance-criteria, party, h1, testing]
status: draft
generated:
  by: "ui-acceptance-analyzer/1.0"
  at: "2026-10-01T00:00:00-05:00"
sources:
  - id: scr-015
    resource: /knowledge-base/design/screens/SCR-015-registrar-un-colaborador.md
  - id: flw-015
    resource: /knowledge-base/design/user-flows/FLW-015-registrar-un-colaborador.md
  - id: uxr-015
    resource: /knowledge-base/design/ux-requirements/UXR-015-registrar-un-colaborador.md
---

# AC-015 — Criterios de Aceptación UI

## Trazabilidad

- **Especificación pantallas:** [SCR-015](../screens/SCR-015-registrar-un-colaborador.md)
- **Flujo:** [FLW-015](../user-flows/FLW-015-registrar-un-colaborador.md)
- **Requisitos UX:** [UXR-015](../ux-requirements/UXR-015-registrar-un-colaborador.md)
- **Decisiones de diseño:** Respondidas 2026-10-01
- **Estándar:** WCAG 2.2 AA, Material Design 3

---

## Matriz de Test Cases por Pantalla

### **AC-015-01: SCR-015-01 — Seleccionar tipo**

#### Test: Carga inicial
```gherkin
DADO que accedo a /colaboradores/nuevo
CUANDO carga SCR-015-01
ENTONCES veo dos tarjetas radio (Empleado / Contratista)
  Y Empleado está seleccionado por defecto
  Y botón [Siguiente] está habilitado
  Y botón [Cancelar] siempre habilitado
  Y checkmark azul visible en Empleado
```
**Verificación:** Visual + keyboard focus visible + aria-checked="true" en input radio

#### Test: Seleccionar tipo
```gherkin
CUANDO hago clic en tarjeta "Contratista"
ENTONCES border cambia a 2px #0B3C68
  Y background toma color #E3EEFC (selected container)
  Y checkmark azul aparece en top-right
  Y botón [Siguiente] sigue habilitado
  Y radio button está checked (aria-checked="true")
```
**Verificación:** Estado visual correcto, aria-checked, focus management

#### Test: Cancelar
```gherkin
CUANDO hago clic en [Cancelar]
ENTONCES se muestra diálogo de confirmación
  Y mensaje: "¿Descartar los cambios?"
  Y opciones: [Descartar] [Continuar]
  Y si Descartar: vuelve al inicio (homepage o lista)
```
**Verificación:** Modal accesible (role="alertdialog"), focus trap, ESC cierra

---

### **AC-015-02/03: SCR-015-02/03 — Datos persona + Identificación**

#### Test: Campos obligatorios validados
```gherkin
DADO que estoy en Paso 1 de 5
CUANDO intento guardar sin llenar Nombres o Apellidos
ENTONCES campos se marcan con borde rojo (#EF4444)
  Y mensajes de error inline: "Requerido"
  Y aria-invalid="true" en campos vacíos
  Y botón [Siguiente] sigue disabled hasta llenar
```
**Verificación:** Validación HTML5 + ARIA, focus en primer campo inválido

#### Test: Validación identificación tiempo real (AC-5)
```gherkin
CUANDO completo DNI 12345678 y cambio foco
ENTONCES sistema valida en tiempo real:
  - Si válido: ✓ checkmark verde + "Identificación válida"
  - Si existe (duplicada): ✗ X rojo + "DNI 12345678 (Perú) ya existe" (AC-5, E5)
  Y aria-live="polite" anuncia resultado
```
**Verificación:** Async validator disparado al blur, tooltip/icon cambias visualmente

#### Test: Tipo de identificación válido
```gherkin
CUANDO selecciono tipo = "RUC" (inválido)
ENTONCES se rechaza o no está en dropdown
  Y solo opciones válidas: DNI, Carné extranjería, Pasaporte
```
**Verificación:** Dropdown values match BR-PTY-07

---

### **AC-015-04: SCR-015-04 — Correo laboral**

#### Test: Validación correo tiempo real (AC-6)
```gherkin
CUANDO ingreso correo "juan.perez@comsatel.com.pe" y cambio foco
ENTONCES:
  - Si válido + no existe: ✓ "Correo válido"
  - Si existe entre vigentes: ✗ "Correo ya está en uso" (AC-6, E6)
  Y aria-live="polite" anuncia
  Y botón [Siguiente] disabled si error
```
**Verificación:** Email validation + async duplicate check, no false positives (anonimizados permitidos)

#### Test: Formato email
```gherkin
CUANDO ingreso formato inválido: "juan@" o "@comsatel.com.pe"
ENTONCES HTML5 email validation rechaza
  Y mensaje: "Ingresa email válido"
```
**Verificación:** type="email" validación nativa

---

### **AC-015-05A/05B: SCR-015-05A/05B — Unidad / Proveedor**

#### Test: Combobox búsqueda real-time
```gherkin
CUANDO tipeo "ing" en campo Unidad (Empleado)
ENTONCES:
  - Resultados se filtran en tiempo real
  - Opciones mostradas: "Ingeniería (COMSATEL > Ing)", "Operaciones"...
  - Spinner loading visible mientras busca
  - ARIA: aria-expanded="true", aria-autocomplete="list"
  Y cuando selecciono, confirma "Seleccionada: Ingeniería"
```
**Verificación:** Debounce ~300ms, resultados dinámicos, keyboard navigation (Arrow keys)

#### Test: Sin opciones (E2, E3)
```gherkin
CUANDO no hay unidades registradas (E2)
ENTONCES mensaje: "No hay unidades registradas. Crea una primero (US-017)."
  Y link [Crear unidad] lleva a US-017
```
**Verificación:** Empty state UX clara, CTA funcional

---

### **AC-015-06: SCR-015-06 — Jefe directo (Empleado)**

#### Test: Combobox jefe vigente (E7)
```gherkin
CUANDO selecciono jefe directo que después pierde vigencia
ENTONCES error E7: "La persona ya no está vigente. Elige otra."
  Y aria-invalid="true"
  Y [Siguiente] disabled hasta seleccionar jefe vigente
```
**Verificación:** Validación en guardado (POST), no solo en UI

#### Test: Solo colaboradores vigentes
```gherkin
CUANDO busco "maria" en jefe directo
ENTONCES solo aparecen personas con estado=vigente
  Y muestra: nombre + rol/título como contexto
```
**Verificación:** Filtro backend, no solo UI (seguridad)

---

### **AC-015-07: SCR-015-07 — Rol-Nivel inicial**

#### Test: Nivel dinámico filtrado (AC-7)
```gherkin
CUANDO selecciono Rol = "Developer"
ENTONCES dropdown Nivel muestra solo Developer niveles:
  - Developer Junior (Nivel 1) - selected por defecto
  - Developer Mid (Nivel 2)
  - Developer Senior (Nivel 3)
  Y solo si tienen requisitos de evidencia
```
**Verificación:** Dropdown options son dinámicas, validación BR-ACR-13

#### Test: Fecha desde editable
```gherkin
CUANDO hago clic en fecha desde
ENTONCES date picker abre (o input date)
  Y default = hoy (2026-10-01)
  Y puedo cambiar a fecha pasada o futura
  Y formato YYYY-MM-DD válido
```
**Verificación:** HTML5 date input o custom picker accesible

#### Test: Nivel sin evidence (E8)
```gherkin
CUANDO intento guardar con nivel que no tiene requisitos de evidencia
ENTONCES error E8: "Nivel no tiene requisitos de evidencia"
  Y [Siguiente] disabled
```
**Verificación:** Validación backend (BR-ACR-13)

---

### **AC-015-08: SCR-015-08 — Revisar y confirmar**

#### Test: Summary correcta
```gherkin
DADO que completé todos los pasos
CUANDO llego a Revisar
ENTONCES se muestra resumen con:
  - Tipo: Empleado
  - Datos: Juan Carlos Pérez García (J.C.)
  - ID: DNI 12345678 (Perú)
  - Correo: juan.perez@comsatel.com.pe
  - Unidad: Ingeniería
  - Jefe: María García
  - Rol-Nivel: Developer Junior (Nivel 1)
  - Fecha: 2026-10-01
  Y estructura <dl> semántica
```
**Verificación:** Datos exactamente como se ingresaron, no modificados

#### Test: Guardar con loading
```gherkin
CUANDO hago clic en [Guardar]
ENTONCES:
  - Spinner loading visible
  - Botones disabled durante POST
  - Validación backend se ejecuta
  - Si éxito: POST /api/parties retorna {id, code}
  - Navigate a SCR-015-09 (éxito)
```
**Verificación:** API contract (DCP-002), status 201/400/409/500

#### Test: Error de validación (E5, E6, E7, E8, E10)
```gherkin
CUANDO backend retorna 409 (conflicto)
ENTONCES:
  - E5 (ID duplicada): "DNI ... ya existe"
  - E6 (Correo duplicado): "Correo ... ya en uso"
  - E7 (Unidad no vigente): "Unidad ya no vigente"
  - E8 (Nivel inválido): "Nivel no tiene requisitos"
  - E10 (Error BD): "Problema al registrar. Código: {txn-id}"
  Y vuelve al formulario con campos llenos (no pierde datos)
```
**Verificación:** Mensajes claros, datos conservados, focus management

---

### **AC-015-09: SCR-015-09 — Éxito**

#### Test: Código generado y visible
```gherkin
DADO que POST fue exitoso (201)
CUANDO llego a pantalla Éxito
ENTONCES veo:
  - Icono checkmark teal (#0D9488)
  - Título: "¡Colaborador registrado!"
  - Código: "a3b2c5d4-e7f1-4a2b-8c3d-9e4f5a6b7c8d" (GUID)
  - role="status" aria-live="assertive" anunció éxito
```
**Verificación:** GUID es único, auditoría registró quién/cuándo

#### Test: Copiar código
```gherkin
CUANDO hago clic en [Copiar]
ENTONCES:
  - Código se copia al clipboard
  - Toast "✓ Copiado" (2s)
  - aria-live="polite" anuncia
  Y botón muestra icono check temporalmente
```
**Verificación:** navigator.clipboard.writeText(), fallback si no disponible

#### Test: Siguientes acciones
```gherkin
CUANDO hago clic en [Registrar otro]
ENTONCES vuelvo a SCR-015-01 (formulario limpio)

CUANDO hago clic en [Volver a lista]
ENTONCES navigate a /colaboradores (party-list)

CUANDO hago clic en [Ir dashboard]
ENTONCES navigate a / (home)
```
**Verificación:** Navigation correcta, formulario limpio en reinicio

---

## Matriz de Casos Límite

| Caso | Escenario | Resultado esperado | AC | 
|---|---|---|---|
| **ID duplicada** | DNI 12345678 (Perú) ya existe | E5: error 409, mensaje rojo | AC-5 |
| **Correo duplicado** | Correo ya en uso vigente | E6: error 409, mensaje rojo | AC-6 |
| **ID con otro país** | DNI 12345678 (Colombia) es diferente | ✓ se acepta (compound key) | AC-5 |
| **Correo anonimizado** | Email de persona anonimizada | ✓ se acepta (no bloquea) | E6 |
| **Sin unidades** | No hay unidades creadas | E2: empty state + CTA | UXR-015 |
| **Sin proveedores** | No hay proveedores | E3: empty state + CTA | UXR-015 |
| **Sin roles** | Catálogo vacío | E4: empty state + CTA | UXR-015 |
| **Nivel sin evidence** | Nivel no tiene requisitos | E8: error bloqueante | BR-ACR-13 |
| **Sesión vencida** | Token JWT expirado | E11: modal login, datos pierden | UXR-000 |
| **Falla BD** | Timeout/error al POST | E10: código error, retry | FLW-015 |
| **Caracteres especiales** | Nombre: "José María O'Brien" | ✓ se acepta, sin XSS | Privacy |

---

## Checklist de Accesibilidad (WCAG 2.2 AA)

- [ ] **Teclado:** Tab/Shift+Tab navega todos los elementos; Enter/Space activa botones/inputs
- [ ] **Foco visible:** Outline 2px azul #0F52BA en todos los campos
- [ ] **Contraste:** 4.5:1 texto normal, 3:1 gráficos (validar con axe/WAVE)
- [ ] **Labels:** `<label>` asociado a todo input (aria-label para iconos)
- [ ] **Aria-required:** "true" en campos obligatorios
- [ ] **Aria-invalid:** "true" en campos con error
- [ ] **Aria-live:** "polite" en mensajes validación
- [ ] **Aria-live:** "assertive" en éxito (status)
- [ ] **Focus management:** Error → focus en primer campo inválido; Éxito → focus en código
- [ ] **Color no es única información:** Rojo + X icon para error
- [ ] **Screenreader:** Prueba con NVDA/JAWS (no solo axe automático)

---

## Definición de Done (AC-015)

- [ ] **Todas las pantallas cumplen AC correspondientes**
- [ ] **Validaciones tiempo real funcionan (ID, correo)**
- [ ] **Excepciones (E1-E11) manejadas con UX clara**
- [ ] **Accesibilidad WCAG 2.2 AA auditada**
- [ ] **Privacidad:** PII solo captura SPEC-001:L102-L109
- [ ] **Auditoría:** quién registró + timestamp
- [ ] **Código generado:** GUID único, auditado
- [ ] **Tests: Unit + Integration** para validaciones críticas
- [ ] **Smoke test:** Happy path empleado + contratista
- [ ] **Regresión:** Sin romper otras historias (US-016, US-017, US-018, US-001)

---

## Notas de Implementación

1. **Validaciones tiempo real:** Usar debounce 300ms para no sobrecargar backend
2. **Async validators:** DNI/correo duplicados deben validarse en POST también (no confiar en UI)
3. **Datos conservados:** Si error en Paso 8, no limpiar formulario (UX)
4. **Loading states:** Spinner + disabled buttons durante POST
5. **Error recovery:** Mostrar código error (txn-id) para debugging
6. **Auditoría:** Loguear usuario actual + timestamp + acción en evento "colaborador_registrado"
7. **Responsivo:** Breakpoints Desktop (1440), Tablet (768), Mobile (375)

---

## Próximos pasos

1. ✅ AC-015 especificado
2. 👉 **Usar Superpowers para implementación:** `/superpowers:executing-plans`
3. 👉 Crear plan de desarrollo (Phase 1a: endpoints, Phase 1b: UI Angular)
4. 👉 Ejecutar tests: Unit + Integration + E2E
