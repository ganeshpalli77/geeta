import express from 'express';
import { LoginModel } from '../models/Login.js';

const router = express.Router();

// Create a login record
router.post('/', async (req, res) => {
  try {
    const { userId, email, phone, loginMethod, ipAddress, userAgent, success } = req.body;

    if (!loginMethod || (loginMethod !== 'email' && loginMethod !== 'phone')) {
      return res.status(400).json({ 
        error: 'Invalid login method. Must be "email" or "phone"' 
      });
    }

    if (loginMethod === 'email' && !email) {
      return res.status(400).json({ error: 'Email is required for email login' });
    }

    if (loginMethod === 'phone' && !phone) {
      return res.status(400).json({ error: 'Phone is required for phone login' });
    }

    const login = await LoginModel.createLogin({
      userId,
      email,
      phone,
      loginMethod,
      ipAddress: ipAddress || req.ip,
      userAgent: userAgent || req.get('user-agent'),
      success,
    });

    res.status(201).json({
      success: true,
      login: {
        _id: login._id,
        userId: login.userId,
        email: login.email,
        phone: login.phone,
        loginMethod: login.loginMethod,
        loginAt: login.loginAt,
        success: login.success,
      },
    });
  } catch (error) {
    console.error('Create login record error:', error);
    res.status(500).json({ 
      error: 'Failed to create login record',
      message: error.message 
    });
  }
});

// Get logins by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const logins = await LoginModel.getLoginsByUser(userId);

    res.status(200).json({
      success: true,
      count: logins.length,
      logins,
    });
  } catch (error) {
    console.error('Get logins by user error:', error);
    res.status(500).json({ 
      error: 'Failed to get logins',
      message: error.message 
    });
  }
});

// Get logins by email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const logins = await LoginModel.getLoginsByEmail(email);

    res.status(200).json({
      success: true,
      count: logins.length,
      logins,
    });
  } catch (error) {
    console.error('Get logins by email error:', error);
    res.status(500).json({ 
      error: 'Failed to get logins',
      message: error.message 
    });
  }
});

// Get logins by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const logins = await LoginModel.getLoginsByPhone(phone);

    res.status(200).json({
      success: true,
      count: logins.length,
      logins,
    });
  } catch (error) {
    console.error('Get logins by phone error:', error);
    res.status(500).json({ 
      error: 'Failed to get logins',
      message: error.message 
    });
  }
});

// Get recent logins (admin)
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logins = await LoginModel.getRecentLogins(limit);

    res.status(200).json({
      success: true,
      count: logins.length,
      logins,
    });
  } catch (error) {
    console.error('Get recent logins error:', error);
    res.status(500).json({ 
      error: 'Failed to get recent logins',
      message: error.message 
    });
  }
});

// Get failed logins (admin)
router.get('/failed', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logins = await LoginModel.getFailedLogins(limit);

    res.status(200).json({
      success: true,
      count: logins.length,
      logins,
    });
  } catch (error) {
    console.error('Get failed logins error:', error);
    res.status(500).json({ 
      error: 'Failed to get failed logins',
      message: error.message 
    });
  }
});

export default router;
