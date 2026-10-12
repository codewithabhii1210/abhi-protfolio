import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import rateLimit from 'express-rate-limit';

import { asyncHandler } from '../middleware/error.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

import { login } from '../controllers/authController.js';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { createContact, listContacts } from '../controllers/contactController.js';
import { uploadBuffer } from '../services/cloudinary.js';

const router = Router();

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */

/**
 * 20 requests per 15 minutes per client IP, applied to the two public
 * write endpoints (login + contact).
 *
 * `trust proxy` is set in app.js so `req.ip` resolves to the real visitor
 * behind Vercel's proxy — without it every visitor would share one bucket.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
});

/* ------------------------------------------------------------------ */
/* Uploads                                                             */
/* ------------------------------------------------------------------ */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(Object.assign(new Error('Only images are allowed'), { status: 400 }), false),
});

/* ------------------------------------------------------------------ */
/* Validation chains                                                   */
/* ------------------------------------------------------------------ */

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be 5-2000 characters'),
];

const projectRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('technologies').optional().isArray({ max: 30 }).withMessage('Technologies must be an array'),
  body('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be 2000-2100'),
];

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

// Auth
router.post('/auth/login', limiter, loginRules, validate, asyncHandler(login));

// Projects — public reads, protected writes
router.get('/projects', asyncHandler(listProjects));
router.get('/projects/:id', asyncHandler(getProject));
router.post('/projects', protect, projectRules, validate, asyncHandler(createProject));
router.put('/projects/:id', protect, projectRules, validate, asyncHandler(updateProject));
router.delete('/projects/:id', protect, asyncHandler(deleteProject));

// Contact
router.post('/contact', limiter, contactRules, validate, asyncHandler(createContact));
router.get('/contact', protect, asyncHandler(listContacts));

// Image upload (protected)
router.post('/upload', protect, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }
  const url = await uploadBuffer(req.file.buffer);
  return res.json({ url });
}));

export default router;
