import Project, { slugify, pickProjectFields } from '../models/Project.js';

/** GET /api/projects — newest first. */
export async function listProjects(req, res) {
  const projects = await Project.find().sort('-year -createdAt').limit(100).lean();
  return res.json(projects);
}

/** GET /api/projects/:id */
export async function getProject(req, res) {
  const project = await Project.findById(req.params.id).lean();
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json(project);
}

/** POST /api/projects (protected) */
export async function createProject(req, res) {
  const fields = pickProjectFields(req.body);
  const project = await Project.create({ ...fields, slug: slugify(fields.title) });
  return res.status(201).json(project);
}

/** PUT /api/projects/:id (protected) */
export async function updateProject(req, res) {
  const fields = pickProjectFields(req.body);

  // Only regenerate the slug when the title actually changed.
  if (fields.title) fields.slug = slugify(fields.title);

  const project = await Project.findByIdAndUpdate(req.params.id, fields, {
    new: true,
    runValidators: true,
  }).lean();

  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json(project);
}

/** DELETE /api/projects/:id (protected) */
export async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id).lean();
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json({ message: 'Deleted' });
}
