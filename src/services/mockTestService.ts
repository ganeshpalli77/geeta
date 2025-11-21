// Mock Test Service - Random selection for practice
// Unlike daily quiz, mock test questions are randomly selected each time

import { QuizQuestion } from '../contexts/AppContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get mock test questions for practice
 * Questions are randomly selected each time (not seed-based)
 */
export async function getMockTestQuestions(language: string = 'english'): Promise<QuizQuestion[]> {
  try {
    const url = `${API_BASE_URL}/quiz/mock-test-questions?language=${language}`;
    console.log('🔄 Fetching mock test questions from:', url, 'Language:', language);
    
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
      throw new Error(`Failed to fetch mock test questions: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Received data:', data);
    
    if (!data.questions || data.questions.length === 0) {
      console.warn('⚠️ No questions returned from API');
      return [];
    }
    
    console.log(`✅ Loaded ${data.questions.length} mock test questions for language: ${language}`);
    
    return data.questions;
  } catch (error) {
    console.error('❌ Error in getMockTestQuestions:', error);
    throw error;
  }
}
