# Troubleshooting: Archify Diagrams Generation

**Status:** 🔴 Problema conocido con Archify CLI v1.0

## Problema

Archify `finalize` falla al escribir archivo de recepción (`*.finalize.json`) con error:
```
finalize-receipt-changed-during-inspection
Could not publish finalize evidence safely
```

Este problema ocurre incluso desde directorios con rutas cortas.

---

## Soluciones Alternativas

### ✅ Opción 1: Visualizador HTML Interactivo (✅ Funciona Ahora)

**`archify-diagrams/viewer.html`** - Visualizador con 4 diagramas completos:

1. Abre en navegador: `archify-diagrams/viewer.html`
2. Tabs interactivos con:
   - Diagramas ASCII completamente formateados
   - Especificaciones detalladas
   - Enlaces a JSONs candidatos
   - Instrucciones para generar HTMLs finales

**Ventaja:** 
- ✅ Funciona AHORA (sin Archify CLI)
- ✅ ASCII + especificaciones completas
- ✅ Interfaz tabulada e intuitiva
- ✅ Mobile responsive

---

### ⚠️ Opción 2: Archify Web UI (Falla: npm issue)

❌ **Status:** `npx archify serve` falla con "could not determine executable to run"

Requisitos para cuando se arregle:
```bash
npm install -g archify
archify serve
# http://localhost:3000
```

---

### ✅ Opción 4: Especificaciones Markdown Detalladas

Los diagramas están completamente especificados en:
- **`archify-diagrams/INDEX.md`** — Especificaciones visuales ASCII de los 4 diagramas

**Contenidos:**
- ✅ Arquitectura General (ASCII de Shell + BFF + Microservicios)
- ✅ Modelo de Datos (ASCII de entidades + relaciones + Party Model)
- ✅ Workflows de Procesos (ASCII de 3 flujos principales)
- ✅ Cache Miss Sequence (ASCII de browser → API → Redis → PostgreSQL)

**Ventaja:** No requiere herramientas, información completa y trazable

---

### ✅ Opción 5: Ejecutar Archify desde Docker

```bash
docker run -it --rm -v /ruta/proyecto:/workspace tt-a1i/archify finalize architecture ...
```

**Ventaja:** Aísla el problema de Windows

---

### ✅ Opción 6: Contribuciones y Fixes

Problemas reportados:

1. **finalize CLI bug:** `finalize-receipt-changed-during-inspection` (Windows paths)
   - Afecta a todos los tipos (architecture, dataflow, workflow, sequence)
   - Persiste incluso con rutas cortas
   
2. **npx CLI issue:** `could not determine executable to run`
   - Afecta a `npx archify serve`
   - Posible problema de configuración de paquete npm

Reportar en: https://github.com/tt-a1i/archify/issues

Mientras tanto: **Usar Opción 1 (Visualizador HTML) — funciona ahora**

---

## Archivos Disponibles Ahora

### ✅ Visualizador Interactivo (FUNCIONA AHORA)
```
archify-diagrams/viewer.html
```

**4 tabs con diagramas ASCII + especificaciones + links**
- Abre en navegador
- Interfaz tabulada
- Mobile responsive
- Actualizado con cache-miss-sequence

### JSON Candidates (Listos para Archify CLI)
```
.archify/
├── 01-architecture-general.json
├── 02-data-model-flow.json
├── 03-workflow-procesos.json
└── 04-cache-miss-sequence.json
```

**Especificaciones completas, validadas, listas para pasar a `finalize` cuando se arregle**

### Especificaciones Visuales (Markdown)
```
archify-diagrams/INDEX.md
```

**Documentación completa de qué muestra cada diagrama (4 diagramas incluidos)**

### Scripts de Automatización
```
.claude/scripts/generate-archify-diagrams.ps1
generate-diagrams.ps1
```

**Para cuando Archify CLI se estabilice (finalize y npx funcionando)**

---

## Formato de Archivos Generados (Cuando funcione)

**Tres diagramas HTML interactivos:**
- `archify-diagrams/01-architecture-general.html`
- `archify-diagrams/02-data-model-flow.html`
- `archify-diagrams/03-workflow-procesos.html`

**Características de los HTMLs:**
- ✅ Tema oscuro/claro automático
- ✅ Zoom (mouse scroll)
- ✅ Pan (drag)
- ✅ Búsqueda de componentes
- ✅ Exportación a PNG, SVG, WebP

---

## Recomendación Inmediata

**✅ MEJOR OPCIÓN: Usar visualizador HTML (Opción 1)**

Abre: `archify-diagrams/viewer.html` en tu navegador

- **¿Qué ves?**
  - 4 diagramas interactivos en tabs
  - ASCII completamente formateado
  - Especificaciones detalladas
  - Enlaces a JSONs y documentación

- **¿Qué es lo siguiente?**
  - Los JSONs están listos para `finalize` cuando se arregle Archify
  - O usa Docker para aislarse de los problemas de Windows
  - O espera Archify v1.1+ con fix para Windows paths

**Si necesitas documentación escrita:** Lee `archify-diagrams/INDEX.md`

---

## Documentación Actualizada

✅ **CLAUDE.md** — Instrucciones de Archify con workarounds
✅ **AGENTS.md** — Flujo de trabajo automatizado documentado
✅ **archify-diagrams/INDEX.md** — Especificaciones visuales completas (sin necesidad de HTMLs)

---

**Fecha:** 2026-09-29  
**Archify Version:** 1.0  
**Estado:** Esperando diagnóstico/fix de Archify
