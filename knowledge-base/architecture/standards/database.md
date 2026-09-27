---
type: Architecture Standard
title: "STD-DB-001 — Estándar de base de datos: naming conventions y estructura"
description: "Convenciones de naming (snake_case + prefijos), constraints, DDL portable MySQL/PostgreSQL."
tags: [architecture, standard, database, naming-convention, ddl]
status: approved
generated:
  by: "web-atomic-component-designer/1.0"
  at: "2026-09-27T21:00:00-05:00"
sources:
  - id: adr-003
    resource: /knowledge-base/architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
  - id: ldm-001
    resource: /knowledge-base/architecture/data-model/LDM-001-modelo-de-datos-logico.md
---

# STD-DB-001 — Estándar de base de datos

## 1. Resumen

**Objetivo:** Establecer convenciones de naming y estructura consistentes para todas las definiciones de base de datos (DDL) en la Plataforma de Gestión de Formación.

**Scope:** MySQL 8.0.16+, PostgreSQL 12+, DDL portable + per-engine variantes.

**Aplicable a:** Todas las migraciones, fixtures, y artefactos DDL en el repositorio.

---

## 2. Convenciones de naming

### 2.1 Identadores: `snake_case` (minúsculas con guiones bajos)

**Regla:** TODOS los identificadores (tablas, columnas, índices, constraints, procedures) usan `snake_case`.

**Racional:** 
- Portable entre MySQL y PostgreSQL sin escaping
- Legible y consistente
- Compatible con migrations tools (Alembic, Flyway, etc.)

**Ejemplo válido:**
```sql
CREATE TABLE tb_colaborador (
  pk_colaborador_id BIGINT PRIMARY KEY,
  fk_empleado_id BIGINT NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_colaborador_empleado_id ON tb_colaborador(fk_empleado_id);
```

**Ejemplos inválidos:**
```sql
-- ❌ PascalCase
CREATE TABLE TbColaborador { ... }

-- ❌ camelCase
CREATE TABLE tbColaborador { ... }

-- ❌ MAYÚSCULAS SIN SEPARACIÓN
CREATE TABLE TBCOLABORADOR { ... }

-- ❌ Espacios
CREATE TABLE "tb colaborador" { ... }
```

---

## 3. Prefijos obligatorios

### 3.1 Tablas: `tb_`

**Patrón:** `tb_<nombre_entidad_plural>`

| Entidad | Tabla | Lógica |
|---|---|---|
| Rol | `tb_rol` | Definición de roles en el catálogo |
| Competencia | `tb_competencia` | Catálogo de competencias |
| Colaborador | `tb_colaborador` | Personas con roles vigentes |
| Empleado | `tb_empleado` | Colaborador con rol Empleado |
| Contratista | `tb_contratista` | Colaborador con rol Contratista |
| Rol-Nivel | `tb_rol_nivel` | Definición de niveles para cada rol |
| Competencia-Rol | `tb_competencia_rol` | Asignación de competencias a rol-nivel |
| Proyecto | `tb_proyecto` | Proyectos y sus requisitos (maestro externo) |
| Requerimiento | `tb_requerimiento` | Necesidad de rol-nivel + competencias en proyecto |
| Certificación | `tb_certificacion` | Registro de evaluación y certificación |
| Evidencia | `tb_evidencia` | Artefactos/archivos que respaldan competencia |
| Brecha | `tb_brecha` | Vista de diferencia entre actual y objetivo (derivada) |
| Auditoría | `tb_auditoria` | Log de cambios en registros críticos |

**Convención en pares (Entidad + Join):**
```sql
-- Tabla principal
CREATE TABLE tb_rol (
  pk_rol_id BIGINT PRIMARY KEY,
  nombre_rol VARCHAR(255) NOT NULL UNIQUE
);

-- Tabla de asociación (muchos-a-muchos)
CREATE TABLE tb_rol_competencia (
  pk_rol_competencia_id BIGINT PRIMARY KEY,
  fk_rol_id BIGINT NOT NULL REFERENCES tb_rol(pk_rol_id),
  fk_competencia_id BIGINT NOT NULL REFERENCES tb_competencia(pk_competencia_id),
  nivel_esperado INT NOT NULL CHECK (nivel_esperado IN (1, 2, 3, 4))
);
```

---

### 3.2 Vistas: `vw_`

**Patrón:** `vw_<descripcion_corta>`

| Vista | Propósito |
|---|---|
| `vw_colaborador_actual` | Todos los colaboradores con roles vigentes (1 por persona) |
| `vw_brecha_individual` | Brecha de cada colaborador vs rol-nivel actual |
| `vw_requerimiento_abierto` | Requerimientos sin candidatos asignados |
| `vw_certificacion_vigente` | Certificaciones activas (no expiradas) |
| `vw_auditoria_reciente` | Últimas N operaciones de negocio |

**Ejemplo:**
```sql
CREATE VIEW vw_colaborador_actual AS
SELECT
  c.pk_colaborador_id,
  c.fk_persona_id,
  p.nombre_completo,
  c.fk_rol_vigente_id,
  r.nombre_rol,
  c.fk_nivel_vigente_id
FROM tb_colaborador c
JOIN tb_persona p ON c.fk_persona_id = p.pk_persona_id
JOIN tb_rol r ON c.fk_rol_vigente_id = r.pk_rol_id
WHERE c.fecha_fin_vigencia IS NULL;  -- Vigente = sin fecha de fin
```

---

### 3.3 Stored Procedures: `sp_`

**Patrón:** `sp_<verbo>_<entidad>`

| Procedure | Acción |
|---|---|
| `sp_create_colaborador` | Crear nuevo colaborador + asignar rol-nivel inicial |
| `sp_update_rol_nivel` | Actualizar rol-nivel vigente de un colaborador |
| `sp_certify_competency` | Registrar certificación de competencia |
| `sp_calculate_gap` | Calcular brecha entre actual y objetivo |
| `sp_recalculate_audits` | Re-auditar cambios en datos maestros |
| `sp_archive_old_certifications` | Archivar certificaciones expiradas (scheduled) |

**Ejemplo:**
```sql
DELIMITER $$
CREATE PROCEDURE sp_certify_competency (
  IN p_colaborador_id BIGINT,
  IN p_competencia_id BIGINT,
  IN p_nivel INT,
  IN p_evaluador_id BIGINT,
  IN p_sustento TEXT,
  OUT p_certificacion_id BIGINT
)
BEGIN
  INSERT INTO tb_certificacion (
    fk_colaborador_id,
    fk_competencia_id,
    nivel_certificado,
    fk_evaluador_id,
    sustento,
    fecha_certificacion
  ) VALUES (
    p_colaborador_id,
    p_competencia_id,
    p_nivel,
    p_evaluador_id,
    p_sustento,
    NOW()
  );
  SET p_certificacion_id = LAST_INSERT_ID();
END$$
DELIMITER ;
```

---

### 3.4 Índices: `idx_`

**Patrón:** `idx_<tabla>_<columnas>`

| Índice | Tabla | Columnas | Razón |
|---|---|---|---|
| `idx_colaborador_empleado_id` | `tb_colaborador` | `(fk_empleado_id)` | FK lookup |
| `idx_competencia_rol_id_competencia_id` | `tb_competencia_rol` | `(fk_rol_id, fk_competencia_id)` | Composite for distinct per role |
| `idx_certificacion_colaborador_id_fecha` | `tb_certificacion` | `(fk_colaborador_id, fecha_certificacion DESC)` | Recent certs per person |
| `idx_requerimiento_proyecto_id` | `tb_requerimiento` | `(fk_proyecto_id)` | Project lookup |

**Ejemplo:**
```sql
CREATE INDEX idx_colaborador_empleado_id ON tb_colaborador(fk_empleado_id);
CREATE INDEX idx_certificacion_colaborador_id_fecha ON tb_certificacion(
  fk_colaborador_id,
  fecha_certificacion DESC
);

-- Índice único (constraint + índice)
CREATE UNIQUE INDEX idx_colaborador_persona_vigente ON tb_colaborador(
  fk_persona_id,
  fecha_fin_vigencia
)
WHERE fecha_fin_vigencia IS NULL;  -- Solo una vigencia por persona
```

---

### 3.5 Campos: `pk_` y `fk_`

**Primary Key: `pk_<tabla_singular>_id`**

| Tabla | PK |
|---|---|
| `tb_rol` | `pk_rol_id` |
| `tb_competencia` | `pk_competencia_id` |
| `tb_colaborador` | `pk_colaborador_id` |
| `tb_certificacion` | `pk_certificacion_id` |

**Foreign Key: `fk_<tabla_referenciada_singular>_id`**

| Tabla | FK | Referencia |
|---|---|---|
| `tb_colaborador` | `fk_empleado_id` | `tb_empleado(pk_empleado_id)` |
| `tb_competencia_rol` | `fk_rol_id` | `tb_rol(pk_rol_id)` |
| `tb_competencia_rol` | `fk_competencia_id` | `tb_competencia(pk_competencia_id)` |
| `tb_certificacion` | `fk_colaborador_id` | `tb_colaborador(pk_colaborador_id)` |
| `tb_certificacion` | `fk_evaluador_id` | `tb_evaluador(pk_evaluador_id)` |

**Ejemplo:**
```sql
CREATE TABLE tb_certificacion (
  pk_certificacion_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  fk_colaborador_id BIGINT NOT NULL,
  fk_competencia_id BIGINT NOT NULL,
  fk_evaluador_id BIGINT NOT NULL,
  nivel_certificado INT NOT NULL,
  fecha_certificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_certificacion_colaborador
    FOREIGN KEY (fk_colaborador_id)
    REFERENCES tb_colaborador(pk_colaborador_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  
  CONSTRAINT fk_certificacion_competencia
    FOREIGN KEY (fk_competencia_id)
    REFERENCES tb_competencia(pk_competencia_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  
  CONSTRAINT fk_certificacion_evaluador
    FOREIGN KEY (fk_evaluador_id)
    REFERENCES tb_evaluador(pk_evaluador_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
```

---

## 4. Convenciones de estructura

### 4.1 Tipos de datos

| Tipo | Uso | MySQL | PostgreSQL |
|---|---|---|---|
| **Identificador único** | PK, GUID | `BIGINT AUTO_INCREMENT` o `CHAR(36)` | `BIGSERIAL` o `UUID` |
| **Texto corto** (0–255 chars) | Nombres, códigos | `VARCHAR(255)` | `VARCHAR(255)` |
| **Texto largo** (>255 chars) | Descriptores, sustento | `TEXT` | `TEXT` |
| **Números enteros** | Niveles (1–4) | `INT` | `INTEGER` |
| **Números decimales** | Porcentajes, calificaciones | `DECIMAL(5,2)` | `NUMERIC(5,2)` |
| **Booleano** | Flags (vigente/no vigente) | `TINYINT(1)` | `BOOLEAN` |
| **Fecha/Hora** | Timestamps | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` |
| **Fecha solo** | Fechas sin hora | `DATE` | `DATE` |
| **Enum** | Enumeraciones (roles, estados) | `ENUM('val1','val2')` | `CREATE TYPE ... AS ENUM` |

**Ejemplo:**
```sql
CREATE TABLE tb_rol (
  pk_rol_id BIGINT PRIMARY KEY AUTO_INCREMENT,  -- MySQL
  -- pk_rol_id BIGSERIAL PRIMARY KEY,           -- PostgreSQL
  
  nombre_rol VARCHAR(255) NOT NULL,
  descripcion TEXT,
  
  nivel_minimo INT DEFAULT 1 CHECK (nivel_minimo BETWEEN 1 AND 4),
  nivel_maximo INT DEFAULT 4 CHECK (nivel_maximo BETWEEN 1 AND 4),
  
  es_activo BOOLEAN DEFAULT TRUE,  -- PostgreSQL
  -- es_activo TINYINT(1) DEFAULT 1,           -- MySQL
  
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 4.2 Constraints obligatorios

| Constraint | Patrón | Ejemplo |
|---|---|---|
| **Primary Key** | `PRIMARY KEY (pk_*)` | `PRIMARY KEY (pk_rol_id)` |
| **Foreign Key** | `FOREIGN KEY (fk_*) REFERENCES tb_*(pk_*)` | `FOREIGN KEY (fk_rol_id) REFERENCES tb_rol(pk_rol_id)` |
| **UNIQUE** | Campos con valores únicos | `UNIQUE(nombre_rol)` |
| **NOT NULL** | Campos obligatorios | `nombre_rol VARCHAR(255) NOT NULL` |
| **CHECK** | Validación de rango/valores | `CHECK (nivel BETWEEN 1 AND 4)` |
| **DEFAULT** | Valor por defecto | `DEFAULT CURRENT_TIMESTAMP` |

**Ejemplo:**
```sql
CREATE TABLE tb_rol (
  pk_rol_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nombre_rol VARCHAR(255) NOT NULL UNIQUE,
  descripcion TEXT,
  nivel_minimo INT NOT NULL DEFAULT 1 CHECK (nivel_minimo BETWEEN 1 AND 4),
  nivel_maximo INT NOT NULL DEFAULT 4 CHECK (nivel_maximo >= nivel_minimo),
  es_activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT ck_rol_niveles CHECK (nivel_minimo <= nivel_maximo)
);
```

---

### 4.3 Auditoría y campos de control

**Campos obligatorios en todas las tablas principales:**

```sql
CREATE TABLE tb_<entidad> (
  -- ... columnas de negocio ...
  
  -- Auditoría (obligatorio)
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fk_creado_por_id BIGINT,  -- opcional: referencia a usuario creador
  fk_actualizado_por_id BIGINT  -- opcional: referencia a usuario que actualizó
);
```

---

## 5. Portabilidad MySQL ↔ PostgreSQL

### 5.1 Diferencias conocidas

| Característica | MySQL | PostgreSQL | Solución |
|---|---|---|---|
| **Auto-increment** | `AUTO_INCREMENT` | `SERIAL` | Usar variantes por engine |
| **Booleano** | `TINYINT(1)` | `BOOLEAN` | Variantes por engine |
| **Timestamp** | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Portable |
| **ENUM** | `ENUM('val1','val2')` | `CREATE TYPE ... AS ENUM` | Crear tipo en PostgreSQL |
| **UUID** | `CHAR(36)` | `UUID` | Variantes por engine (si usamos GUID) |

### 5.2 DDL portable + per-engine

**Estructura de migraciones:**

```
migrations/
  ├── portable/           # Portable entre ambos engines
  │   ├── V001__init.sql  # CREATE TABLE tb_rol
  │   └── V002__fk.sql    # ADD FOREIGN KEY CONSTRAINTS
  │
  ├── mysql/              # MySQL-específico (si aplica)
  │   └── V001__enum.sql  # CREATE ENUM (si necesario)
  │
  └── postgresql/         # PostgreSQL-específico (si aplica)
      └── V001__enum.sql  # CREATE TYPE ... AS ENUM
```

**Ejemplo de migración portable:**

```sql
-- migrations/portable/V001__init.sql

-- MySQL:
-- CREATE TABLE tb_rol (
--   pk_rol_id BIGINT PRIMARY KEY AUTO_INCREMENT,
--   ...
-- );

-- PostgreSQL:
-- CREATE TABLE tb_rol (
--   pk_rol_id BIGSERIAL PRIMARY KEY,
--   ...
-- );

-- Portable:
CREATE TABLE tb_rol (
  pk_rol_id BIGINT PRIMARY KEY,  -- Application generates ID (GUID)
  nombre_rol VARCHAR(255) NOT NULL UNIQUE,
  descripcion TEXT,
  nivel_minimo INT NOT NULL DEFAULT 1 CHECK (nivel_minimo BETWEEN 1 AND 4),
  nivel_maximo INT NOT NULL DEFAULT 4 CHECK (nivel_maximo BETWEEN 1 AND 4),
  es_activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Tool:** Flyway o Alembic (ambos soportan múltiples engines con scripts separados).

---

## 6. Ejemplos completos

### 6.1 Tabla simple: Rol

```sql
CREATE TABLE tb_rol (
  pk_rol_id BIGINT PRIMARY KEY,
  nombre_rol VARCHAR(255) NOT NULL UNIQUE,
  descripcion TEXT,
  nivel_minimo INT NOT NULL DEFAULT 1,
  nivel_maximo INT NOT NULL DEFAULT 4,
  es_activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT ck_rol_niveles CHECK (nivel_minimo <= nivel_maximo),
  CONSTRAINT ck_rol_niveles_range CHECK (nivel_minimo BETWEEN 1 AND 4 AND nivel_maximo BETWEEN 1 AND 4)
);

CREATE INDEX idx_rol_es_activo ON tb_rol(es_activo);
```

### 6.2 Tabla con FK: Colaborador

```sql
CREATE TABLE tb_colaborador (
  pk_colaborador_id BIGINT PRIMARY KEY,
  fk_persona_id BIGINT NOT NULL,
  fk_rol_vigente_id BIGINT NOT NULL,
  fk_nivel_vigente_id INT NOT NULL,
  
  fecha_inicio_vigencia DATE NOT NULL,
  fecha_fin_vigencia DATE,  -- NULL = vigente
  
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_colaborador_persona
    FOREIGN KEY (fk_persona_id)
    REFERENCES tb_persona(pk_persona_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  
  CONSTRAINT fk_colaborador_rol
    FOREIGN KEY (fk_rol_vigente_id)
    REFERENCES tb_rol(pk_rol_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  
  CONSTRAINT ck_colaborador_vigencia CHECK (fecha_inicio_vigencia <= COALESCE(fecha_fin_vigencia, DATE '2099-12-31'))
);

CREATE INDEX idx_colaborador_persona_id ON tb_colaborador(fk_persona_id);
CREATE INDEX idx_colaborador_rol_vigente_id ON tb_colaborador(fk_rol_vigente_id);
CREATE UNIQUE INDEX idx_colaborador_persona_vigente ON tb_colaborador(fk_persona_id) WHERE fecha_fin_vigencia IS NULL;
```

### 6.3 Vista: Colaborador vigente

```sql
CREATE VIEW vw_colaborador_actual AS
SELECT
  c.pk_colaborador_id,
  c.fk_persona_id,
  p.nombre_completo,
  p.correo_laboral,
  c.fk_rol_vigente_id,
  r.nombre_rol,
  c.fk_nivel_vigente_id,
  c.fecha_inicio_vigencia
FROM tb_colaborador c
JOIN tb_persona p ON c.fk_persona_id = p.pk_persona_id
JOIN tb_rol r ON c.fk_rol_vigente_id = r.pk_rol_id
WHERE c.fecha_fin_vigencia IS NULL;
```

### 6.4 Stored Procedure: Crear Colaborador

```sql
DELIMITER $$
CREATE PROCEDURE sp_create_colaborador (
  IN p_persona_id BIGINT,
  IN p_rol_id BIGINT,
  IN p_nivel INT,
  IN p_fecha_inicio DATE,
  OUT p_colaborador_id BIGINT,
  OUT p_error_message VARCHAR(255)
)
MODIFIES SQL DATA
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET p_error_message = 'Error al crear colaborador';
    ROLLBACK;
  END;
  
  START TRANSACTION;
  
  -- Validar que la persona existe
  IF NOT EXISTS (SELECT 1 FROM tb_persona WHERE pk_persona_id = p_persona_id) THEN
    SET p_error_message = 'Persona no encontrada';
    ROLLBACK;
    LEAVE;
  END IF;
  
  -- Validar que el rol existe
  IF NOT EXISTS (SELECT 1 FROM tb_rol WHERE pk_rol_id = p_rol_id AND es_activo = TRUE) THEN
    SET p_error_message = 'Rol no encontrado o no activo';
    ROLLBACK;
    LEAVE;
  END IF;
  
  -- Insertar colaborador
  INSERT INTO tb_colaborador (
    pk_colaborador_id,
    fk_persona_id,
    fk_rol_vigente_id,
    fk_nivel_vigente_id,
    fecha_inicio_vigencia,
    fecha_fin_vigencia
  ) VALUES (
    UUID(),
    p_persona_id,
    p_rol_id,
    p_nivel,
    p_fecha_inicio,
    NULL
  );
  
  SET p_colaborador_id = LAST_INSERT_ID();
  SET p_error_message = NULL;
  
  -- Registrar en auditoría
  INSERT INTO tb_auditoria (
    operacion,
    tabla,
    registro_id,
    cambios,
    fecha_operacion
  ) VALUES (
    'INSERT',
    'tb_colaborador',
    p_colaborador_id,
    CONCAT('Nuevo colaborador: persona_id=', p_persona_id, ', rol_id=', p_rol_id),
    NOW()
  );
  
  COMMIT;
END$$
DELIMITER ;
```

---

## 7. Checklist: Antes de mergear DDL

- [ ] **Naming:** Todos los identificadores en `snake_case`
- [ ] **Prefijos:** Tablas `tb_`, vistas `vw_`, procedures `sp_`, índices `idx_`, PKs `pk_`, FKs `fk_`
- [ ] **Constraints:** PK, FK, UNIQUE, NOT NULL, CHECK documentados
- [ ] **Auditoría:** `fecha_creacion`, `fecha_actualizacion` en tablas principales
- [ ] **Índices:** Índices en FKs y columnas de búsqueda frecuente
- [ ] **Portabilidad:** DDL portable MySQL/PostgreSQL (sin `AUTO_INCREMENT` si usamos GUID)
- [ ] **Tests:** Fixtures y tests pasan en ambos engines
- [ ] **Documentación:** Comentarios DDL si la lógica no es obvia

---

## 8. Referencias

| Documento | Descripción |
|---|---|
| [ADR-003](../adrs/ADR-003-persistencia-mysql-y-postgresql.md) | Decisión de persistencia MySQL/PostgreSQL |
| [LDM-001](../data-model/LDM-001-modelo-de-datos-logico.md) | Modelo de datos lógico |
| [DDL MySQL](../data-model/ddl/party-mysql.sql) | DDL MySQL actual |
| [DDL PostgreSQL](../data-model/ddl/party-postgresql.sql) | DDL PostgreSQL actual |

---

## 9. Aprobación

**Status:** `approved`

**Aprobado por:** [Responsable de arquitectura — Confirmar en revisión]

**Efectiva desde:** 2026-09-27

**Última revisión:** 2026-09-27

**Próxima revisión:** 2026-12-27

---
