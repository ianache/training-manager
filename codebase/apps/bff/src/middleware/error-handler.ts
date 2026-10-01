import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiError } from '../shared/api-error.js';

export const notFound: RequestHandler = (req, _res, next) =>
  next(new ApiError(404, 'RESOURCE_NOT_FOUND', `Ruta no encontrada: ${req.method} ${req.path}`));

/** Toda respuesta de error sale en el formato estándar; nunca se filtran stacks. */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const apiError =
    err instanceof ApiError
      ? err
      : new ApiError(500, 'INTERNAL_SERVER_ERROR', 'Ocurrió un error inesperado.');
  if (!(err instanceof ApiError)) req.log?.error({ err }, 'Error no controlado');
  else if (apiError.status >= 500) req.log?.warn({ code: apiError.code, details: apiError.details }, apiError.message);
  res.status(apiError.status).json(apiError.toBody(String(req.id)));
};
