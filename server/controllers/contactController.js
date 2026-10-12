import Contact from '../models/Contact.js';

/** POST /api/contact */
export async function createContact(req, res) {
  const { name, email, message } = req.body;
  await Contact.create({ name, email, message });
  // Deliberately vague: don't confirm whether anything was stored.
  return res.status(201).json({ message: 'Message received. Thank you!' });
}

/** GET /api/contact (protected) */
export async function listContacts(req, res) {
  const contacts = await Contact.find().sort('-createdAt').limit(200).lean();
  return res.json(contacts);
}
