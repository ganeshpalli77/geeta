import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { getQuizConfig, updateQuizConfig, calculateQuestionDistribution } from '../models/QuizConfig.js';

dotenv.config();

const router = express.Router();

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb+srv://geethauser:Getha2024@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let isConnected = false;

// Helper function to ensure connection
async function ensureConnection() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('Quiz route: Connected to MongoDB');
  }
  return client;
}

// Quiz configurations matching frontend
const QUIZ_CONFIGS = {
  daily: {
    totalQuestions: 5,
    easyCount: 2,
    mediumCount: 2,
    hardCount: 1,
  },
  mock: {
    totalQuestions: 30,
    easyCount: 10,
    mediumCount: 15,
    hardCount: 5,
  },
  quiz1: {
    totalQuestions: 30,
    easyCount: 10,
    mediumCount: 15,
    hardCount: 5,
  },
  quiz2: {
    totalQuestions: 40,
    easyCount: 10,
    mediumCount: 20,
    hardCount: 10,
  },
  quiz3: {
    totalQuestions: 50,
    easyCount: 15,
    mediumCount: 20,
    hardCount: 15,
  },
};

/**
 * GET /api/quiz/questions/:quizType
 * Fetch random questions for a specific quiz type
 */
router.get('/questions/:quizType', async (req, res) => {
  try {
    const { quizType } = req.params;
    const config = QUIZ_CONFIGS[quizType];

    if (!config) {
      return res.status(400).json({ 
        error: 'Invalid quiz type',
        validTypes: Object.keys(QUIZ_CONFIGS)
      });
    }

    // Ensure MongoDB connection
    await ensureConnection();
    const questionDb = client.db('questiondatabase');
    const collection = questionDb.collection('english');

    console.log(`📋 Fetching ${quizType} questions:`, config);
    console.log(`   Easy: ${config.easyCount}, Medium: ${config.mediumCount}, Hard: ${config.hardCount}`);

    // Check total documents first
    const totalDocs = await collection.countDocuments();
    console.log(`📊 Total documents in collection: ${totalDocs}`);

    // Fetch questions by difficulty in parallel
    // Note: Database uses "Difficulty" (capital D) field with values like "EASY", "MEDIUM", "HARD"
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      collection
        .aggregate([
          { $match: { Difficulty: { $regex: /^easy$/i } } },
          { $sample: { size: config.easyCount } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: { Difficulty: { $regex: /^medium$/i } } },
          { $sample: { size: config.mediumCount } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: { Difficulty: { $regex: /^hard$/i } } },
          { $sample: { size: config.hardCount } },
        ])
        .toArray(),
    ]);

    console.log(`✅ Fetched: Easy=${easyQuestions.length}, Medium=${mediumQuestions.length}, Hard=${hardQuestions.length}`);

    // Combine and format questions
    // Transform database structure to match frontend expectations
    const allQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ].map(q => {
      // Convert letter answer (A, B, C, D) to index (0, 1, 2, 3)
      const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      const correctAnswerLetter = q['Correct Answer']?.trim().toUpperCase();
      const correctAnswerIndex = answerMap[correctAnswerLetter] ?? 0;
      
      // Build options array from separate fields
      const options = [
        q['Option A'] || '',
        q['Option B'] || '',
        q['Option C'] || '',
        q['Option D'] || '',
      ];
      
      return {
        id: q._id.toString(),
        question: q.Question || '',
        questionHi: q.Question || '', // Use same for now, add Hindi later if available
        options: options,
        optionsHi: options, // Use same for now
        correctAnswer: correctAnswerIndex,
        difficulty: (q.Difficulty || 'medium').toLowerCase(),
        category: q.Category || 'General',
      };
    });

    // Shuffle questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);

    console.log(`🎯 Sending ${shuffled.length} questions for ${quizType}`);

    res.json({
      success: true,
      quizType,
      questions: shuffled,
      count: shuffled.length,
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quiz questions',
      message: error.message 
    });
  }
});

/**
 * GET /api/quiz/stats
 * Get question statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Ensure MongoDB connection
    await ensureConnection();
    const questionDb = client.db('questiondatabase');
    const collection = questionDb.collection('english');

    const [total, easy, medium, hard] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ Difficulty: { $regex: /^easy$/i } }),
      collection.countDocuments({ Difficulty: { $regex: /^medium$/i } }),
      collection.countDocuments({ Difficulty: { $regex: /^hard$/i } }),
    ]);

    res.json({
      success: true,
      stats: { total, easy, medium, hard },
    });
  } catch (error) {
    console.error('Error fetching question stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch question stats',
      message: error.message 
    });
  }
});

/**
 * GET /api/quiz/validate/:quizType
 * Validate if enough questions exist for a quiz type
 */
router.get('/validate/:quizType', async (req, res) => {
  try {
    const { quizType } = req.params;
    const config = QUIZ_CONFIGS[quizType];

    if (!config) {
      return res.status(400).json({ 
        error: 'Invalid quiz type',
        validTypes: Object.keys(QUIZ_CONFIGS)
      });
    }

    // Ensure MongoDB connection
    await ensureConnection();
    const questionDb = client.db('questiondatabase');
    const collection = questionDb.collection('english');

    const [easy, medium, hard] = await Promise.all([
      collection.countDocuments({ Difficulty: { $regex: /^easy$/i } }),
      collection.countDocuments({ Difficulty: { $regex: /^medium$/i } }),
      collection.countDocuments({ Difficulty: { $regex: /^hard$/i } }),
    ]);

    let valid = true;
    let message = '';

    if (easy < config.easyCount) {
      valid = false;
      message = `Not enough easy questions. Need ${config.easyCount}, have ${easy}`;
    } else if (medium < config.mediumCount) {
      valid = false;
      message = `Not enough medium questions. Need ${config.mediumCount}, have ${medium}`;
    } else if (hard < config.hardCount) {
      valid = false;
      message = `Not enough hard questions. Need ${config.hardCount}, have ${hard}`;
    }

    res.json({
      success: true,
      valid,
      message: valid ? 'Sufficient questions available' : message,
    });
  } catch (error) {
    console.error('Error validating questions:', error);
    res.status(500).json({ 
      error: 'Failed to validate questions',
      message: error.message 
    });
  }
});

/**
 * Seeded random number generator for consistent daily questions
 */
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Shuffle array with seed for consistent results
 */
function seededShuffle(array, seed) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get today's date as seed (YYYYMMDD format)
 */
function getTodaySeed() {
  const now = new Date();
  return parseInt(
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0')
  );
}

/**
 * GET /api/quiz/daily-questions
 * Fetch daily quiz questions - same questions for all users on the same day
 */
router.get('/daily-questions', async (req, res) => {
  try {
    // Ensure MongoDB connection
    await ensureConnection();
    const geetaDb = client.db('geetaOlympiad');
    const questionDb = client.db('questiondatabase');
    const collection = questionDb.collection('english');

    // Get quiz configuration
    const config = await getQuizConfig(geetaDb);
    const distribution = calculateQuestionDistribution(config);

    console.log(`📋 Fetching daily quiz questions with config:`, distribution);

    // Get today's seed for consistent question selection
    const todaySeed = getTodaySeed();
    console.log(`🌱 Using seed: ${todaySeed} for today's quiz`);

    // Fetch ALL questions by difficulty
    const [allEasyQuestions, allMediumQuestions, allHardQuestions] = await Promise.all([
      collection
        .find({ Difficulty: { $regex: /^easy$/i } })
        .toArray(),
      collection
        .find({ Difficulty: { $regex: /^medium$/i } })
        .toArray(),
      collection
        .find({ Difficulty: { $regex: /^hard$/i } })
        .toArray(),
    ]);

    console.log(`📊 Available questions: Easy=${allEasyQuestions.length}, Medium=${allMediumQuestions.length}, Hard=${allHardQuestions.length}`);

    // Check if we have enough questions
    const availableTotal = allEasyQuestions.length + allMediumQuestions.length + allHardQuestions.length;
    if (availableTotal < distribution.totalQuestions) {
      console.warn(`⚠️ Not enough questions in database! Requested: ${distribution.totalQuestions}, Available: ${availableTotal}`);
    }

    // Use seeded shuffle to get consistent questions for today
    const shuffledEasy = seededShuffle(allEasyQuestions, todaySeed);
    const shuffledMedium = seededShuffle(allMediumQuestions, todaySeed + 1000);
    const shuffledHard = seededShuffle(allHardQuestions, todaySeed + 2000);

    // Select required number of questions (or all available if not enough)
    let selectedEasy = shuffledEasy.slice(0, Math.min(distribution.easyCount, shuffledEasy.length));
    let selectedMedium = shuffledMedium.slice(0, Math.min(distribution.mediumCount, shuffledMedium.length));
    let selectedHard = shuffledHard.slice(0, Math.min(distribution.hardCount, shuffledHard.length));

    // If we don't have enough medium/hard, fill with easy questions
    const totalSelected = selectedEasy.length + selectedMedium.length + selectedHard.length;
    if (totalSelected < distribution.totalQuestions && shuffledEasy.length > selectedEasy.length) {
      const needed = distribution.totalQuestions - totalSelected;
      const additionalEasy = shuffledEasy.slice(selectedEasy.length, selectedEasy.length + needed);
      selectedEasy = [...selectedEasy, ...additionalEasy];
      console.log(`ℹ️ Added ${additionalEasy.length} more easy questions to reach target count`);
    }

    console.log(`✅ Selected: Easy=${selectedEasy.length}, Medium=${selectedMedium.length}, Hard=${selectedHard.length}`);

    // Combine and format questions
    const allQuestions = [
      ...selectedEasy,
      ...selectedMedium,
      ...selectedHard,
    ].map(q => {
      // Convert letter answer (A, B, C, D) to index (0, 1, 2, 3)
      const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      const correctAnswerLetter = q['Correct Answer']?.trim().toUpperCase();
      const correctAnswerIndex = answerMap[correctAnswerLetter] ?? 0;
      
      // Build options array from separate fields
      const options = [
        q['Option A'] || '',
        q['Option B'] || '',
        q['Option C'] || '',
        q['Option D'] || '',
      ];
      
      return {
        id: q._id.toString(),
        question: q.Question || '',
        questionHi: q['Question (Hindi)'] || q.Question || '', // Use Hindi field if available
        options: options,
        optionsHi: [
          q['Option A (Hindi)'] || q['Option A'] || '',
          q['Option B (Hindi)'] || q['Option B'] || '',
          q['Option C (Hindi)'] || q['Option C'] || '',
          q['Option D (Hindi)'] || q['Option D'] || '',
        ],
        correctAnswer: correctAnswerIndex,
        difficulty: (q.Difficulty || 'medium').toLowerCase(),
        category: q.Category || 'General',
      };
    });

    // Shuffle the combined questions with seed for consistent order
    const finalQuestions = seededShuffle(allQuestions, todaySeed + 3000);

    console.log(`🎯 Sending ${finalQuestions.length} daily quiz questions`);

    res.json({
      success: true,
      questions: finalQuestions,
      count: finalQuestions.length,
      date: new Date().toISOString().split('T')[0],
      seed: todaySeed,
    });
  } catch (error) {
    console.error('Error fetching daily quiz questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch daily quiz questions',
      message: error.message 
    });
  }
});

/**
 * GET /api/quiz/config
 * Get quiz configuration
 */
router.get('/config', async (req, res) => {
  try {
    await ensureConnection();
    const geetaDb = client.db('geetaOlympiad');
    const config = await getQuizConfig(geetaDb);
    
    res.json({
      success: true,
      config: {
        dailyQuizQuestionCount: config.dailyQuizQuestionCount,
        easyPercentage: config.easyPercentage,
        mediumPercentage: config.mediumPercentage,
        hardPercentage: config.hardPercentage,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz config:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quiz config',
      message: error.message 
    });
  }
});

/**
 * PUT /api/quiz/config
 * Update quiz configuration (admin only)
 */
router.put('/config', async (req, res) => {
  try {
    const { dailyQuizQuestionCount, easyPercentage, mediumPercentage, hardPercentage } = req.body;

    // Validate input
    if (!dailyQuizQuestionCount || dailyQuizQuestionCount < 5 || dailyQuizQuestionCount > 50) {
      return res.status(400).json({ 
        error: 'Invalid question count. Must be between 5 and 50.' 
      });
    }

    if (easyPercentage + mediumPercentage + hardPercentage !== 100) {
      return res.status(400).json({ 
        error: 'Percentages must add up to 100' 
      });
    }

    await ensureConnection();
    const geetaDb = client.db('geetaOlympiad');
    
    await updateQuizConfig(geetaDb, {
      dailyQuizQuestionCount,
      easyPercentage,
      mediumPercentage,
      hardPercentage,
    });

    res.json({
      success: true,
      message: 'Quiz configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating quiz config:', error);
    res.status(500).json({ 
      error: 'Failed to update quiz config',
      message: error.message 
    });
  }
});

export default router;
