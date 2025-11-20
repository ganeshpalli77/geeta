import express from 'express';
import { UserModel } from '../models/User.js';

const router = express.Router();

// Register or get user by email/phone
router.post('/register', async (req, res) => {
  try {
    const { userId, email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ 
        error: 'Either email or phone is required' 
      });
    }

    // Find or create user
    const user = await UserModel.findOrCreateUser({ userId, email, phone });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      message: error.message 
    });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user',
      message: error.message 
    });
  }
});

// Update user
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await UserModel.updateUser(userId, updates);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      error: 'Failed to update user',
      message: error.message 
    });
  }
});

// Find user by email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Find user by email error:', error);
    res.status(500).json({ 
      error: 'Failed to find user',
      message: error.message 
    });
  }
});

// Find user by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await UserModel.findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Find user by phone error:', error);
    res.status(500).json({ 
      error: 'Failed to find user',
      message: error.message 
    });
  }
});

export default router;
