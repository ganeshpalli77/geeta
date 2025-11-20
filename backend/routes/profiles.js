import express from 'express';
import { ProfileModel } from '../models/Profile.js';

const router = express.Router();

// Create a new profile
router.post('/', async (req, res) => {
  try {
    const { userId, name, prn, dob, preferredLanguage, category } = req.body;

    console.log('Create profile request:', { userId, name, prn, dob, preferredLanguage, category });

    if (!userId || !name || !prn || !dob || !preferredLanguage) {
      console.error('Missing required fields:', { userId: !!userId, name: !!name, prn: !!prn, dob: !!dob, preferredLanguage: !!preferredLanguage });
      return res.status(400).json({ 
        error: 'Missing required fields: userId, name, prn, dob, preferredLanguage' 
      });
    }

    // Check if profile with same PRN already exists for this user
    // Only check if PRN is not empty and not a generic value
    const existingProfiles = await ProfileModel.findProfilesByUserId(userId);
    console.log('Existing profiles for user:', existingProfiles.length);
    
    // Only validate duplicate PRN if it's a meaningful value (not just numbers like "123")
    if (prn && prn.length > 3) {
      const duplicatePRN = existingProfiles.find(p => p.prn === prn);
      if (duplicatePRN) {
        console.log('Duplicate PRN found:', prn);
        return res.status(400).json({
          error: 'A profile with this PRN already exists for this user'
        });
      }
    }

    const profile = await ProfileModel.createProfile({
      userId,
      name,
      prn,
      dob,
      preferredLanguage,
      category,
    });

    console.log('Profile created in DB:', profile);
    console.log('Profile _id:', profile._id);
    console.log('Profile _id type:', typeof profile._id);

    res.status(201).json({
      success: true,
      profile: {
        _id: profile._id.toString(), // Convert ObjectId to string
        userId: profile.userId,
        name: profile.name,
        prn: profile.prn,
        dob: profile.dob,
        preferredLanguage: profile.preferredLanguage,
        category: profile.category,
        createdAt: profile.createdAt,
      },
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ 
      error: 'Failed to create profile',
      message: error.message 
    });
  }
});

// Get profile by ID
router.get('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await ProfileModel.findProfileById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get profile',
      message: error.message 
    });
  }
});

// Get all profiles for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profiles = await ProfileModel.findProfilesByUserId(userId);

    res.status(200).json({
      success: true,
      profiles,
    });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ 
      error: 'Failed to get profiles',
      message: error.message 
    });
  }
});

// Update profile
router.put('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const updates = req.body;

    const profile = await ProfileModel.updateProfile(profileId, updates);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

// Delete profile
router.delete('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const result = await ProfileModel.deleteProfile(profileId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ 
      error: 'Failed to delete profile',
      message: error.message 
    });
  }
});

// Set active profile for a user
router.put('/:profileId/set-active', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const profile = await ProfileModel.setActiveProfile(userId, profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found or does not belong to user' });
    }

    res.status(200).json({
      success: true,
      profile,
      message: 'Active profile updated successfully',
    });
  } catch (error) {
    console.error('Set active profile error:', error);
    res.status(500).json({ 
      error: 'Failed to set active profile',
      message: error.message 
    });
  }
});

// Get active profile for a user
router.get('/user/:userId/active', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await ProfileModel.getActiveProfile(userId);

    if (!profile) {
      return res.status(404).json({ 
        error: 'No active profile found',
        message: 'User has no active profile set'
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get active profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get active profile',
      message: error.message 
    });
  }
});

// Count profiles for a user
router.get('/user/:userId/count', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await ProfileModel.countProfilesByUserId(userId);

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Count profiles error:', error);
    res.status(500).json({ 
      error: 'Failed to count profiles',
      message: error.message 
    });
  }
});

export default router;
