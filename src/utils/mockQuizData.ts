/**
 * Mock Quiz Data with Multi-language Support
 * Questions are stored per language
 */

import { SupportedLanguage } from '../locales';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  round: number;
  chapter?: number; // Bhagavad Geeta chapter
  verse?: number; // Verse number;
}

// English Questions
const englishQuestions: QuizQuestion[] = [
  {
    id: 'en_q1',
    question: 'Who is the speaker of the Bhagavad Geeta?',
    options: ['Arjuna', 'Krishna', 'Vyasa', 'Sanjaya'],
    correctAnswer: 1,
    difficulty: 'easy',
    round: 1,
    chapter: 1,
  },
  {
    id: 'en_q2',
    question: 'How many chapters are there in the Bhagavad Geeta?',
    options: ['16', '18', '20', '22'],
    correctAnswer: 1,
    difficulty: 'easy',
    round: 1,
  },
  {
    id: 'en_q3',
    question: 'What is the name of Arjuna\'s bow?',
    options: ['Gandiva', 'Pinaka', 'Vijaya', 'Sharanga'],
    correctAnswer: 0,
    difficulty: 'medium',
    round: 1,
    chapter: 1,
  },
  {
    id: 'en_q4',
    question: 'On which battlefield was the Bhagavad Geeta delivered?',
    options: ['Hastinapura', 'Kurukshetra', 'Indraprastha', 'Dwarka'],
    correctAnswer: 1,
    difficulty: 'easy',
    round: 1,
    chapter: 1,
  },
  {
    id: 'en_q5',
    question: 'What does "Geeta" mean?',
    options: ['Story', 'Song', 'Teaching', 'Battle'],
    correctAnswer: 1,
    difficulty: 'easy',
    round: 1,
  },
];

// Hindi Questions
const hindiQuestions: QuizQuestion[] = [
  {
    id: 'hi_q1',
    question: 'भगवद गीता के वक्ता कौन हैं?',
    options: ['अर्जुन', 'कृष्ण', 'व्यास', 'संजय'],
    correctAnswer: 1,
    difficulty: 'easy',
    round: 1,
    chapter: 1,
  },
  {
    id: 'hi_q2',
    question: 'भगवद गीता में कितने अध्याय हैं?',
    options: ['16', '18', '20', '22'],
    correctAnswer: 1,
    difficulty: 'easy',
    round: 1,
  },
  {
    id: 'hi_q3',
    question: 'अर्जुन के धनुष का नाम क्या है?',
    options: ['गांडीव', 'पिनाक', 'विजय', 'शारंग'],
    correctAnswer: 0,
    difficulty: 'medium',
    round: 1,
    chapter: 1,
  },
  {
    id: 'hi_q4',
    question: 'भगवद गीता किस युद्ध के मैदान में कही गई थी?',
    options: ['हस्तिनापुर', 'कुरुक्षेत्र', 'इंद्रप्रस्थ', 'द्वारका'],
    correctAnswer: 1,
    difficulty: 'easy',
    round: 1,
    chapter: 1,
  },
  {
    id: 'hi_q5',
    question: '"गीता" का अर्थ क्या है?',
    options: ['कहानी', 'गीत', 'शिक्षा', 'युद्ध'],
    correctAnswer: 1,
    difficulty: 'easy',
    round: 1,
  },
];

// Question database by language
const questionsByLanguage: Record<SupportedLanguage, QuizQuestion[]> = {
  english: englishQuestions,
  hindi: hindiQuestions,
  // Other languages fallback to English for now
  marathi: englishQuestions,
  telugu: englishQuestions,
  kannada: englishQuestions,
  tamil: englishQuestions,
  malayalam: englishQuestions,
  gujarati: englishQuestions,
  bengali: englishQuestions,
  odia: englishQuestions,
  nepali: englishQuestions,
  assamese: englishQuestions,
  sindhi: englishQuestions,
  manipuri: englishQuestions,
};

/**
 * Get quiz questions for a specific language
 */
export function getQuizQuestions(
  language: SupportedLanguage,
  options?: {
    round?: number;
    difficulty?: QuizQuestion['difficulty'];
    count?: number;
  }
): QuizQuestion[] {
  let questions = questionsByLanguage[language] || questionsByLanguage.english;

  // Filter by round
  if (options?.round) {
    questions = questions.filter(q => q.round === options.round);
  }

  // Filter by difficulty
  if (options?.difficulty) {
    questions = questions.filter(q => q.difficulty === options.difficulty);
  }

  // Limit count
  if (options?.count) {
    // Shuffle and take count
    questions = shuffleArray([...questions]).slice(0, options.count);
  }

  return questions;
}

/**
 * Get a random set of quiz questions
 */
export function getRandomQuizQuestions(
  language: SupportedLanguage,
  count: number = 10
): QuizQuestion[] {
  const allQuestions = questionsByLanguage[language] || questionsByLanguage.english;
  return shuffleArray([...allQuestions]).slice(0, count);
}

/**
 * Shuffle array helper
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
 * Check if an answer is correct
 */
export function checkAnswer(question: QuizQuestion, answerIndex: number): boolean {
  return question.correctAnswer === answerIndex;
}

/**
 * Calculate quiz score
 */
export function calculateScore(
  questions: QuizQuestion[],
  answers: Record<string, number>
): {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
} {
  let correctAnswers = 0;
  
  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer !== undefined && checkAnswer(question, answer)) {
      correctAnswers++;
    }
  });

  const wrongAnswers = Object.keys(answers).length - correctAnswers;
  const accuracy = Object.keys(answers).length > 0 
    ? (correctAnswers / Object.keys(answers).length) * 100 
    : 0;

  // Score calculation: 10 points per correct answer
  const score = correctAnswers * 10;

  return {
    score,
    correctAnswers,
    wrongAnswers,
    accuracy,
  };
}