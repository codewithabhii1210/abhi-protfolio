/**
 * Shared error handling.
 *
 * Everything below follows one rule: a controller may `throw`, return a
 * rejected promise, or call `next(err)`. This module turns all three into a
 * consistent JSON error response.
 */

/** Wraps an async route handler so rejections reach the error middleware. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** 404 for anything that fell through the router. */
export const notFound = (req, res) =>
  res.status(404).json({ message: 'Resource not found' });

/**
 * Final error middleware. Express identifies this by its 4-arg signature.
 *
 * Never leaks internals in production: 5xx errors are replaced with a generic
 * message unless NODE_ENV is development.
 */
export const errorHandler = (err, req, res, next) => {
  // Mongoose duplicate key (e.g. two projects with the same slug).
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `A record with that ${field} already exists.` });
  }

  // Mongoose validation error — surface the first message, not the raw dump.
  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors || {})[0];
    return res.status(400).json({ message: first?.message || 'Invalid data.' });
  }

  // Malformed ObjectId in a URL param.
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Invalid id.' });
  }

  const status = err.status || err.statusCode || 500;
  const isServerError = status >= 500;
  const isDev = process.env.NODE_ENV !== 'production';
  const message = isServerError && !isDev ? 'Internal server error' : err.message;

  if (isServerError) console.error('[error]', err);

  res.status(status).json({ message });
};
