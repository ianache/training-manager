import { pino, type Logger } from 'pino';

/** Logs JSON estructurados (API-SPEC-001 §4.4). Nunca se registran tokens ni cookies. */
export function createLogger(level: string): Logger {
  return pino({
    level,
    base: { service: 'bff-node' },
    redact: {
      paths: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'],
      remove: true,
    },
  });
}
