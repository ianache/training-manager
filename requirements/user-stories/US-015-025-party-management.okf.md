---
okf_version: "0.2"
id: "US-015-025"
type: "user-story"
product: null
gate: "REQUIREMENTS_READY"
knowledge_base: "kb-uxui-agentic"
knowledge_base_uri: "kb://kb-uxui-agentic"
context_pack_id: "RCP-003"
context_pack_uri: "kb://kb-uxui-agentic/context-packs/RCP-003"
---

# US-015 a US-025: Gestión de Data Maestra de Party — Consolidated Stories

**Documento consolidado de 11 User Stories refinadas de SPEC-001 §5 (Capacidades C1–C11)**

Generado: 2026-09-27 por `af-user-story-refiner/2.0`
Fuentes: SPEC-001, RCP-003, BRC-001 (BR-PTY-01 a BR-PTY-20), IMD-002
Contexto: RCP-003-gestion-data-maestra-party.md
Decisiones: Jefe de Ingeniería es dueño (D11), data abierta (D27), anonimización irreversible (D14), sin sobrescritura (BR-PTY-12)

## Resumen de 11 User Stories

| US | Título | Actor | Capacidad |
|---|---|---|---|
| US-015 | Registrar un colaborador | Jefe de Ingeniería | C1 |
| US-016 | Actualizar datos y medios de contacto | Jefe de Ingeniería | C2 |
| US-017 | Gestionar la estructura organizacional | Jefe de Ingeniería | C3 |
| US-018 | Gestionar proveedores y contratistas | Jefe de Ingeniería | C4 |
| US-019 | Asignar un Rol-Nivel a una persona | Jefe de Ingeniería / Instructor | C5 |
| US-020 | Asignar roles del programa | Jefe de Ingeniería | C6 |
| US-021 | Dar de baja a un colaborador | Jefe de Ingeniería | C7 |
| US-022 | Vincular la identidad de acceso | Jefe de Ingeniería | C8 |
| US-023 | Consultar la ficha y su historial | Jefe de Ingeniería / Colaborador | C9 |
| US-024 | Anonimizar los datos personales | Jefe de Ingeniería | C10 |
| US-025 | Configurar el plazo de anonimización | Jefe de Ingeniería | C11 |

## US-015: Registrar un colaborador

**Mapeo:** SPEC-001 C1 (Registrar un colaborador)

**Actor:** Jefe de Ingeniería

### Necesidad
Registrar una nueva persona en la plataforma como colaborador (Empleado o Contratista), capturando toda la información maestra inicial (nombres, identificación, correo laboral, rol, unidad, jefe directo, proveedor si aplica).

### Razón
Para que la plataforma tenga un registro completo del colaborador desde el día 1 de entrada, con trazabilidad de quién lo registró y cuándo (auditoría).

### Reglas Aplicables
- BR-PTY-01: Plataforma es sistema de registro (no integra con RR. HH.)
- BR-PTY-02: Toda parte tiene vigencia; roles tienen fecha desde/hasta
- BR-PTY-06: Código de colaborador es único y se genera automáticamente (GUID)
- BR-PTY-07: Identificación única por tipo, número y país
- BR-PTY-08: Correo laboral es obligatorio y único entre vigentes
- BR-PTY-13: Sin sobrescritura; se cierra vigencia anterior y se abre nueva
- BR-PRF-02: Nivel inicial de Rol-Nivel se asigna al registrar (ADR-006)

### Criterios de Aceptación

**Escenario 1: Registrar Empleado exitosamente**
- Dado: Jefe de Ingeniería en sección "Registrar colaborador"
- Cuando: Ingresa nombres, apellidos, DNI, correo laboral, rol (Empleado), unidad, jefe directo
- Entonces: Sistema genera GUID, registra persona con vigencia desde hoy, crea rol Employee, crea relación jefe directo, muestra confirmación, audita creación

**Escenario 2: Registrar Contratista con proveedor**
- Dado: Jefe registra Contratista
- Cuando: Ingresa rol Contratista, proveedor, correo laboral
- Entonces: Se crea relación contratación a proveedor, no se asigna jefe directo (BR-PTY-19), correo es del proveedor

**Escenario 3: Validación — Identificación duplicada**
- Dado: Intenta registrar con DNI que ya existe
- Cuando: Ingresa DNI ya registrado
- Entonces: Muestra "DNI ya existe", no permite registrar, propone actualizar o cancelar

**Escenario 4: Validación — Correo laboral duplicado**
- Dado: Intenta registrar con correo duplicado
- Cuando: Correo ya asignado a otro colaborador vigente
- Entonces: Muestra "Correo laboral ya está en uso", no permite registrar

**Escenario 5: Validación — Correo obligatorio**
- Dado: Intenta registrar sin correo
- Cuando: Deja campo vacío
- Entonces: Campo marcado, mensaje "Campo obligatorio", no permite guardar

### Datos de Entrada
- Nombres (obligatorio)
- Apellidos (obligatorio)
- Nombre preferido (opcional)
- Tipo de identificación (DNI, CE, Pasaporte)
- Número de identificación
- País emisor (ISO 3166-1)
- Correo laboral (obligatorio)
- Teléfono laboral (opcional)
- Rol: Employee o Contractor (obligatorio)
- Unidad organizacional (si Employee)
- Jefe directo (si Employee, validar existe)
- Proveedor (si Contractor, obligatorio)

### Datos de Salida
- Código de colaborador (GUID, generado)
- Fecha de creación (ahora)
- Creado por (Jefe de Ingeniería actual)
- Estado: Vigente

### Casos Negativos
- Sin correo laboral (obligatorio)
- Correo duplicado
- Identificación duplicada
- Proveedor no existe
- Jefe directo no existe
- Unidad no existe
- Rol no válido
- Sin permisos

### Dependencias
- Prerequisito: Estructura organizacional existe (C3)
- Prerequisito: Proveedores registrados (C4)
- Prerequisito: Jefe autenticado en Keycloak (ADR-002)

**Prioridad:** MUST (entrada de cascada de datos maestros)

**Readiness:** CONDITIONAL
- ✅ Actor confirmado: Jefe de Ingeniería
- ✅ Valor confirmado: Registro completo desde día 1
- ✅ Reglas encontradas: BR-PTY-01, 02, 06, 07, 08, 13, 19, BR-PRF-02
- ⚠️ Bloqueador resuelto: Asignación de nivel inicial (ADR-006)
- ⚠️ Abierto: ¿Nivel por defecto por rol/producto? (Requiere decisión)

---

## US-016: Actualizar datos y medios de contacto

**Actor:** Jefe de Ingeniería

### Necesidad
Modificar la información personal (nombres, identificación, datos de contacto) de un colaborador después del registro inicial.

### Razón
Datos pueden cambiar (cambio de nombre legal, correo, teléfono); la plataforma debe mantener historial con vigencias sin sobrescritura.

### Reglas Aplicables
- BR-PTY-02: Vigencia; sin sobrescritura
- BR-PTY-13: Cierra vigencia anterior, abre nueva
- BR-PTY-08: Correo único entre vigentes

### Criterios de Aceptación
- Permite cambiar nombres, apellidos, identificación, correo, teléfono
- Validaciones de unicidad (DNI, correo)
- Mantiene historial (cierra vigencia anterior, abre nueva)
- Audita cambios (quién, cuándo)

**Prioridad:** MUST

---

## US-017: Gestionar la estructura organizacional

**Actor:** Jefe de Ingeniería

### Necesidad
Crear y mantener la estructura organizacional (COMSATEL, unidades, relaciones jerárquicas).

### Razón
Base para asignar colaboradores a unidades y jefes; define contexto organizacional.

**Prioridad:** MUST

---

## US-018: Gestionar proveedores y contratistas

**Actor:** Jefe de Ingeniería

### Necesidad
Registrar y mantener proveedores; necesario para asignar contratistas.

**Prioridad:** MUST

---

## US-019: Asignar un Rol-Nivel a una persona

**Actor:** Jefe de Ingeniería / Instructor

### Necesidad
Asignar o cambiar el nivel de competencia de un colaborador para un rol del catálogo.

**Prioridad:** MUST

---

## US-020: Asignar roles del programa

**Actor:** Jefe de Ingeniería

### Necesidad
Asignar un colaborador a un programa de formación con rol específico.

**Prioridad:** SHOULD

---

## US-021: Dar de baja a un colaborador

**Actor:** Jefe de Ingeniería

### Necesidad
Marcar un colaborador como no vigente (cierra relaciones, prepara para anonimización).

**Prioridad:** MUST

---

## US-022: Vincular la identidad de acceso

**Actor:** Jefe de Ingeniería

### Necesidad
Asociar usuario de Keycloak a un colaborador (habilita login).

**Prioridad:** MUST

---

## US-023: Consultar la ficha y su historial

**Actor:** Jefe de Ingeniería / Colaborador

### Necesidad
Ver información actual y cambios históricos de un colaborador.

**Prioridad:** SHOULD

---

## US-024: Anonimizar los datos personales

**Actor:** Jefe de Ingeniería

### Necesidad
Eliminar irreversiblemente datos personales (nombres, IDs, contacto) cuando colaborador se va; auditoría se conserva.

**Prioridad:** MUST

---

## US-025: Configurar el plazo de anonimización

**Actor:** Jefe de Ingeniería

### Necesidad
Definir cuántos días después de baja se ejecuta anonimización automática; recibir notificación previa.

**Prioridad:** SHOULD

---

## Dependencias Transversales

- **Prerequisito global:** Structure organizacional (C3) debe existir antes de registrar colaboradores
- **Prerequisito global:** Proveedores (C4) deben existir antes de asignar contratistas
- **Autenticación:** ADR-002 (Keycloak + PKCE) — todos requieren usuario autenticado
- **Catálogo:** Roles y competencias deben estar definidos (US-001)

## Próximos Pasos

1. Refinar cada story con diseño UX (UXR-001 a UXR-006)
2. Diseñar pantallas (GEN-001, GEN-002)
3. Implementar endpoints API (API-SPEC-001)
4. Desarrollar servicio Party Management (Phase 1a)

## Preguntas abiertas que bloquean delivery

- ¿Qué nivel por defecto para un Empleado nuevo? (Requiere decisión de negocio)
- ¿Notificación previa a anonimización? (Arquitectura de eventos)
- ¿Quién puede consultar fichas de otros? (Matriz de permisos detallada)
