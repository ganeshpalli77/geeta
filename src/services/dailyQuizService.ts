// Daily Quiz Service - Seed-based random selection for consistent questions
// Ensures all users get the same questions for a given day

import { QuizQuestion } from '../contexts/AppContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cache for daily questions to prevent redundant API calls
interface QuestionCache {
  questions: QuizQuestion[];
  date: string;
  timestamp: number;
}

let questionCache: QuestionCache | null = null;
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * Get daily quiz questions for today
 * All users will receive the same questions for the same day
 */
export async function getDailyQuizQuestions(language: 'en' | 'hi' = 'en'): Promise<QuizQuestion[]> {
  try {
    // Check cache first
    const today = new Date().toISOString().split('T')[0];
    if (questionCache && 
        questionCache.date === today && 
        Date.now() - questionCache.timestamp < CACHE_DURATION) {
      console.log('✅ Returning cached daily quiz questions');
      return questionCache.questions;
    }

    const url = `${API_BASE_URL}/quiz/daily-questions`;
    console.log('🔄 Fetching daily quiz questions from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`Failed to fetch daily quiz questions: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Received data:', data);
    
    if (!data.questions || data.questions.length === 0) {
      console.warn('⚠️ No questions returned from API');
      return [];
    }
    
    console.log(`✅ Loaded ${data.questions.length} daily quiz questions`);
    
    // Update cache
    questionCache = {
      questions: data.questions,
      date: today,
      timestamp: Date.now()
    };
    
    return data.questions;
  } catch (error) {
    console.error('❌ Error in getDailyQuizQuestions:', error);
    // Return cached questions if available, even if expired
    if (questionCache?.questions) {
      console.log('⚠️ Returning expired cache due to error');
      return questionCache.questions;
    }
    throw error;
  }
}

/**
 * Get quiz configuration from admin settings
 */
export async function getQuizConfig(): Promise<{
  dailyQuizQuestionCount: number;
  easyPercentage: number;
  mediumPercentage: number;
  hardPercentage: number;
}> {
  try {
    const url = `${API_BASE_URL}/quiz/config`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz config');
    }
    
    const data = await response.json();
    return data.config;
  } catch (error) {
    console.error('Error fetching quiz config:', error);
    // Return default config
    return {
      dailyQuizQuestionCount: 10,
      easyPercentage: 40,
      mediumPercentage: 40,
      hardPercentage: 20,
    };
  }
}

/**
 * Update quiz configuration (admin only)
 */
export async function updateQuizConfig(config: {
  dailyQuizQuestionCount: number;
  easyPercentage: number;
  mediumPercentage: number;
  hardPercentage: number;
}): Promise<void> {
  try {
    const url = `${API_BASE_URL}/quiz/config`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update quiz config');
    }
  } catch (error) {
    console.error('Error updating quiz config:', error);
    throw error;
  }
}
