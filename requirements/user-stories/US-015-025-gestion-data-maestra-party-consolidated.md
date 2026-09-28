# US-015 a US-025: Gestión de Data Maestra de Party — Consolidated Stories

**Documento consolidado de 11 User Stories refinadas de SPEC-001 §5 (Capacidades C1–C11)**

Generado: 2026-09-27 por `af-user-story-refiner/2.0`
Fuentes: SPEC-001, RCP-003, BRC-001 (BR-PTY-01 a BR-PTY-20), IMD-002
Contexto: RCP-003-gestion-data-maestra-party.md (459 líneas, validado)
Decisiones: Jefe de Ingeniería es dueño (D11), data abierta (D27), anonimización irreversible (D14), sin sobrescritura (BR-PTY-12)

---

## US-015: Registrar un colaborador

**Mapeo:** SPEC-001 C1 (Registrar un colaborador)

**Quién:** Jefe de Ingeniería

**Qué necesita:**
Registrar una nueva persona en la plataforma como colaborador (Empleado o Contratista), capturando toda la información maestra inicial (nombres, identificación, correo laboral, rol, unidad, jefe directo, proveedor si aplica).

**Por qué:**
Para que la plataforma tenga un registro completo del colaborador desde el día 1 de entrada, con trazabilidad de quién lo registró y cuándo (auditoría).

**Reglas aplicables:**
- BR-PTY-01: Plataforma es sistema de registro (no integra con RR. HH.)
- BR-PTY-02: Toda parte tiene vigencia; roles tienen fecha desde/hasta
- BR-PTY-06: Código de colaborador es único y se genera automáticamente (GUID)
- BR-PTY-07: Identificación única por tipo, número y país
- BR-PTY-08: Correo laboral es obligatorio y único entre vigentes
- BR-PTY-13: Sin sobrescritura; se cierra vigencia anterior y se abre nueva
- BR-PRF-02: Nivel inicial de Rol-Nivel se asigna al registrar (decisión ADR-006)

**Escenarios / Criterios de aceptación:**

```gherkin
Escenario 1: Registrar Empleado exitosamente
  Dado que el Jefe de Ingeniería está en la sección "Registrar colaborador"
  Cuando ingresa:
    • Nombres: Juan
    • Apellidos: Pérez López
    • Documento: DNI 12345678 (Perú)
    • Correo laboral: juan.perez@comsatel.com
    • Rol: Empleado
    • Unidad: Ingeniería Backend
    • Jefe directo: María García (existe)
  Entonces:
    • La plataforma genera código de colaborador (GUID)
    • Se registra la persona con fecha desde = hoy
    • Se crea rol Employee con fecha desde = hoy
    • Se crea relación "jefe directo" a María García
    • Mensaje: "Colaborador registrado exitosamente"
    • Auditoría: creado_por = Jefe de Ingeniería, fecha_creacion = ahora

Escenario 2: Registrar Contratista con proveedor
  Dado que el Jefe de Ingeniería registra un Contratista
  Cuando ingresa:
    • Rol: Contratista
    • Proveedor: TechCorp S.A. (existe)
    • Correo laboral: contractor@techcorp.com (del proveedor)
  Entonces:
    • Se crea relación "contratación" a TechCorp
    • No se asigna jefe directo (BR-PTY-19)
    • El correo es el del proveedor, no uno de COMSATEL

Escenario 3: Validación — Identificación duplicada
  Dado que intenta registrar un colaborador con DNI que ya existe
  Cuando ingresa DNI 12345678 (Perú) que ya está en la plataforma
  Entonces:
    • La plataforma muestra: "DNI ya existe en el sistema"
    • No permite registrar
    • Propone "actualizar registro existente" o "cancelar"

Escenario 4: Validación — Correo laboral duplicado
  Dado que intenta registrar con juan.perez@comsatel.com
  Cuando ese correo ya está asignado a otro colaborador vigente
  Entonces:
    • Muestra: "Correo laboral ya está en uso"
    • No permite registrar

Escenario 5: Validación — Falta correo laboral (obligatorio)
  Dado que intenta registrar sin ingresar correo laboral
  Cuando deja el campo vacío
  Entonces:
    • Campo marcado en rojo: "Campo obligatorio"
    • No permite guardar hasta que ingrese correo
```

**Casos negativos y edge cases:**
- Intentar registrar sin correo laboral (obligatorio)
- Correo laboral duplicado
- Identificación duplicada
- Proveedor no existe (si es Contratista)
- Jefe directo no existe
- Unidad no existe
- Rol no válido (solo Employee, Contractor)
- Sin permisos (solo Jefe de Ingeniería puede)

**Datos de entrada:**
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

**Datos de salida:**
- Código de colaborador (GUID, generado)
- Fecha de creación (ahora)
- Creado por (Jefe de Ingeniería actual)
- Estado: Vigente (hasta que se cierre fecha hasta)

**Accesibilidad (WCAG 2.2 AA):**
- Labels asociados a inputs
- Validaciones con mensajes de error claros
- Keyboard navigation
- Color + icono para errores (no solo color)
- Contraste ≥ 4.5:1

**Privacidad:**
- Los datos se capturan como PII (nombres, identificación)
- Se almacenan en la base de datos de forma segura
- Se pueden anonimizar si la persona se va (C10)
- Se muestran a cualquier colaborador logueado (BR-PTY-20, P-52)

**Dependencias:**
- Prerequisito: Estructura organizacional ya existe (C3)
- Prerequisito: Proveedores ya están registrados (C4)
- Prerequisito: Jefe de Ingeniería tiene permisos (ADR-002: autenticado en Keycloak)

**Estimación:** [Dejar en blanco — el equipo estima]

**Prioridad:** MUST (entrada de la cascada de datos maestros)

**Readiness:** CONDITIONAL
- ✅ Actor confirmado: Jefe de Ingeniería
- ✅ Valor confirmado: Registro completo desde día 1
- ✅ Reglas encontradas: BR-PTY-01, 02, 06, 07, 08, 13, 19, BR-PRF-02
- ⚠️ Bloqueador: ¿Cómo se asigna el nivel inicial de Rol-Nivel al registrar? (Respondido en ADR-006: Jefe de Ingeniería o Instructor decide)
- ⚠️ Abierto: ¿Qué nivel por defecto para un Empleado nuevo? (Requiere decisión por rol/producto)

---

## US-016: Actualizar datos y medios de contacto

**Mapeo:** SPEC-001 C2

**Quién:** Jefe de Ingeniería (todos los datos), Colaborador (solo perfiles y teléfono)

**Qué necesita:**
Cambiar datos de una persona registrada (nombres, identificación, contactos, etc.) sin sobrescribir la vigencia anterior; dejar registro de cambios.

**Escenarios / Criterios:**
- Actualizar nombres de un colaborador
- Cambiar identificación (nueva cédula)
- Agregar/cambiar teléfono laboral
- Editar perfil profesional (LinkedIn, GitHub)
- Cambiar correo laboral (cierra anterior, abre nuevo)

**Nota:** Roles, relaciones, asignaciones → no se actualizan aquí, van a C5 o C6 (new vigencia, no sobrescritura)

**Readiness:** CONDITIONAL (depende de C1 exitoso; personas ya registradas)

---

## US-017: Gestionar la estructura organizacional

**Mapeo:** SPEC-001 C3

**Quién:** Jefe de Ingeniería

**Qué necesita:**
Crear/editar COMSATEL, unidades internas, y la jerarquía entre unidades (quién es unidad padre de quién).

**Escenarios:**
- Crear Organización Interna (COMSATEL)
- Crear Unidad Organizacional (Ingeniería, Ventas, etc.)
- Establecer jerarquía (Ingeniería es hijo de COMSATEL)
- Cambiar estructura (Ingeniería Backend es hijo de Ingeniería, no de COMSATEL)

**Readiness:** CONDITIONAL (estructura base probablemente existe; actualización es el caso más común)

---

## US-018: Gestionar proveedores y contratistas

**Mapeo:** SPEC-001 C4

**Quién:** Jefe de Ingeniería

**Qué necesita:**
Registrar proveedores (organizaciones externas) y vincular contratistas a sus respectivos proveedores.

**Escenarios:**
- Crear nuevo Proveedor (TechCorp S.A., RUC 12345678901)
- Registrar Contratista vinculado a Proveedor
- Cerrar relación contratista-proveedor (cambio de proveedor)

**Readiness:** CONDITIONAL (requisito para registrar contratistas en C1)

---

## US-019: Asignar un Rol-Nivel a una persona

**Mapeo:** SPEC-001 C5, ADR-006

**Quién:** Jefe de Ingeniería

**Qué necesita:**
Asignar (o cambiar) el nivel de un Rol del catálogo a un colaborador. Un solo nivel vigente por rol (cierra anterior, abre nuevo).

**Escenarios:**
- Asignar "Developer Junior Nivel 1" al registrar (BR-PRF-02)
- Cambiar a "Developer Junior Nivel 2" tras completar curso (ADR-006)
- Cambiar a "Developer Senior Nivel 3" tras demostrar desempeño

**Reglas:**
- BR-PTY-11: Un solo nivel vigente por rol
- BR-PRF-02: Nivel inicial se asigna al registrar
- ADR-006: Upgrade se decide mediante mecanismo hybrid (curso + desempeño + IA + Jefe/Instructor)

**Readiness:** CONDITIONAL (depende de C1; depende de que catálogo de Roles-Niveles exista)

---

## US-020: Asignar roles del programa

**Mapeo:** SPEC-001 C6

**Quién:** Jefe de Ingeniería

**Qué necesita:**
Asignar los roles "Evaluador" o "Jefe de Ingeniería" a colaboradores. Estos son roles de gestión del programa (BR-PRG-01, BR-PRG-02).

**Escenarios:**
- Asignar "Evaluador" a María García
- Asignar "Jefe de Ingeniería" a ianache
- Cambiar Evaluador (cierra anterior, abre nuevo)

**Nota:** BR-PRG-01 y BR-PRG-02 marcan que son "solo gestores del programa, fuera del proceso de evaluación".

**Readiness:** CONDITIONAL (depende de C1)

---

## US-021: Dar de baja a un colaborador

**Mapeo:** SPEC-001 C7

**Quién:** Jefe de Ingeniería

**Qué necesita:**
Cerrar la vigencia del rol Employee o Contractor de una persona. La persona NO se borra; solo se marca como "dada de baja" (BR-PTY-13).

**Escenarios:**
- Dar de baja a un Empleado que se va de la empresa
- Cierra fecha_hasta del rol Employee
- Se registra fecha_hasta (hoy)
- No se borra el registro; queda para auditoría + certificaciones históricas

**Reglas:**
- BR-PTY-13: Persona dada de baja NO se borra (sus certificaciones la necesitan)
- D17: Plazo de anonimización se cuenta desde que se registra la baja
- C11: Tras vencer plazo, se notifica al Jefe de Ingeniería que puede anonimizar

**Readiness:** CONDITIONAL (depende de C1; desencadena C10/C11)

---

## US-022: Vincular la identidad de acceso

**Mapeo:** SPEC-001 C8

**Quién:** Jefe de Ingeniería

**Qué necesita:**
Registrar el UUID del usuario de Keycloak de una persona. Pueden quedar sin vínculo (0..1 relación).

**Escenarios:**
- Registrar UUID de Keycloak tras crear usuario en Keycloak
- Cambiar UUID (si usuario se recrea)
- Dejar sin vínculo (persona registrada pero aún no acceso)

**Regla:**
- BR-PTY-16: La plataforma guarda solo el UUID; Keycloak se gestiona aparte (ADR-002)

**Readiness:** CONDITIONAL (depende de C1; no bloquea otras capacidades)

---

## US-023: Consultar la ficha y su historial

**Mapeo:** SPEC-001 C9

**Quién:** Jefe de Ingeniería (cualquier persona), Colaborador (la suya)

**Qué necesita:**
Ver la ficha completa de una persona: datos actuales + historial de cambios (vigencias cerradas).

**Escenarios:**
- Jefe de Ingeniería consulta ficha de Juan (todos sus datos históricos)
- Colaborador consulta su propia ficha (ve todo)
- Colaborador intenta ver ficha de otro → muestra solo: nombre, correo, rol, unidad, perfiles profesionales (P-52)

**Reglas:**
- D27, P-52: Data abierta pero limitada (no mostrar código, identificación, teléfono a otros colaboradores)
- BR-PTY-12: Historial de cambios (vigencias cerradas) siempre visible para Jefe

**Readiness:** CONDITIONAL (depende de C1; busca de personas también)

---

## US-024: Anonimizar los datos personales de una persona dada de baja

**Mapeo:** SPEC-001 C10

**Quién:** Jefe de Ingeniería (ejecución manual)

**Qué necesita:**
Reemplazar irreversiblemente los datos personales (PII) de una persona que ya fue dada de baja. Se conserva código, referencias de auditoría, roles, relaciones, asignaciones, certificaciones.

**Escenarios:**
- Jefe consulta lista de personas que pueden anonimizarse (dadas de baja + plazo vencido)
- Selecciona una persona
- Presiona "Anonimizar"
- Plataforma reemplaza: nombres, apellidos, identificación, correo, teléfono, perfiles, UUID Keycloak
- Deja intacto: código, referencias de auditoría (creado_por, actualizado_por), roles, relaciones, asignaciones, certificaciones
- Registra: quién anonimizó, cuándo

**Reglas:**
- BR-PTY-14: Anonimización es irreversible
- D14: Se conserva código y referencias de auditoría
- D16: Riesgo de cuasi-identificación; código es GUID no reutilizable

**Casos negativos:**
- Intentar anonimizar persona con roles vigentes (no permitir; solo dadas de baja)
- Intentar "desanonimizar" (no existe; es irreversible)

**Accesibilidad + Privacidad:**
- Confirmación explícita: "Esta acción es irreversible. ¿Está seguro?"
- Log completo de anonimización

**Readiness:** CONDITIONAL (depende de C7 exitoso; requiere persona dada de baja)

---

## US-025: Configurar el plazo de anonimización y recibir el aviso

**Mapeo:** SPEC-001 C11

**Quién:** Jefe de Ingeniería (configura plazo), Plataforma (envía aviso automático)

**Qué necesita:**
- Jefe de Ingeniería configura el plazo (ej: 90 días) tras el cual se notifica que una persona puede anonimizarse
- Cuando vence el plazo para una persona dada de baja, la plataforma automáticamente envía correo de aviso al Jefe

**Escenarios:**
- Jefe ingresa en "Configuración" → "Plazo de anonimización" → "90 días"
- Guardar cambio
- Persona se da de baja el 2026-06-15
- Plazo vence el 2026-09-15
- Plataforma automáticamente genera AVISO (registra en BD)
- Plataforma envía correo a todos los Jefes de Ingeniería vigentes (a sus correos laborales)
- Aviso contiene: nombre de persona (anonimizado), fecha de baja, acción sugerida

**Reglas:**
- D15: Plazo es configurable
- D17: Se cuenta desde fecha de baja registrada
- D18: Aviso se envía automáticamente al vencer
- D20: Si hay múltiples Jefes, se envía a todos
- D21: Plataforma avisa sin impedirlo si hay más de un Jefe vigente

**Casos:**
- Plazo no configurado (usar default si existe)
- No hay Jefe de Ingeniería vigente (aviso queda como "no enviado", pero se registra)
- Envío de correo falla (reintentos automáticos)

**Accesibilidad:**
- Configuración en sección clara, con help text explicando el plazo

**Readiness:** CONDITIONAL
- ✅ Plazo configurable está claro
- ⚠️ Bloqueador: ¿Cuál es el plazo default si Jefe no lo configura? (Abierto: INTEG-01 en RCP-003)
- ⚠️ Bloqueador: ¿Cómo se manejan fallos de envío de correo? (Plan de contingencia: INTEG-01)

---

## Resumen de 11 User Stories

| US | Capacidad | Actor principal | Readiness | Bloqueador principal |
|---|---|---|---|---|
| **US-015** | Registrar colaborador | Jefe Ingeniería | CONDITIONAL | ¿Nivel inicial default por rol? |
| **US-016** | Actualizar datos | Jefe Ingeniería + Colaborador | CONDITIONAL | Depende de US-015 |
| **US-017** | Gestionar estructura org. | Jefe Ingeniería | CONDITIONAL | Estructura base debe existir |
| **US-018** | Gestionar proveedores | Jefe Ingeniería | CONDITIONAL | Depende de US-017 |
| **US-019** | Asignar Rol-Nivel | Jefe Ingeniería | CONDITIONAL | Depende de catálogo + ADR-006 |
| **US-020** | Asignar roles programa | Jefe Ingeniería | CONDITIONAL | Depende de US-015 |
| **US-021** | Dar de baja | Jefe Ingeniería | CONDITIONAL | Desencadena US-024, US-025 |
| **US-022** | Vincular Keycloak | Jefe Ingeniería | CONDITIONAL | ADR-002 (tokens, sesiones) |
| **US-023** | Consultar ficha | Jefe Ingeniería + Colaborador | CONDITIONAL | P-52 (clasificación datos) |
| **US-024** | Anonimizar datos | Jefe Ingeniería | CONDITIONAL | Depende de US-021 |
| **US-025** | Configurar plazo + aviso | Jefe Ingeniería + Sistema | CONDITIONAL | INTEG-01 (plan contingencia correo) |

---

## Preguntas abiertas que bloquean delivery

| ID | Pregunta | Owner | Impacto |
|---|---|---|---|
| **US-015-Q1** | ¿Cuál es el nivel Rol-Nivel default para un Empleado nuevo registrado? | Jefe Ingeniería | Bloquea US-015 (decide si Jefe asigna o hay valor default) |
| **INTEG-01** | ¿Plan de contingencia si falla envío de correo de aviso de anonimización? | DevOps | Bloquea US-025 (reintentos, escalada manual, etc.) |

---

## Próximos pasos

1. ✅ **Refinar cada US en archivo individual** (US-015.md a US-025.md)
   - Copiar template `templates/output-template.md`
   - Llenar cada sección
   - Incluir acceptance criteria en Gherkin
   - Validar INVEST + Definition of Ready

2. ⏳ **Validación humana** (Jefe de Ingeniería)
   - Confirmar actores, reglas, criterios
   - Cerrar preguntas abiertas

3. ⏳ **Estimación y priorización** (Equipo de desarrollo)
   - Estimar puntos de historia
   - Priorizar en backlog

4. ⏳ **Diseño UX** (User Story Refiner + UX team)
   - Crear mockups (SCR-*)
   - Validar flujos con Jefe de Ingeniería

---

**Generado:** 2026-09-27 23:55
**Por:** af-user-story-refiner/2.0
**Verificación humana:** Pendiente
**Status:** READY FOR SPLIT & INDIVIDUAL FILES
