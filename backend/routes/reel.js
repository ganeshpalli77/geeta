import express from 'express';
import { ReelModel } from '../models/Reel.js';
import { ProfileModel } from '../models/Profile.js';
import { logger } from '../middleware/logger.js';

const router = express.Router();

// ============================================================================
// PUBLIC ENDPOINTS
// ============================================================================

/**
 * POST /api/reel/submit
 * Submit a new reel
 */
router.post('/submit', async (req, res) => {
  try {
    const { userId, profileId, reelUrl, platform, description } = req.body;

    // Validate required fields
    if (!userId || !profileId || !reelUrl || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, profileId, reelUrl, platform',
      });
    }

    // Validate platform
    const validPlatforms = ['youtube', 'instagram', 'facebook', 'tiktok', 'other'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid platform. Must be: youtube, instagram, facebook, tiktok, or other',
      });
    }

    // Get profile to fetch user details
    const profile = await ProfileModel.findProfileById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Get user details (from profile's userId reference)
    const { getDatabase } = await import('../config/database.js');
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ userId: profile.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create reel submission
    const reelData = {
      userId,
      profileId,
      userName: profile.name,
      userEmail: user.email || user.phone || 'N/A',
      reelUrl,
      platform: platform.toLowerCase(),
      description: description || '',
      round: 1, // Current round
      credits: 100, // Default credits for reel submission
    };

    const reel = await ReelModel.createReel(reelData);

    // Award credits to profile
    await ProfileModel.addCredits(profileId, 100, 'reels');

    logger.info(`Reel submitted by user ${userId}, profile ${profileId}`);

    res.status(201).json({
      success: true,
      message: 'Reel submitted successfully! You earned 100 credits.',
      data: reel,
    });
  } catch (error) {
    logger.error('Error submitting reel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit reel',
      error: error.message,
    });
  }
});

/**
 * GET /api/reel/user/:userId
 * Get all reels by a user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const reels = await ReelModel.findReelsByUserId(userId);

    res.json({
      success: true,
      data: reels,
      count: reels.length,
    });
  } catch (error) {
    logger.error('Error fetching user reels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reels',
      error: error.message,
    });
  }
});

/**
 * GET /api/reel/profile/:profileId
 * Get all reels by a profile
 */
router.get('/profile/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;

    const reels = await ReelModel.findReelsByProfileId(profileId);

    res.json({
      success: true,
      data: reels,
      count: reels.length,
    });
  } catch (error) {
    logger.error('Error fetching profile reels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reels',
      error: error.message,
    });
  }
});

/**
 * GET /api/reel/round/:round/approved
 * Get approved reels for a specific round (public)
 */
router.get('/round/:round/approved', async (req, res) => {
  try {
    const { round } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const reels = await ReelModel.getApprovedReels(round, limit);

    res.json({
      success: true,
      data: reels,
      count: reels.length,
    });
  } catch (error) {
    logger.error('Error fetching approved reels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved reels',
      error: error.message,
    });
  }
});

/**
 * POST /api/reel/:reelId/view
 * Increment reel view count
 */
router.post('/:reelId/view', async (req, res) => {
  try {
    const { reelId } = req.params;

    await ReelModel.incrementViews(reelId);

    res.json({
      success: true,
      message: 'View counted',
    });
  } catch (error) {
    logger.error('Error incrementing reel views:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to count view',
      error: error.message,
    });
  }
});

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * GET /api/reel/admin/all
 * Get all reels with filters and pagination (admin only)
 */
router.get('/admin/all', async (req, res) => {
  try {
    const { round, status, platform, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const options = {
      round,
      status,
      platform,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder: sortOrder === 'asc' ? 1 : -1,
    };

    const result = await ReelModel.getAllReels({}, options);

    // Get statistics
    const stats = await ReelModel.getStatistics(round);

    res.json({
      success: true,
      data: {
        reels: result.reels,
        pagination: result.pagination,
        stats,
      },
    });
  } catch (error) {
    logger.error('Error fetching all reels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reels',
      error: error.message,
    });
  }
});

/**
 * GET /api/reel/admin/stats
 * Get reel statistics (admin only)
 */
router.get('/admin/stats', async (req, res) => {
  try {
    const { round } = req.query;

    const stats = await ReelModel.getStatistics(round);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error fetching reel stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
});

/**
 * PUT /api/reel/admin/:reelId/status
 * Update reel status (approve/reject)
 */
router.put('/admin/:reelId/status', async (req, res) => {
  try {
    const { reelId } = req.params;
    const { status, adminNotes = '' } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected',
      });
    }

    const updatedReel = await ReelModel.updateReelStatus(reelId, status, adminNotes);

    if (!updatedReel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found',
      });
    }

    logger.info(`Reel ${reelId} status updated to ${status}`);

    res.json({
      success: true,
      message: `Reel ${status} successfully`,
      data: updatedReel,
    });
  } catch (error) {
    logger.error('Error updating reel status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reel status',
      error: error.message,
    });
  }
});

/**
 * PUT /api/reel/admin/:reelId/visibility
 * Update reel visibility
 */
router.put('/admin/:reelId/visibility', async (req, res) => {
  try {
    const { reelId } = req.params;
    const { isVisible } = req.body;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isVisible must be a boolean',
      });
    }

    const updatedReel = await ReelModel.updateReelVisibility(reelId, isVisible);

    if (!updatedReel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found',
      });
    }

    logger.info(`Reel ${reelId} visibility updated to ${isVisible}`);

    res.json({
      success: true,
      message: 'Reel visibility updated successfully',
      data: updatedReel,
    });
  } catch (error) {
    logger.error('Error updating reel visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reel visibility',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/reel/admin/:reelId
 * Delete a reel (admin only)
 */
router.delete('/admin/:reelId', async (req, res) => {
  try {
    const { reelId } = req.params;

    const deleted = await ReelModel.deleteReel(reelId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found',
      });
    }

    logger.info(`Reel ${reelId} deleted`);

    res.json({
      success: true,
      message: 'Reel deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting reel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reel',
      error: error.message,
    });
  }
});

export default router;
