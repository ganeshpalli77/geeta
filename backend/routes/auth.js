import express from 'express';
import { getDatabase } from '../config/database.js';
import { 
  verifyAdminCredentials, 
  createAdmin, 
  initializeDefaultAdmin,
  getAllAdmins 
} from '../models/Admin.js';

const router = express.Router();

/**
 * POST /api/auth/send-otp
 * Send OTP for authentication
 * This is a placeholder for actual OTP implementation
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ 
        error: 'Email or phone is required' 
      });
    }

    // TODO: Implement actual OTP sending via email/SMS service
    // For now, just return success
    console.log('OTP send request:', { email, phone });

    res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      error: 'Failed to send OTP',
      message: error.message 
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and login/register user
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp, type } = req.body;

    if (!identifier || !otp || !type) {
      return res.status(400).json({ 
        error: 'Identifier, OTP, and type are required' 
      });
    }

    // TODO: Implement actual OTP verification
    // For now, accept any 4-digit OTP
    if (!/^\d{4}$/.test(otp)) {
      return res.status(401).json({ 
        error: 'Invalid OTP format' 
      });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    // Check if user exists
    const filter = type === 'email' ? { email: identifier } : { phone: identifier };
    let user = await usersCollection.findOne(filter);
    const isNewUser = !user;

    if (!user) {
      // Create new user
      const userData = {
        ...(type === 'email' ? { email: identifier } : { phone: identifier }),
        profiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const result = await usersCollection.insertOne(userData);
      user = { _id: result.insertedId, ...userData };
    }

    res.json({
      success: true,
      user: {
        _id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        profiles: user.profiles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      isNewUser,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      error: 'Failed to verify OTP',
      message: error.message 
    });
  }
});

/**
 * POST /api/auth/admin-login
 * Admin login endpoint - checks MongoDB for admin credentials
 * Auto-creates default admin if none exists
 */
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    const db = await getDatabase();

    // Initialize default admin if no admins exist
    await initializeDefaultAdmin(db);

    // Verify credentials against MongoDB
    const result = await verifyAdminCredentials(db, username, password);

    if (result.success) {
      res.json({
        success: true,
        message: 'Admin login successful',
        admin: result.admin,
      });
    } else {
      res.status(401).json({ 
        error: result.error || 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ 
      error: 'Failed to process admin login',
      message: error.message 
    });
  }
});

/**
 * POST /api/auth/admin-register
 * Register a new admin (requires existing admin authentication in production)
 */
router.post('/admin-register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    const db = await getDatabase();

    // Create new admin
    const admin = await createAdmin(db, {
      username,
      password,
      email: email || '',
      role: role || 'admin',
    });

    res.json({
      success: true,
      message: 'Admin registered successfully',
      admin,
    });
  } catch (error) {
    console.error('Error during admin registration:', error);
    
    if (error.message === 'Admin username already exists') {
      res.status(409).json({ 
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to register admin',
        message: error.message 
      });
    }
  }
});

/**
 * GET /api/auth/admins
 * Get all admins (for admin management)
 */
router.get('/admins', async (req, res) => {
  try {
    const db = await getDatabase();
    const admins = await getAllAdmins(db);

    res.json({
      success: true,
      admins,
      count: admins.length,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ 
      error: 'Failed to fetch admins',
      message: error.message 
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout endpoint (can be extended for session management)
 */
router.post('/logout', async (req, res) => {
  try {
    // TODO: Implement session cleanup if using sessions
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ 
      error: 'Failed to logout',
      message: error.message 
    });
  }
});

export default router;

