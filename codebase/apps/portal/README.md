# Portal — shell y microUIs (Angular 22 + Native Federation)

Frontend de la Plataforma de Gestión de Formación. La arquitectura completa está en
[`../ARCHITECTURE.md`](../ARCHITECTURE.md).

| Proyecto | Tipo | Puerto dev | Ruta en el shell |
|---|---|---|---|
| `shell` | host | 4200 | — |
| `mfe-catalog` | remote (`./routes`) | 4201 | `/catalogo` |
| `mfe-collaborators` | remote (`./routes`) | 4202 | `/colaboradores` |
| `core` → `@gf/core` | librería | — | sesión, HTTP, guards, estados |
| `ui` → `@gf/ui` | librería | — | design system (tokens, atoms, molecules) |

## Comandos

```bash
npm install
npm run build:libs     # compila @gf/core y @gf/ui (necesario para empaquetarlas como NPM)
npm run start:all      # shell + remotes; abre http://localhost:4200 (requiere el BFF en :3000)
npm run build          # build de producción de todo
npm test               # pruebas unitarias (vitest): core y shell
npm run lint:arch      # conformidad con ADR-001…005 (ver tools/check-architecture.mjs)
```

## Docker

`Dockerfile` compila todo y lo sirve con nginx en un solo origen: shell en `/`, remotes en
`/mfe/catalog/` y `/mfe/collaborators/`, y `/api` y `/auth` reenviados al BFF (`BFF_UPSTREAM`).
El manifiesto de federación se genera al arrancar con `PORTAL_PUBLIC_ORIGIN`. Se levanta junto con
todo lo demás desde `codebase/docker-compose.yml` (ver `DOCKER_SETUP.md`).

## Agregar un microUI nuevo

1. `npx ng g application mfe-<capacidad> --routing --style=scss --ssr=false --prefix=gf`
2. `npx ng g @angular-architects/native-federation:init --project mfe-<capacidad> --port <puerto> --type remote`
3. En `federation.config.mjs` exponer `'./routes': './projects/mfe-<capacidad>/src/app/routes.ts'`.
4. Registrar la clave en `projects/shell/public/federation.manifest.json`, en `shell/src/app/federation/remotes.ts` y en `docker/40-federation-manifest.sh`; agregar su `COPY` a `/mfe/<capacidad>/` en el `Dockerfile`.
5. Montar la ruta en `shell/src/app/app.routes.ts` con su `roleGuard` y agregar el ítem en `layout/navigation.ts`.

## Convenciones

- Las vistas usan `toViewState()` + `<gf-view-state>`: nunca estados propios (UXR-000.4).
- Solo tokens `--gf-*`; ningún color o tamaño crudo en componentes.
- Textos con la terminología del glosario (GLS-001). Idioma: español.
- `@gf/ui` no conoce HttpClient ni rutas; los microUIs no se importan entre sí.
