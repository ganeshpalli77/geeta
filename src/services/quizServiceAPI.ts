// Quiz Service API - Frontend API calls
// This replaces direct MongoDB connection with API calls to backend

import { QuizQuestion } from '../contexts/AppContext';

// API base URL - update this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch quiz questions from backend API
 */
export async function getQuizQuestions(
  quizType: 'daily' | 'mock' | 'quiz1' | 'quiz2' | 'quiz3'
): Promise<QuizQuestion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/questions/${quizType}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz questions: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
}

/**
 * Get question statistics
 */
export async function getQuestionStats(): Promise<{
  total: number;
  easy: number;
  medium: number;
  hard: number;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch question stats: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching question stats:', error);
    throw error;
  }
}

/**
 * Validate if enough questions exist for a quiz type
 */
export async function validateQuestionAvailability(
  quizType: 'daily' | 'mock' | 'quiz1' | 'quiz2' | 'quiz3'
): Promise<{ valid: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/validate/${quizType}`);
    
    if (!response.ok) {
      throw new Error(`Failed to validate questions: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error validating questions:', error);
    return {
      valid: false,
      message: 'Error validating question availability',
    };
  }
}
