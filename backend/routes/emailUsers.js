import express from 'express';
import { EmailUserModel } from '../models/EmailUser.js';

const router = express.Router();

// Register or login with email
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Find or create user
    const user = await EmailUserModel.findOrCreateEmailUser(email);

    // Update last login
    await EmailUserModel.updateLastLogin(user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        registeredAt: user.registeredAt,
        lastLogin: new Date(),
      },
      message: user.registeredAt.getTime() === user.updatedAt.getTime() 
        ? 'New user registered' 
        : 'User logged in',
    });
  } catch (error) {
    console.error('Email registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register/login user',
      message: error.message 
    });
  }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await EmailUserModel.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        registeredAt: user.registeredAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get email user error:', error);
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
    const user = await EmailUserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        registeredAt: user.registeredAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get email user by ID error:', error);
    res.status(500).json({ 
      error: 'Failed to get user',
      message: error.message 
    });
  }
});

// Get all email users (with pagination)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const users = await EmailUserModel.getAllEmailUsers(limit, skip);
    const total = await EmailUserModel.countEmailUsers();

    res.status(200).json({
      success: true,
      users: users.map(user => ({
        _id: user._id,
        email: user.email,
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
    console.error('Get all email users error:', error);
    res.status(500).json({ 
      error: 'Failed to get users',
      message: error.message 
    });
  }
});

// Update email user
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await EmailUserModel.updateEmailUser(userId, updates);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update email user error:', error);
    res.status(500).json({ 
      error: 'Failed to update user',
      message: error.message 
    });
  }
});

export default router;
