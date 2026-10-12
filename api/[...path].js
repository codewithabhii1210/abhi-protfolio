import app from '../server/app.js';
import { connectDatabase } from '../server/config/database.js';

/**
 * Vercel serverless entry point.
 *
 * Reuses the same Express app as local development. The database connection
 * is cached across warm invocations by connectDatabase(), so this only pays
 * the MongoDB handshake on a cold start.
 */

// A failed connect must not be cached as "connected" — reset the flag so the
// next invocation retries instead of failing forever on a stale promise.
let ready = false;

export default async function handler(req, res) {
  if (!ready) {
    try {
      await connectDatabase();
      ready = true;
    } catch (err) {
      console.error('[api] database connection failed:', err.message);
      return res.status(503).json({ message: 'Service temporarily unavailable' });
    }
  }
  return app(req, res);
}
