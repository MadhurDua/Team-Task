import { AppError } from '../utils/AppError.js';

export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError('Validation failed', 422, parsed.error.flatten()));
  }
  req.body = parsed.data;
  return next();
};
