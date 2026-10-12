import { validationResult } from 'express-validator';

/**
 * Terminal middleware for an express-validator chain.
 *
 * Usage: router.post('/contact', limiter, contactRules, validate, handler)
 *
 * Centralising this removes the `validationResult(req)` boilerplate from every
 * controller and guarantees a consistent 400 shape.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // Controllers only need the first problem; it keeps the UI message readable.
  return res.status(400).json({ message: errors.array()[0].msg });
}
