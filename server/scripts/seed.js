import 'dotenv/config';
import mongoose from 'mongoose';

import User from '../models/User.js';
import Project, { slugify } from '../models/Project.js';

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before seeding.');
  process.exit(1);
}

await connect();

await ensureAdmin();
await ensureProject();

console.log('\nDone.');
await mongoose.disconnect();

async function connect() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}

async function ensureAdmin() {
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  // Let the schema's pre-save hook do the bcrypt hashing.
  await User.create({ email, password: ADMIN_PASSWORD, role: 'admin' });
  console.log(`Created admin: ${email}`);
}

async function ensureProject() {
  const title = 'SehatSaarthi';
  const slug = slugify(title);

  await Project.updateOne(
    { slug },
    {
      $setOnInsert: {
        title,
        slug,
        year: 2026,
        featured: true,
        description:
          'A full-stack healthcare application providing accessible digital healthcare assistance through a modern web platform.',
        technologies: [
          'React.js',
          'Vite',
          'Tailwind CSS',
          'Node.js',
          'Express.js',
          'REST APIs',
          'Gemini API',
        ],
      },
    },
    { upsert: true }
  );
  console.log(`Project seeded: ${title}`);
}
