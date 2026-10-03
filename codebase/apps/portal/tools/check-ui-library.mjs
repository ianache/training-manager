#!/usr/bin/env node
/**
 * Contrato de la librería @gf/ui (decisiones de ianache, DTC-015). Uso: npm run lint:ui
 *
 *  1. Todo componente de atoms/ y molecules/ se exporta desde public-api.ts.
 *  2. Todo paquete @angular/* que importa el código de la librería está declarado en peerDependencies.
 *  3. Sin @angular/material ni @angular/cdk (se usan los componentes gf-*).
 *  4. --gf-color-primary = #BC0100 (TKN-color-primary, TKN-SET-002).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ui = join(root, 'projects', 'ui');
const posix = (p) => p.split(sep).join('/');

const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const lib = walk(join(ui, 'src', 'lib')).map(posix);
const sources = lib.filter((p) => p.endsWith('.ts') && !p.endsWith('.spec.ts') && !p.endsWith('.barrel.ts'));
const publicApi = readFileSync(join(ui, 'src', 'public-api.ts'), 'utf8');
const pkg = JSON.parse(readFileSync(join(ui, 'package.json'), 'utf8'));
const problems = [];

// 1. exports
for (const f of sources.filter((p) => /\/lib\/(atoms|molecules)\//.test(p))) {
  const rel = './' + posix(relative(join(ui, 'src'), f)).replace(/\.ts$/, '');
  if (!publicApi.includes(`'${rel}'`)) problems.push(`no exportado en public-api.ts: ${rel}`);
}

// 2. peer dependencies and 3. Material/CDK
const imported = new Set();
for (const f of sources) {
  for (const m of readFileSync(f, 'utf8').matchAll(/from\s+['"](@angular\/[\w-]+)(?:\/[\w/-]*)?['"]/g)) imported.add(m[1]);
}
const peers = pkg.peerDependencies ?? {};
for (const dep of imported) {
  if (/^@angular\/(material|cdk)$/.test(dep)) problems.push(`la librería importa ${dep}: usar componentes gf-*`);
  else if (!peers[dep]) problems.push(`peerDependency sin declarar: ${dep}`);
}

// 4. primary token
const tokens = readFileSync(join(ui, 'src', 'styles', 'tokens.css'), 'utf8');
const primary = tokens.match(/--gf-color-primary:\s*(#[0-9a-fA-F]{3,8})\s*;/)?.[1];
if (primary?.toLowerCase() !== '#bc0100') problems.push(`--gf-color-primary es ${primary}; debe ser #BC0100`);

if (problems.length) {
  console.error(`✘ ${problems.length} problema(s) en @gf/ui:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`✔ @gf/ui: ${sources.length} fuentes, exports, peers, sin Material/CDK y token primario OK.`);
