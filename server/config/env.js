/**
 * Environment validation.
 *
 * Reads and validates every required variable exactly once at startup so that
 * a misconfigured deployment fails loudly on boot instead of throwing cryptic
 * errors on the first request.
 */

const REQUIRED_IN_PROD = ['MONGO_URI', 'JWT_SECRET'];
const REQUIRED_ALWAYS = ['MONGO_URI', 'JWT_SECRET'];

const isProduction = process.env.NODE_ENV === 'production';

/** Collect every problem instead of stopping at the first one. */
function validate() {
  const problems = [];

  for (const key of REQUIRED_ALWAYS) {
    if (!process.env[key]) problems.push(`Missing required env var: ${key}`);
  }

  const secret = process.env.JWT_SECRET;
  if (secret && secret.length < 32) {
    problems.push('JWT_SECRET must be at least 32 characters long.');
  }
  if (secret && /^change-me/i.test(secret)) {
    problems.push('JWT_SECRET is still the placeholder value from .env.example.');
  }

  const mongo = process.env.MONGO_URI;
  if (mongo && !/^mongodb(\+srv)?:\/\//.test(mongo)) {
    problems.push('MONGO_URI does not look like a MongoDB connection string.');
  }

  if (isProduction && !process.env.CLIENT_ORIGIN) {
    // Not fatal — CORS falls back to same-origin — but worth surfacing.
    console.warn(
      '[env] CLIENT_ORIGIN is not set. The API will only accept requests from http://localhost:5173.\n' +
      '      Set CLIENT_ORIGIN to your deployed origin (comma-separated for multiple).'
    );
  }

  return problems;
}

const problems = validate();
if (problems.length) {
  console.error('\n[env] Refusing to start — environment is misconfigured:\n');
  for (const p of problems) console.error(`  • ${p}`);
  console.error('\nSee .env.example for the expected format.\n');
  process.exit(1);
}

export const env = {
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  /** Comma-separated list, trimmed and de-duplicated. */
  allowedOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
    .filter((o, i, arr) => arr.indexOf(o) === i),
};
