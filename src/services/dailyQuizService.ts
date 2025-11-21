// Daily Quiz Service - Seed-based random selection for consistent questions
// Ensures all users get the same questions for a given day

import { QuizQuestion } from '../contexts/AppContext';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get daily quiz questions for today
 * All users will receive the same questions for the same day
 */
export async function getDailyQuizQuestions(language: 'en' | 'hi' = 'en'): Promise<QuizQuestion[]> {
  try {
    const url = `${API_BASE_URL}/quiz/daily-questions`;
    console.log('🔄 Fetching daily quiz questions from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`Failed to fetch daily quiz questions: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Received daily quiz data:', data);
    
    if (!data.questions || data.questions.length === 0) {
      console.warn('⚠️ No questions returned from API');
      return [];
    }
    
    return data.questions;
  } catch (error) {
    console.error('❌ Error fetching daily quiz questions:', error);
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
