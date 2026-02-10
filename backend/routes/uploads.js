import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudKey = process.env.CLOUDINARY_API_KEY;
const cloudSecret = process.env.CLOUDINARY_API_SECRET;
const cloudFolder = process.env.CLOUDINARY_FOLDER || 'car-rental';

const cloudinaryReady = !!(cloudName && cloudKey && cloudSecret);
if (cloudinaryReady) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudKey,
    api_secret: cloudSecret,
  });
} else {
  console.warn('Cloudinary credentials not fully set; image uploads will fail until configured');
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if ((file.mimetype || '').startsWith('image/')) cb(null, true);
  else cb(new Error('Only image uploads are allowed'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 10 } });

const uploadToCloudinary = (fileBuffer) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: cloudFolder, resource_type: 'image' },
    (err, result) => {
      if (err) return reject(err);
      resolve({ url: result.secure_url, public_id: result.public_id });
    },
  );
  stream.end(fileBuffer);
});

// POST /api/uploads  multipart/form-data with field name 'files'
router.post('/', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!cloudinaryReady) return res.status(500).json({ message: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.' });
    const files = req.files || [];
    if (files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

    const uploaded = await Promise.all(files.map((f) => uploadToCloudinary(f.buffer)));
    res.json({ files: uploaded });
  } catch (e) {
    console.error('upload error', e);
    const status = e?.http_code || 500;
    res.status(status).json({ message: 'Upload failed', detail: e?.message });
  }
});

export default router;
