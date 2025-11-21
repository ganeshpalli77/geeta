import express from 'express';
import { SloganModel } from '../models/Slogan.js';
import { ProfileModel } from '../models/Profile.js';
import { UserModel } from '../models/User.js';
import { logger } from '../middleware/logger.js';

const router = express.Router();

// ============================================================================
// USER ENDPOINTS
// ============================================================================

/**
 * POST /api/slogan/submit
 * Submit a new slogan
 */
router.post('/submit', async (req, res) => {
  try {
    const { userId, profileId, slogan, round = 1 } = req.body;

    // Validation
    if (!userId || !profileId || !slogan) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, profileId, slogan',
      });
    }

    if (slogan.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Slogan must be at least 10 characters long',
      });
    }

    // Check if user has already submitted for this round (optional - remove if multiple submissions allowed)
    const hasSubmitted = await SloganModel.hasUserSubmittedForRound(userId, profileId, round);
    if (hasSubmitted) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted a slogan for Round ${round}`,
      });
    }

    // Get user and profile details
    const user = await UserModel.findUserById(userId);
    const profile = await ProfileModel.findProfileById(profileId);

    if (!user || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User or profile not found',
      });
    }

    // Create slogan submission
    const sloganData = {
      userId,
      profileId,
      userName: profile.name,
      userEmail: user.email || user.phone || 'N/A',
      slogan: slogan.trim(),
      round,
      credits: 75,
    };

    const newSlogan = await SloganModel.createSlogan(sloganData);

    // Award credits to profile
    await ProfileModel.addCredits(profileId, 75, 'slogans');

    logger.info(`Slogan submitted by user ${userId}, profile ${profileId}`);

    res.status(201).json({
      success: true,
      message: 'Slogan submitted successfully! +75 credits earned',
      data: {
        sloganId: newSlogan._id,
        slogan: newSlogan.slogan,
        credits: 75,
        status: newSlogan.status,
      },
    });
  } catch (error) {
    logger.error('Error submitting slogan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit slogan',
      error: error.message,
    });
  }
});

/**
 * GET /api/slogan/user/:userId
 * Get all slogans by a user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const slogans = await SloganModel.findSlogansByUserId(userId);

    res.json({
      success: true,
      data: slogans,
      count: slogans.length,
    });
  } catch (error) {
    logger.error('Error fetching user slogans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slogans',
      error: error.message,
    });
  }
});

/**
 * GET /api/slogan/profile/:profileId
 * Get all slogans by a profile
 */
router.get('/profile/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;

    const slogans = await SloganModel.findSlogansByProfileId(profileId);

    res.json({
      success: true,
      data: slogans,
      count: slogans.length,
    });
  } catch (error) {
    logger.error('Error fetching profile slogans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slogans',
      error: error.message,
    });
  }
});

/**
 * GET /api/slogan/round/:round/approved
 * Get approved slogans for a specific round (public)
 */
router.get('/round/:round/approved', async (req, res) => {
  try {
    const { round } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const slogans = await SloganModel.getApprovedSlogans(round, limit);

    res.json({
      success: true,
      data: slogans,
      count: slogans.length,
    });
  } catch (error) {
    logger.error('Error fetching approved slogans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved slogans',
      error: error.message,
    });
  }
});

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * GET /api/slogan/admin/all
 * Get all slogans with filters and pagination (admin only)
 */
router.get('/admin/all', async (req, res) => {
  try {
    const { round, status, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const options = {
      round,
      status,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder: sortOrder === 'asc' ? 1 : -1,
    };

    const result = await SloganModel.getAllSlogans({}, options);

    // Get statistics
    const stats = await SloganModel.getStatistics(round);

    res.json({
      success: true,
      data: {
        slogans: result.slogans,
        pagination: result.pagination,
        stats,
      },
    });
  } catch (error) {
    logger.error('Error fetching all slogans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slogans',
      error: error.message,
    });
  }
});

/**
 * GET /api/slogan/admin/stats
 * Get slogan statistics (admin only)
 */
router.get('/admin/stats', async (req, res) => {
  try {
    const { round } = req.query;

    const stats = await SloganModel.getStatistics(round);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error fetching slogan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
});

/**
 * PUT /api/slogan/admin/:sloganId/status
 * Update slogan status (approve/reject)
 */
router.put('/admin/:sloganId/status', async (req, res) => {
  try {
    const { sloganId } = req.params;
    const { status, adminNotes = '' } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected',
      });
    }

    const updatedSlogan = await SloganModel.updateSloganStatus(sloganId, status, adminNotes);

    if (!updatedSlogan) {
      return res.status(404).json({
        success: false,
        message: 'Slogan not found',
      });
    }

    logger.info(`Slogan ${sloganId} status updated to ${status}`);

    res.json({
      success: true,
      message: `Slogan ${status} successfully`,
      data: updatedSlogan,
    });
  } catch (error) {
    logger.error('Error updating slogan status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update slogan status',
      error: error.message,
    });
  }
});

/**
 * PUT /api/slogan/admin/:sloganId
 * Update slogan details (admin only)
 */
router.put('/admin/:sloganId', async (req, res) => {
  try {
    const { sloganId } = req.params;
    const updates = req.body;

    const updatedSlogan = await SloganModel.updateSlogan(sloganId, updates);

    if (!updatedSlogan) {
      return res.status(404).json({
        success: false,
        message: 'Slogan not found',
      });
    }

    logger.info(`Slogan ${sloganId} updated by admin`);

    res.json({
      success: true,
      message: 'Slogan updated successfully',
      data: updatedSlogan,
    });
  } catch (error) {
    logger.error('Error updating slogan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update slogan',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/slogan/admin/:sloganId
 * Delete a slogan (admin only)
 */
router.delete('/admin/:sloganId', async (req, res) => {
  try {
    const { sloganId } = req.params;

    const result = await SloganModel.deleteSlogan(sloganId);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Slogan not found',
      });
    }

    logger.info(`Slogan ${sloganId} deleted by admin`);

    res.json({
      success: true,
      message: 'Slogan deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting slogan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slogan',
      error: error.message,
    });
  }
});

/**
 * GET /api/slogan/admin/:sloganId
 * Get a specific slogan by ID (admin only)
 */
router.get('/admin/:sloganId', async (req, res) => {
  try {
    const { sloganId } = req.params;

    const slogan = await SloganModel.findSloganById(sloganId);

    if (!slogan) {
      return res.status(404).json({
        success: false,
        message: 'Slogan not found',
      });
    }

    res.json({
      success: true,
      data: slogan,
    });
  } catch (error) {
    logger.error('Error fetching slogan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slogan',
      error: error.message,
    });
  }
});

export default router;
