import type { Response } from 'express';
import type { DownstreamResponse } from './service-client.js';

/** Responde al navegador con el estado, el cuerpo y las cabeceras permitidas del microservicio. */
export function relay(res: Response, out: DownstreamResponse): void {
  res.set(out.headers).status(out.status).json(out.body);
}
