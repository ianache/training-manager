import type { Request } from 'express';

/** Copia solo los query params permitidos (evita reenviar parámetros arbitrarios). */
export function pickQuery(req: Request, allowed: readonly string[]): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const key of allowed) {
    const v = req.query[key];
    if (typeof v === 'string') out[key] = v;
  }
  return out;
}

export const userName = (req: Request): string => req.session.user?.username ?? 'anonymous';
export const userRoles = (req: Request): readonly string[] => req.session.user?.roles ?? [];
export const requestIdOf = (req: Request): string => String(req.id);
