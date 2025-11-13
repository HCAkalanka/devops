import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '');
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if ((file.mimetype || '').startsWith('image/')) cb(null, true);
  else cb(new Error('Only image uploads are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 10 } });

// POST /api/uploads  multipart/form-data with field name 'files'
router.post('/', protect, upload.array('files', 10), (req, res) => {
  try {
    const files = req.files || [];
    const base = `${req.protocol}://${req.get('host')}`;
    const urls = files.map((f) => ({ url: `${base}/uploads/${f.filename}` }));
    res.json({ files: urls });
  } catch (e) {
    console.error('upload error', e);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;
