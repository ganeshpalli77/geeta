import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

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

    // Fetch questions by difficulty in parallel
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      collection
        .aggregate([
          { $match: { difficulty: 'easy' } },
          { $sample: { size: config.easyCount } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: { difficulty: 'medium' } },
          { $sample: { size: config.mediumCount } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: { difficulty: 'hard' } },
          { $sample: { size: config.hardCount } },
        ])
        .toArray(),
    ]);

    // Combine and format questions
    const allQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ].map(q => ({
      id: q._id.toString(),
      question: q.question,
      questionHi: q.questionHi || q.question,
      options: q.options,
      optionsHi: q.optionsHi || q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      category: q.category || 'General',
    }));

    // Shuffle questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);

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
      collection.countDocuments({ difficulty: 'easy' }),
      collection.countDocuments({ difficulty: 'medium' }),
      collection.countDocuments({ difficulty: 'hard' }),
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
      collection.countDocuments({ difficulty: 'easy' }),
      collection.countDocuments({ difficulty: 'medium' }),
      collection.countDocuments({ difficulty: 'hard' }),
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

export default router;
