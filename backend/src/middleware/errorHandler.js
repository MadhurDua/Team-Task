import { fail } from '../utils/apiResponse.js';

export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Something went wrong' : err.message;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return fail(res, message, status, err.details);
}
