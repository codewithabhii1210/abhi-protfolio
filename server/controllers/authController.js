import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

/** POST /api/auth/login */
export async function login(req, res) {
  const { email, password } = req.body;

  // `.select('+password')` is required because the schema sets select: false.
  const user = await User.findOne({ email }).select('+password');
  const ok = user && (await user.matchesPassword(password));

  // Same message for both cases so the endpoint can't be used to enumerate
  // which emails have an account.
  if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

  return res.json({ token: signToken(user) });
}
