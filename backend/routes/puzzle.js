import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import multer from 'multer';
import { getPuzzleConfig, updatePuzzleConfig, getUserPuzzlePieces, collectPuzzlePiece } from '../models/PuzzleConfig.js';

dotenv.config();

const router = express.Router();

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb+srv://geethauser:Getha2024@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let isConnected = false;

// Helper function to ensure connection
async function ensureConnection() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('Puzzle route: Connected to MongoDB');
  }
  return client;
}

// Configure multer for image upload (memory storage for base64 conversion)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

/**
 * GET /api/puzzle/config
 * Get puzzle configuration
 */
router.get('/config', async (req, res) => {
  try {
    await ensureConnection();
    const db = client.db('geetaOlympiad');
    const config = await getPuzzleConfig(db);
    
    res.json({
      success: true,
      config: {
        totalPieces: config.totalPieces,
        imageUrl: config.imageUrl,
        imageData: config.imageData,
        creditsPerPiece: config.creditsPerPiece,
      },
    });
  } catch (error) {
    console.error('Error getting puzzle config:', error);
    res.status(500).json({ 
      error: 'Failed to get puzzle configuration',
      message: error.message 
    });
  }
});

/**
 * PUT /api/puzzle/config
 * Update puzzle configuration (admin only)
 */
router.put('/config', async (req, res) => {
  try {
    const { totalPieces, creditsPerPiece } = req.body;
    
    // Validate input
    if (totalPieces && (totalPieces < 10 || totalPieces > 50)) {
      return res.status(400).json({ 
        error: 'Invalid piece count. Must be between 10 and 50.' 
      });
    }
    
    await ensureConnection();
    const db = client.db('geetaOlympiad');
    
    const updates = {};
    if (totalPieces) updates.totalPieces = totalPieces;
    if (creditsPerPiece) updates.creditsPerPiece = creditsPerPiece;
    
    await updatePuzzleConfig(db, updates);
    
    res.json({
      success: true,
      message: 'Puzzle configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating puzzle config:', error);
    res.status(500).json({ 
      error: 'Failed to update puzzle configuration',
      message: error.message 
    });
  }
});

/**
 * POST /api/puzzle/upload-image
 * Upload puzzle image (admin only)
 */
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Convert image to base64
    const imageBase64 = req.file.buffer.toString('base64');
    const imageData = `data:${req.file.mimetype};base64,${imageBase64}`;
    
    await ensureConnection();
    const db = client.db('geetaOlympiad');
    
    await updatePuzzleConfig(db, {
      imageData: imageData,
      imageUrl: null, // Clear URL if using base64
    });
    
    console.log('✅ Puzzle image uploaded successfully');
    
    res.json({
      success: true,
      message: 'Puzzle image uploaded successfully',
      imageData: imageData,
    });
  } catch (error) {
    console.error('Error uploading puzzle image:', error);
    res.status(500).json({ 
      error: 'Failed to upload puzzle image',
      message: error.message 
    });
  }
});

/**
 * GET /api/puzzle/pieces/:userId/:profileId
 * Get user's collected puzzle pieces
 */
router.get('/pieces/:userId/:profileId', async (req, res) => {
  try {
    const { userId, profileId } = req.params;
    
    await ensureConnection();
    const db = client.db('geetaOlympiad');
    
    const pieces = await getUserPuzzlePieces(db, userId, profileId);
    
    res.json({
      success: true,
      pieces: pieces,
      count: pieces.length,
    });
  } catch (error) {
    console.error('Error getting puzzle pieces:', error);
    res.status(500).json({ 
      error: 'Failed to get puzzle pieces',
      message: error.message 
    });
  }
});

/**
 * POST /api/puzzle/collect
 * Collect a puzzle piece for today
 */
router.post('/collect', async (req, res) => {
  try {
    const { userId, profileId, pieceNumber } = req.body;
    
    if (!userId || !profileId || !pieceNumber) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, profileId, pieceNumber' 
      });
    }
    
    await ensureConnection();
    const db = client.db('geetaOlympiad');
    
    const result = await collectPuzzlePiece(db, userId, profileId, pieceNumber);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    console.log(`✅ User ${userId} collected piece ${pieceNumber}`);
    
    res.json(result);
  } catch (error) {
    console.error('Error collecting puzzle piece:', error);
    res.status(500).json({ 
      error: 'Failed to collect puzzle piece',
      message: error.message 
    });
  }
});

export default router;
