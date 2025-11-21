import express from 'express';
import { PhoneUserModel } from '../models/PhoneUser.js';

const router = express.Router();

// Register or login with phone
router.post('/register', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        error: 'Phone number is required' 
      });
    }

    // Phone validation (basic - accepts various formats)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ 
        error: 'Invalid phone number format' 
      });
    }

    // Find or create user
    const user = await PhoneUserModel.findOrCreatePhoneUser(phone);

    // Update last login
    await PhoneUserModel.updateLastLogin(user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        phone: user.phone,
        registeredAt: user.registeredAt,
        lastLogin: new Date(),
      },
      message: user.registeredAt.getTime() === user.updatedAt.getTime() 
        ? 'New user registered' 
        : 'User logged in',
    });
  } catch (error) {
    console.error('Phone registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register/login user',
      message: error.message 
    });
  }
});

// Get user by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await PhoneUserModel.findByPhone(phone);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        phone: user.phone,
        registeredAt: user.registeredAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get phone user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user',
      message: error.message 
    });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await PhoneUserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        phone: user.phone,
        registeredAt: user.registeredAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get phone user by ID error:', error);
    res.status(500).json({ 
      error: 'Failed to get user',
      message: error.message 
    });
  }
});

// Get all phone users (with pagination)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const users = await PhoneUserModel.getAllPhoneUsers(limit, skip);
    const total = await PhoneUserModel.countPhoneUsers();

    res.status(200).json({
      success: true,
      users: users.map(user => ({
        _id: user._id,
        phone: user.phone,
        registeredAt: user.registeredAt,
        lastLogin: user.lastLogin,
      })),
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + users.length < total,
      },
    });
  } catch (error) {
    console.error('Get all phone users error:', error);
    res.status(500).json({ 
      error: 'Failed to get users',
      message: error.message 
    });
  }
});

// Update phone user
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await PhoneUserModel.updatePhoneUser(userId, updates);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        phone: user.phone,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update phone user error:', error);
    res.status(500).json({ 
      error: 'Failed to update user',
      message: error.message 
    });
  }
});

export default router;
