# Generador automático de diagramas Archify
# Script: .claude/scripts/generate-archify-diagrams.ps1
# Uso: .\generate-archify-diagrams.ps1

param(
  [string]$ProjectRoot = (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)),
  [bool]$UseTempDir = $true
)

$archifyPath = "C:\Users\ianache\.claude\skills\archify\bin\archify.mjs"
$tempDir = "C:\temp\archify"
$jsonDir = "$ProjectRoot\.archify"
$outputDir = "$ProjectRoot\archify-diagrams"

Write-Host "Generador Archify - Diagramas Interactivos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Validar archivos JSON
Write-Host "Validando JSONs candidates..." -ForegroundColor Yellow
$jsonFiles = @(
  "$jsonDir\01-architecture-general.json",
  "$jsonDir\02-data-model-flow.json",
  "$jsonDir\03-workflow-procesos.json"
)

$missing = @()
foreach ($file in $jsonFiles) {
  if (Test-Path $file) {
    Write-Host "  OK: $(Split-Path -Leaf $file)" -ForegroundColor Green
  } else {
    Write-Host "  FALTA: $(Split-Path -Leaf $file)" -ForegroundColor Red
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  Write-Host ""
  Write-Host "ERROR: Faltan JSONs candidates. Ejecuta primero la generacion de diagramas." -ForegroundColor Red
  exit 1
}

# Crear directorio temporal
if ($UseTempDir) {
  Write-Host ""
  Write-Host "Preparando directorio temporal..." -ForegroundColor Yellow
  if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
  }

  Copy-Item "$jsonDir\*.json" $tempDir -Force
  Write-Host "  JSONs copiados a $tempDir" -ForegroundColor Green

  $workDir = $tempDir
} else {
  $workDir = $jsonDir
}

# Crear directorio de salida
if (-not (Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Generar diagramas
Write-Host ""
Write-Host "Generando diagramas..." -ForegroundColor Yellow
Write-Host ""

$diagrams = @(
  @{
    type = "architecture"
    input = "01-architecture-general.json"
    output = "01-architecture-general.html"
    label = "Arquitectura General"
  },
  @{
    type = "dataflow"
    input = "02-data-model-flow.json"
    output = "02-data-model-flow.html"
    label = "Modelo de Datos"
  },
  @{
    type = "workflow"
    input = "03-workflow-procesos.json"
    output = "03-workflow-procesos.html"
    label = "Flujos de Procesos"
  }
)

$successCount = 0
$failCount = 0

foreach ($diagram in $diagrams) {
  Write-Host "  [*] Generando: $($diagram.label)..." -ForegroundColor Cyan

  $inputFile = "$workDir\$($diagram.input)"
  $outputFile = "$outputDir\$($diagram.output)"

  $result = & node $archifyPath finalize $diagram.type $inputFile $outputFile --quality showcase 2>&1

  if ($LASTEXITCODE -eq 0) {
    Write-Host "      OK: $($diagram.output)" -ForegroundColor Green
    $successCount++
  } else {
    Write-Host "      ERROR: $($result -join ' ')" -ForegroundColor Red
    $failCount++
  }
}

# Resumen final
Write-Host ""
Write-Host "Resumen" -ForegroundColor Cyan
Write-Host "=======" -ForegroundColor Cyan
Write-Host "  Generados: $successCount" -ForegroundColor Green
Write-Host "  Errores: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })

if ($failCount -eq 0 -and $successCount -gt 0) {
  Write-Host ""
  Write-Host "Diagramas HTML generados:" -ForegroundColor Green
  ls "$outputDir\*.html" | ForEach-Object {
    Write-Host "  [OK] $($_.Name)" -ForegroundColor Green
  }

  Write-Host ""
  Write-Host "Visualizacion:" -ForegroundColor Green
  Write-Host "  Abre en navegador: $outputDir" -ForegroundColor Gray
  Write-Host ""
  Write-Host "O copia esta ruta en tu navegador:" -ForegroundColor Gray
  Write-Host "  file:///$($outputDir -replace '\\', '/')/01-architecture-general.html" -ForegroundColor Gray

  exit 0
} else {
  Write-Host ""
  Write-Host "Algunos diagramas fallaron. Verifica los errores arriba." -ForegroundColor Red
  Write-Host ""
  Write-Host "Opciones de recuperacion:" -ForegroundColor Yellow
  Write-Host "  1. Ejecutar finalize manualmente desde $tempDir" -ForegroundColor Gray
  Write-Host "  2. Verificar JSONs candidates en $jsonDir" -ForegroundColor Gray
  Write-Host "  3. Consultar archify-diagrams/INDEX.md para especificaciones" -ForegroundColor Gray

  exit 1
}
