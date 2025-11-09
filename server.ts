// Express API server for Material Tracker
// Run this on your Unraid server or locally to handle database operations

import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('🔧 Environment loaded:');
console.log('  DATABASE_TYPE:', process.env.DATABASE_TYPE);
console.log('  POSTGRES_HOST:', process.env.POSTGRES_HOST);
console.log('  PORT:', process.env.PORT || 3001);

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  initServerDatabase,
  saveMaterialServer,
  getAllMaterialsServer,
  getMaterialByIdServer,
  deleteMaterialServer,
} from './src/storage/server-db';

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',').map((o: string) => o.trim()).filter(Boolean);

// Security: Helmet for HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow image loading from different origins
}));

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const corsOptions: cors.CorsOptions = ALLOWED_ORIGINS && ALLOWED_ORIGINS.length > 0
  ? {
      origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }
  : {}; // Allow all origins if ALLOWED_ORIGINS is empty (development mode)

app.use(cors(corsOptions));
app.use(express.json());

// API Key authentication middleware
function requireApiKey(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Skip auth check if no API_KEY is set (for initial setup/development)
  if (!API_KEY) {
    console.warn('⚠️  WARNING: API_KEY not set. Authentication is disabled!');
    return next();
  }

  const providedKey = req.headers['x-api-key'];
  if (providedKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
}

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

// Health check (public - no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Get all materials (requires auth)
app.get('/api/materials', requireApiKey, async (req, res) => {
  try {
    const materials = await getAllMaterialsServer();
    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Get single material (requires auth)
app.get('/api/materials/:id', requireApiKey, async (req, res) => {
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

// Create/update material (requires auth)
app.post('/api/materials', requireApiKey, async (req, res) => {
  try {
    const material = req.body;
    await saveMaterialServer(material);
    res.json({ success: true, id: material.id });
  } catch (error) {
    console.error('Error saving material:', error);
    res.status(500).json({ error: 'Failed to save material' });
  }
});

// Delete material (requires auth)
app.delete('/api/materials/:id', requireApiKey, async (req, res) => {
  try {
    await deleteMaterialServer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

// Upload image (requires auth)
app.post('/api/upload', requireApiKey, upload.single('image'), (req, res) => {
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
