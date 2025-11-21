// Quiz Service - MongoDB Integration
// Fetches random questions from the questiondatabase.english collection

import { MongoClient, Db, Collection } from 'mongodb';
import { DATABASE_CONFIG } from '../config/database';

// Question interface matching your database structure
export interface QuizQuestion {
  id: string;
  _id?: string;
  question: string;
  questionHi: string;
  options: string[];
  optionsHi: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  chapter?: number;
}

// Quiz configuration for different types
export interface QuizConfig {
  totalQuestions: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

// Default quiz configurations
export const QUIZ_CONFIGS: Record<string, QuizConfig> = {
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
 * Connect to the question database
 */
async function connectToQuestionDatabase(): Promise<Db> {
  const client = new MongoClient(DATABASE_CONFIG.MONGODB_URI);
  await client.connect();
  return client.db('questiondatabase');
}

/**
 * Get the English questions collection
 */
async function getQuestionsCollection(): Promise<Collection<QuizQuestion>> {
  const db = await connectToQuestionDatabase();
  return db.collection<QuizQuestion>('english');
}

/**
 * Fetch random questions by difficulty
 */
async function fetchQuestionsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): Promise<QuizQuestion[]> {
  try {
    const collection = await getQuestionsCollection();
    
    // Use MongoDB aggregation to get random questions
    const questions = await collection
      .aggregate<QuizQuestion>([
        { $match: { difficulty } },
        { $sample: { size: count } },
      ])
      .toArray();

    return questions.map(q => ({
      ...q,
      id: q._id?.toString() || Math.random().toString(36).substr(2, 9),
      category: q.category || 'General',
      questionHi: q.questionHi || q.question,
      optionsHi: q.optionsHi || q.options,
    }));
  } catch (error) {
    console.error(`Error fetching ${difficulty} questions:`, error);
    throw error;
  }
}

/**
 * Get random mixed questions for daily quiz
 * Returns 5 questions: 2 easy, 2 medium, 1 hard
 */
export async function getDailyQuizQuestions(): Promise<QuizQuestion[]> {
  const config = QUIZ_CONFIGS.daily;
  
  try {
    console.log('🔄 Fetching daily quiz questions...');
    
    // Fetch questions by difficulty in parallel
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      fetchQuestionsByDifficulty('easy', config.easyCount),
      fetchQuestionsByDifficulty('medium', config.mediumCount),
      fetchQuestionsByDifficulty('hard', config.hardCount),
    ]);

    // Combine all questions
    const allQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ];

    // Shuffle the combined questions for random order
    const shuffledQuestions = shuffleArray(allQuestions);

    console.log(`✅ Fetched ${shuffledQuestions.length} questions:`, {
      easy: easyQuestions.length,
      medium: mediumQuestions.length,
      hard: hardQuestions.length,
    });

    return shuffledQuestions;
  } catch (error) {
    console.error('❌ Error fetching daily quiz questions:', error);
    throw new Error('Failed to fetch quiz questions from database');
  }
}

/**
 * Get random questions for any quiz type
 */
export async function getQuizQuestions(
  quizType: 'daily' | 'mock' | 'quiz1' | 'quiz2' | 'quiz3'
): Promise<QuizQuestion[]> {
  const config = QUIZ_CONFIGS[quizType];
  
  if (!config) {
    throw new Error(`Invalid quiz type: ${quizType}`);
  }

  try {
    console.log(`🔄 Fetching ${quizType} quiz questions...`);
    
    // Fetch questions by difficulty in parallel
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      fetchQuestionsByDifficulty('easy', config.easyCount),
      fetchQuestionsByDifficulty('medium', config.mediumCount),
      fetchQuestionsByDifficulty('hard', config.hardCount),
    ]);

    // Combine all questions
    const allQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ];

    // Shuffle the combined questions
    const shuffledQuestions = shuffleArray(allQuestions);

    console.log(`✅ Fetched ${shuffledQuestions.length} questions for ${quizType}:`, {
      easy: easyQuestions.length,
      medium: mediumQuestions.length,
      hard: hardQuestions.length,
    });

    return shuffledQuestions;
  } catch (error) {
    console.error(`❌ Error fetching ${quizType} questions:`, error);
    throw new Error(`Failed to fetch ${quizType} questions from database`);
  }
}

/**
 * Get questions by specific criteria
 */
export async function getQuestionsByCriteria(criteria: {
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  chapter?: number;
  limit?: number;
}): Promise<QuizQuestion[]> {
  try {
    const collection = await getQuestionsCollection();
    
    // Build query filter
    const filter: any = {};
    if (criteria.difficulty) filter.difficulty = criteria.difficulty;
    if (criteria.category) filter.category = criteria.category;
    if (criteria.chapter) filter.chapter = criteria.chapter;

    const limit = criteria.limit || 10;

    // Fetch with random sampling
    const questions = await collection
      .aggregate<QuizQuestion>([
        { $match: filter },
        { $sample: { size: limit } },
      ])
      .toArray();

    return questions.map(q => ({
      ...q,
      id: q._id?.toString() || Math.random().toString(36).substr(2, 9),
      category: q.category || 'General',
      questionHi: q.questionHi || q.question,
      optionsHi: q.optionsHi || q.options,
    }));
  } catch (error) {
    console.error('Error fetching questions by criteria:', error);
    throw error;
  }
}

/**
 * Get total question count by difficulty
 */
export async function getQuestionStats(): Promise<{
  total: number;
  easy: number;
  medium: number;
  hard: number;
}> {
  try {
    const collection = await getQuestionsCollection();
    
    const [total, easy, medium, hard] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ difficulty: 'easy' }),
      collection.countDocuments({ difficulty: 'medium' }),
      collection.countDocuments({ difficulty: 'hard' }),
    ]);

    return { total, easy, medium, hard };
  } catch (error) {
    console.error('Error fetching question stats:', error);
    throw error;
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validate if enough questions exist in database
 */
export async function validateQuestionAvailability(
  quizType: 'daily' | 'mock' | 'quiz1' | 'quiz2' | 'quiz3'
): Promise<{ valid: boolean; message?: string }> {
  try {
    const config = QUIZ_CONFIGS[quizType];
    const stats = await getQuestionStats();

    if (stats.easy < config.easyCount) {
      return {
        valid: false,
        message: `Not enough easy questions. Need ${config.easyCount}, have ${stats.easy}`,
      };
    }

    if (stats.medium < config.mediumCount) {
      return {
        valid: false,
        message: `Not enough medium questions. Need ${config.mediumCount}, have ${stats.medium}`,
      };
    }

    if (stats.hard < config.hardCount) {
      return {
        valid: false,
        message: `Not enough hard questions. Need ${config.hardCount}, have ${stats.hard}`,
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      message: 'Error validating question availability',
    };
  }
}
