#!/usr/bin/env node
/**
 * Conformidad del portal con las ADR aceptadas (fitness functions). Uso: npm run lint:arch
 *
 * ADR-001  El portal solo habla con el BFF (rutas relativas /api, /auth); un microUI no importa
 *          a otro ni al shell; @gf/ui no hace HTTP.
 * ADR-002  Nada de OIDC en el navegador: sin URLs de Keycloak, sin librerías OIDC cliente.
 * ADR-005  Ningún token en el navegador: sin localStorage/sessionStorage ni header Authorization.
 * ADR-003  El portal no conoce bases de datos ni SQL.
 * ADR-004  Ningún secreto en el código del portal.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const projects = join(root, 'projects');

const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|html|mjs|json)$/.test(f) ? [p] : [];
  });

const files = walk(projects)
  .filter((p) => !p.endsWith('.spec.ts'))
  .map((p) => ({ rel: relative(root, p).split(sep).join('/'), code: readFileSync(p, 'utf8') }));

const rules = [
  { adr: 'ADR-001', msg: 'URL absoluta a un servicio (usar /api/v1 relativo al BFF)',
    test: (f) => !f.rel.endsWith('federation.manifest.json') && !f.rel.endsWith('proxy.conf.json') && !f.rel.endsWith('federation.config.mjs') && /https?:\/\/(localhost|127\.0\.0\.1|[\w.-]+\.comsatel)[^'"\s]*/i.test(f.code) },
  { adr: 'ADR-001', msg: 'un microUI importa a otro microUI o al shell',
    test: (f) => { const m = f.rel.match(/projects\/(mfe-[\w-]+)\//); return !!m && new RegExp(`from ['"][^'"]*(projects/(?!${m[1]})mfe-|projects/shell|\\.\\./\\.\\./\\.\\./(mfe-|shell))`).test(f.code); } },
  { adr: 'ADR-001', msg: '@gf/ui no debe usar HttpClient',
    test: (f) => f.rel.startsWith('projects/ui/') && /from ['"]@angular\/common\/http['"]/.test(f.code) },
  { adr: 'ADR-002', msg: 'endpoint o librería OIDC en el navegador',
    test: (f) => /\/realms\/|openid-connect|angular-oauth2-oidc|keycloak-js|angular-auth-oidc-client/.test(f.code) },
  { adr: 'ADR-005', msg: 'almacenamiento de tokens en el navegador',
    test: (f) => /\b(localStorage|sessionStorage)\b/.test(f.code) },
  { adr: 'ADR-005', msg: 'el navegador arma un header Authorization',
    test: (f) => /['"]Authorization['"]|Bearer\s/.test(f.code) },
  { adr: 'ADR-003', msg: 'SQL o referencias a bases de datos en el portal',
    test: (f) => /\b(SELECT\s+.+\s+FROM|INSERT\s+INTO|mysql|postgres)\b/i.test(f.code) },
  { adr: 'ADR-004', msg: 'posible secreto en el código',
    test: (f) => /(client_secret|password|api[_-]?key)\s*[:=]\s*['"][^'"]{4,}['"]/i.test(f.code) },
];

const violations = files.flatMap((f) => rules.filter((r) => r.test(f)).map((r) => `${r.adr}  ${f.rel}: ${r.msg}`));

if (violations.length) {
  console.error(`✘ ${violations.length} violación(es) de arquitectura:\n  ${violations.join('\n  ')}`);
  process.exit(1);
}
console.log(`✔ Conformidad ADR-001/002/003/004/005: ${files.length} archivos revisados, sin violaciones.`);
