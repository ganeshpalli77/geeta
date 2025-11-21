import express from 'express';
import { getDatabase } from '../config/database.js';

const router = express.Router();

// Store pending registration before OTP is sent
router.post('/store', async (req, res) => {
  try {
    const { email, phone, sessionId } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ 
        error: 'Both email and phone are required' 
      });
    }

    const db = await getDatabase();
    const collection = db.collection('pending_registrations');

    // Store or update pending registration
    const pendingReg = {
      email,
      phone,
      sessionId: sessionId || Date.now().toString(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    };

    await collection.updateOne(
      { $or: [{ email }, { phone }] },
      { $set: pendingReg },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      sessionId: pendingReg.sessionId,
      message: 'Pending registration stored'
    });
  } catch (error) {
    console.error('Error storing pending registration:', error);
    res.status(500).json({ 
      error: 'Failed to store pending registration',
      message: error.message 
    });
  }
});

// Retrieve pending registration by email OR phone
router.post('/retrieve', async (req, res) => {
  try {
    const { email, phone } = req.body;

    console.log('📥 Retrieve pending registration request:', { email, phone });

    if (!email && !phone) {
      return res.status(400).json({ 
        error: 'Either email or phone is required' 
      });
    }

    const db = await getDatabase();
    const collection = db.collection('pending_registrations');

    // Normalize phone number - try with and without +
    const phoneVariants = [];
    if (phone) {
      phoneVariants.push(phone);
      if (phone.startsWith('+')) {
        phoneVariants.push(phone.substring(1)); // Without +
      } else {
        phoneVariants.push(`+${phone}`); // With +
      }
    }

    // Build query to match email OR any phone variant
    const orConditions = [];
    if (email) orConditions.push({ email });
    phoneVariants.forEach(p => orConditions.push({ phone: p }));

    console.log('🔍 Searching with query:', { orConditions });

    const pendingReg = await collection.findOne({
      $or: orConditions,
      expiresAt: { $gt: new Date() } // Not expired
    });

    console.log('📦 Found pending registration:', pendingReg);

    if (!pendingReg) {
      return res.status(404).json({ 
        error: 'Pending registration not found or expired' 
      });
    }

    res.status(200).json({
      success: true,
      email: pendingReg.email,
      phone: pendingReg.phone,
      sessionId: pendingReg.sessionId
    });
  } catch (error) {
    console.error('Error retrieving pending registration:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve pending registration',
      message: error.message 
    });
  }
});

// Clean up expired registrations (optional, can be called periodically)
router.delete('/cleanup', async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('pending_registrations');

    const result = await collection.deleteMany({
      expiresAt: { $lt: new Date() }
    });

    res.status(200).json({
      success: true,
      deleted: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up pending registrations:', error);
    res.status(500).json({ 
      error: 'Failed to cleanup',
      message: error.message 
    });
  }
});

export default router;
