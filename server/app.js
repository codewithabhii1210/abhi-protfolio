import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

/* ------------------------------------------------------------------ */
/* Proxy awareness                                                     */
/* ------------------------------------------------------------------ */

/**
 * In production the app sits behind Vercel's proxy, which sets
 * `X-Forwarded-For`. Express ignores that header unless trust proxy is on,
 * so `req.ip` would be the proxy's address and every visitor would share a
 * single rate-limit bucket. Trust exactly one hop.
 *
 * Left off in development so a local client can't spoof its IP.
 */
if (env.isProduction) app.set('trust proxy', 1);

/* ------------------------------------------------------------------ */
/* Security headers                                                    */
/* ------------------------------------------------------------------ */

app.use(
  helmet({
    // The site serves its own images and fonts; keep the default policy but
    // allow the API to be called from the same origin.
    crossOriginResourcePolicy: { policy: 'same-origin' },
  })
);

/* ------------------------------------------------------------------ */
/* CORS                                                                */
/* ------------------------------------------------------------------ */

const allowedOrigins = env.allowedOrigins;

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = same-origin navigation or a server-to-server call.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: ${origin} is not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

/* ------------------------------------------------------------------ */
/* Body parsing                                                        */
/* ------------------------------------------------------------------ */

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', uptime: Math.round(process.uptime()) })
);

app.use('/api', routes);

/* ------------------------------------------------------------------ */
/* Fallbacks                                                           */
/* ------------------------------------------------------------------ */

app.use(notFound);
app.use(errorHandler);

export default app;
