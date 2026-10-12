import 'dotenv/config';
import { env } from './config/env.js';
import app from './app.js';
import { connectDatabase } from './config/database.js';

try {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
} catch (err) {
  console.error('Failed to start server:', err.message);
  process.exit(1);
}
