import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    description: { type: String, trim: true, maxlength: 2000 },
    technologies: { type: [String], default: [], maxlength: 30 },
    image: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    year: { type: Number, default: () => new Date().getFullYear(), min: 2000, max: 2100 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

projectSchema.index({ year: -1, createdAt: -1 });
projectSchema.index({ featured: 1 });

/** URL-safe slug from a title. Falls back to a timestamp for empty input. */
export function slugify(input = '') {
  return (
    String(input)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `project-${Date.now()}`
  );
}

/**
 * Allow only known fields through from a request body.
 * Prevents a crafted payload from writing `slug`, `_id`, or timestamps.
 */
export function pickProjectFields(body = {}) {
  const { title, description, technologies, image, githubUrl, liveUrl, featured, year } = body;
  const out = {};
  if (title !== undefined) out.title = title;
  if (description !== undefined) out.description = description;
  if (technologies !== undefined) out.technologies = technologies;
  if (image !== undefined) out.image = image;
  if (githubUrl !== undefined) out.githubUrl = githubUrl;
  if (liveUrl !== undefined) out.liveUrl = liveUrl;
  if (featured !== undefined) out.featured = featured;
  if (year !== undefined) out.year = year;
  return out;
}

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
