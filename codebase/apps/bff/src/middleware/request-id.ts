import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const VALID = /^[\w.-]{1,128}$/;

/** Toma X-Request-ID del portal (o genera uno) y lo devuelve en la respuesta. */
export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.header('x-request-id');
  req.id = incoming && VALID.test(incoming) ? incoming : randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};
