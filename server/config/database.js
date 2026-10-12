import mongoose from 'mongoose';
import { env } from './env.js';

let connecting = null;

/**
 * Connect to MongoDB, reusing a single in-flight connection promise.
 *
 * Designed for serverless: `api/[...path].js` calls this on every invocation.
 * The first call opens a connection; every later call awaits the same promise
 * (or returns immediately if mongoose is already connected), so a warm lambda
 * never pays the handshake cost twice.
 */
export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connecting) return connecting;

  connecting = mongoose
    .connect(env.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      // Fail fast rather than queueing queries against a dead cluster.
      bufferCommands: false,
    })
    .then((m) => m)
    .catch((err) => {
      // Clear the promise so the next request retries instead of reusing a
      // permanently rejected promise.
      connecting = null;
      throw err;
    })
    .finally(() => {
      connecting = null;
    });

  return connecting;
}
