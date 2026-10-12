import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * JWT auth guard.
 *
 * Expects `Authorization: Bearer <token>`. On success attaches the decoded
 * payload to `req.user`; otherwise responds 401 immediately.
 */
export function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/** Sign a token for a user document. */
export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: '1d' });
}
