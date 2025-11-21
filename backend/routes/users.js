import express from 'express';
import { UserModel } from '../models/User.js';

const router = express.Router();

// Check if user exists by email or phone
router.post('/check-exists', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ 
        error: 'Either email or phone is required' 
      });
    }

    console.log('🔍 Checking if user exists:', { email, phone });

    // Find user by email or phone
    const user = await UserModel.findUserByEmailOrPhone(email, phone);

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ 
        error: 'User not found',
        message: 'No account exists with this email or phone. Please register first.' 
      });
    }

    // Determine which field matched
    let matchedField = '';
    if (email && user.email === email) {
      matchedField = 'email';
    } else if (phone && user.phone === phone) {
      matchedField = 'phone';
    }

    console.log('✅ User exists:', user.userId, 'matched by:', matchedField);
    res.status(200).json({ 
      exists: true,
      matchedField: matchedField,
      message: `Account found with this ${matchedField}` 
    });
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ 
      error: 'Failed to check user existence',
      message: error.message 
    });
  }
});

// NEW: Register user with BOTH email and phone
router.post('/register', async (req, res) => {
  try {
    const { userId, email, phone } = req.body;

    // NEW: Both email and phone are REQUIRED
    if (!email || !phone) {
      return res.status(400).json({ 
        error: 'Both email and phone are required',
        message: 'You must provide both email address and phone number to register'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Validate phone format (basic validation)
    if (phone.length < 10) {
      return res.status(400).json({ 
        error: 'Invalid phone number' 
      });
    }

    // Find or create user with both email and phone
    const user = await UserModel.findOrCreateUser({ userId, email, phone });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        verifiedWith: user.verifiedWith,
        createdAt: user.createdAt,
      },
      message: user.registeredAt ? 'User logged in' : 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      message: error.message 
    });
  }
});

// NEW: Update verification status after OTP verification
router.post('/verify', async (req, res) => {
  try {
    const { userId, verificationType } = req.body; // verificationType: 'email' or 'phone'

    if (!userId || !verificationType) {
      return res.status(400).json({ 
        error: 'userId and verificationType are required' 
      });
    }

    if (verificationType !== 'email' && verificationType !== 'phone') {
      return res.status(400).json({ 
        error: 'verificationType must be either "email" or "phone"' 
      });
    }

    const user = await UserModel.updateVerification(userId, verificationType);

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
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        verifiedWith: user.verifiedWith,
      },
      message: `${verificationType} verified successfully`
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify user',
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
