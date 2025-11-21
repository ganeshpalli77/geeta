import express from 'express';
import { getDatabase } from '../config/database.js';

const router = express.Router();

/**
 * Calculate profile scores from various activities
 */
async function calculateProfileScore(db, profileId) {
  const profilesCollection = db.collection('profiles');
  const quizAttemptsCollection = db.collection('quizAttempts');
  const videoSubmissionsCollection = db.collection('videoSubmissions');
  const sloganSubmissionsCollection = db.collection('sloganSubmissions');
  const imagePartsCollection = db.collection('imageParts');

  // Get profile info
  const profile = await profilesCollection.findOne({ _id: profileId });
  if (!profile) return null;

  // Quiz score - sum of all quiz scores
  const quizAttempts = await quizAttemptsCollection.find({ profileId }).toArray();
  const quizScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);

  // Video score - sum of approved video credit scores
  const videos = await videoSubmissionsCollection.find({ 
    profileId, 
    status: 'approved' 
  }).toArray();
  const videoScore = videos.reduce((sum, video) => sum + (video.creditScore || 0), 0);

  // Slogan score - sum of approved slogan credit scores
  const slogans = await sloganSubmissionsCollection.find({ 
    profileId, 
    status: 'approved' 
  }).toArray();
  const sloganScore = slogans.reduce((sum, slogan) => sum + (slogan.creditScore || 0), 0);

  // Puzzle score - 10 points per piece + 100 bonus for completion
  const parts = await imagePartsCollection.find({ profileId }).toArray();
  const puzzleScore = parts.length * 10 + (parts.length === 45 ? 100 : 0);

  // Event score is everything except quiz
  const eventScore = videoScore + sloganScore + puzzleScore;
  const totalScore = quizScore + eventScore;

  // Weekly score (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recentAttempts = quizAttempts.filter(a => a.completedAt >= weekAgo);
  const weeklyScore = recentAttempts.reduce((sum, a) => sum + (a.score || 0), 0);

  return {
    profileId,
    name: profile.name,
    category: profile.category || 'General',
    totalScore,
    quizScore,
    eventScore,
    weeklyScore,
  };
}

/**
 * GET /api/leaderboard/overall
 * Get overall leaderboard with all profiles ranked by total score
 */
router.get('/overall', async (req, res) => {
  try {
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');

    // Get all profiles
    const profiles = await profilesCollection.find({}).toArray();

    // Calculate scores for each profile
    const entries = [];
    for (const profile of profiles) {
      const scoreData = await calculateProfileScore(db, profile._id);
      if (scoreData) {
        entries.push(scoreData);
      }
    }

    // Sort by total score
    entries.sort((a, b) => b.totalScore - a.totalScore);

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json({
      success: true,
      leaderboard: entries,
      count: entries.length,
    });
  } catch (error) {
    console.error('Error fetching overall leaderboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leaderboard',
      message: error.message 
    });
  }
});

/**
 * GET /api/leaderboard/weekly
 * Get weekly leaderboard ranked by weekly score
 */
router.get('/weekly', async (req, res) => {
  try {
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');

    // Get all profiles
    const profiles = await profilesCollection.find({}).toArray();

    // Calculate scores for each profile
    const entries = [];
    for (const profile of profiles) {
      const scoreData = await calculateProfileScore(db, profile._id);
      if (scoreData && scoreData.weeklyScore > 0) { // Only include profiles with weekly activity
        entries.push(scoreData);
      }
    }

    // Sort by weekly score
    entries.sort((a, b) => b.weeklyScore - a.weeklyScore);

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json({
      success: true,
      leaderboard: entries,
      count: entries.length,
    });
  } catch (error) {
    console.error('Error fetching weekly leaderboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leaderboard',
      message: error.message 
    });
  }
});

/**
 * GET /api/leaderboard/rank/:profileId
 * Get rank information for a specific profile
 */
router.get('/rank/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');

    // Get all profiles
    const profiles = await profilesCollection.find({}).toArray();

    // Calculate scores for each profile
    const entries = [];
    for (const profile of profiles) {
      const scoreData = await calculateProfileScore(db, profile._id);
      if (scoreData) {
        entries.push(scoreData);
      }
    }

    // Sort by total score
    entries.sort((a, b) => b.totalScore - a.totalScore);

    // Find the profile's rank
    const profileIndex = entries.findIndex(e => e.profileId === profileId);
    const rank = profileIndex >= 0 ? profileIndex + 1 : 0;

    res.json({
      success: true,
      rank,
      totalParticipants: entries.length,
    });
  } catch (error) {
    console.error('Error fetching profile rank:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile rank',
      message: error.message 
    });
  }
});

/**
 * GET /api/leaderboard/category/:category
 * Get leaderboard filtered by category
 */
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');

    // Get profiles in this category
    const profiles = await profilesCollection.find({ category }).toArray();

    // Calculate scores for each profile
    const entries = [];
    for (const profile of profiles) {
      const scoreData = await calculateProfileScore(db, profile._id);
      if (scoreData) {
        entries.push(scoreData);
      }
    }

    // Sort by total score
    entries.sort((a, b) => b.totalScore - a.totalScore);

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json({
      success: true,
      leaderboard: entries,
      category,
      count: entries.length,
    });
  } catch (error) {
    console.error('Error fetching category leaderboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch category leaderboard',
      message: error.message 
    });
  }
});

export default router;

