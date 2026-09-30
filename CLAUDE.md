## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- Before every commit (`git commit`, including commits made by agents or skills): run `graphify update .` so the graph reflects the staged changes, then stage the refreshed `graphify-out/` (`git add graphify-out/`) and include it in the same commit. If `graphify update .` fails, stop and report the error instead of committing a stale graph.

## archify

Generar diagramas interactivos (HTML) de arquitectura, flujos de datos, modelos conceptuales.

**Proceso Automático (cuando se pida crear/actualizar diagramas archify):**

1. Generar JSONs candidates completos (.archify/01-architecture-general.json, etc.)
2. Usar ruta corta Windows: copiar JSONs a `C:\temp\archify\` para evitar problemas de finalize
3. Ejecutar `finalize` desde directorio corto:
   ```
   node C:\Users\ianache\.claude\skills\archify\bin\archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase
   ```
4. Generar 3 diagramas en paralelo: architecture, dataflow, workflow
5. Copiar HTMLs resultantes a `archify-diagrams/`
6. Reportar rutas finales: `archify-diagrams/01-*.html`, `02-*.html`, `03-*.html`

**Script conveniente:** Ejecutar `.\generate-diagrams.ps1` desde raíz del proyecto (PowerShell)

**Si falla finalize:** Cambiar ruta a `C:\temp\archify\` y ejecutar manualmente
