import { Router } from 'express';

export interface DependencyStatus {
  ok: boolean;
  /** Último error conocido, para diagnosticar sin entrar al contenedor. */
  error?: string;
}
export type ReadinessCheck = () => Promise<Record<string, DependencyStatus>>;

/**
 * Probes del orquestador.
 * - /health/live: el proceso responde (no depende de nada externo).
 * - /health/ready: todas las dependencias listas; si no, 503 con el detalle de cada una.
 */
export function healthRouter(readiness: ReadinessCheck): Router {
  const r = Router();
  r.get('/live', (_req, res) => res.json({ status: 'alive' }));
  r.get('/ready', async (_req, res) => {
    const checks = await readiness().catch((err: unknown) => ({
      readiness: { ok: false, error: String(err) },
    }));
    const ok = Object.values(checks).every((c) => c.ok);
    res.status(ok ? 200 : 503).json({ status: ok ? 'ready' : 'not_ready', checks });
  });
  return r;
}
