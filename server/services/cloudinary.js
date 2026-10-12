import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  // Configure lazily so a missing Cloudinary key doesn't crash the whole API —
  // only the upload endpoint needs it.
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const err = new Error('Cloudinary is not configured. Set the CLOUDINARY_* variables.');
    err.status = 503;
    throw err;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

/** Upload an in-memory buffer and return the secure delivery URL. */
export async function uploadBuffer(buffer) {
  ensureConfigured();
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'image',
          // Let Cloudinary pick the best quality/format for the requester.
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (err, res) => (err ? reject(err) : resolve(res))
      )
      .end(buffer);
  });
  return result.secure_url;
}
