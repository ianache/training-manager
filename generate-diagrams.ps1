# Script para generar diagramas Archify
# Uso: .\generate-diagrams.ps1

$archifyPath = "C:\Users\ianache\.claude\skills\archify\bin\archify.mjs"
$workDir = "C:\Users\ianache\Desktop\DATA\01-DOCUMENTOS\00-GESTION\01-Capacitacion\ai-competencies-2026\ux-ui\UX_UI_agentic"

Write-Host "Generando diagramas Archify..." -ForegroundColor Cyan
Write-Host "Directorio: $workDir" -ForegroundColor Gray
Write-Host ""

cd $workDir

if (-not (Test-Path "archify-diagrams")) {
  New-Item -ItemType Directory -Path "archify-diagrams" | Out-Null
  Write-Host "OK: Directorio archify-diagrams/ creado" -ForegroundColor Green
}

Write-Host ""
Write-Host "1. Generando Arquitectura General..." -ForegroundColor Yellow
$result1 = node $archifyPath finalize architecture ".archify/01-architecture-general.json" "archify-diagrams/01-architecture-general.html" --quality showcase 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host "OK: archify-diagrams/01-architecture-general.html" -ForegroundColor Green
} else {
  Write-Host "ERROR: $result1" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Generando Modelo de Datos..." -ForegroundColor Yellow
$result2 = node $archifyPath finalize dataflow ".archify/02-data-model-flow.json" "archify-diagrams/02-data-model-flow.html" --quality showcase 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host "OK: archify-diagrams/02-data-model-flow.html" -ForegroundColor Green
} else {
  Write-Host "ERROR: $result2" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Generando Workflows de Procesos..." -ForegroundColor Yellow
$result3 = node $archifyPath finalize workflow ".archify/03-workflow-procesos.json" "archify-diagrams/03-workflow-procesos.html" --quality showcase 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host "OK: archify-diagrams/03-workflow-procesos.html" -ForegroundColor Green
} else {
  Write-Host "ERROR: $result3" -ForegroundColor Red
}

Write-Host ""
Write-Host "Diagramas generados:" -ForegroundColor Cyan
ls archify-diagrams/*.html -ErrorAction SilentlyContinue | ForEach-Object {
  Write-Host "  - $($_.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Abre los archivos HTML en tu navegador para visualizar los diagramas interactivos." -ForegroundColor Green
