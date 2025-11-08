// Express API server for Material Tracker
// Run this on your Unraid server or locally to handle database operations

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  initServerDatabase,
  saveMaterialServer,
  getAllMaterialsServer,
  getMaterialByIdServer,
  deleteMaterialServer,
} from './src/storage/server-db';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Image upload directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Serve uploaded images
app.use('/images', express.static(UPLOAD_DIR));

// Initialize database
initServerDatabase().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// ===== API Routes =====

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Get all materials
app.get('/api/materials', async (req, res) => {
  try {
    const materials = await getAllMaterialsServer();
    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Get single material
app.get('/api/materials/:id', async (req, res) => {
  try {
    const material = await getMaterialByIdServer(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({ error: 'Failed to fetch material' });
  }
});

// Create/update material
app.post('/api/materials', async (req, res) => {
  try {
    const material = req.body;
    await saveMaterialServer(material);
    res.json({ success: true, id: material.id });
  } catch (error) {
    console.error('Error saving material:', error);
    res.status(500).json({ error: 'Failed to save material' });
  }
});

// Delete material
app.delete('/api/materials/:id', async (req, res) => {
  try {
    await deleteMaterialServer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/images/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Material Tracker API server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
  console.log(`🗄️  Database type: ${process.env.DATABASE_TYPE || 'postgres'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  process.exit(0);
});
