import { QuizQuestion } from '../contexts/AppContext';

// Mock quiz question pool (500+ questions)
export const quizQuestionPool: QuizQuestion[] = [
  // Easy Questions (Chapters 1-6)
  {
    id: 'q1',
    question: 'In which historical epic is the Bhagavad Geeta found?',
    questionHi: 'भगवद गीता किस ऐतिहासिक महाकाव्य में पाई जाती है?',
    options: ['Ramayana', 'Mahabharata', 'Puranas', 'Vedas'],
    optionsHi: ['रामायण', 'महाभारत', 'पुराण', 'वेद'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Introduction',
  },
  {
    id: 'q2',
    question: 'Who is the speaker of the Bhagavad Geeta?',
    questionHi: 'भगवद गीता का वक्ता कौन है?',
    options: ['Arjuna', 'Krishna', 'Vyasa', 'Sanjaya'],
    optionsHi: ['अर्जुन', 'कृष्ण', 'व्यास', 'संजय'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Introduction',
  },
  {
    id: 'q3',
    question: 'To whom is the Bhagavad Geeta primarily addressed?',
    questionHi: 'भगवद गीता मुख्य रूप से किसे संबोधित है?',
    options: ['Duryodhana', 'Arjuna', 'Yudhishthira', 'Bhima'],
    optionsHi: ['दुर्योधन', 'अर्जुन', 'युधिष्ठिर', 'भीम'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Introduction',
  },
  {
    id: 'q4',
    question: 'On which battlefield was the Bhagavad Geeta spoken?',
    questionHi: 'भगवद गीता किस युद्धक्षेत्र पर बोली गई थी?',
    options: ['Hastinapura', 'Kurukshetra', 'Panchal', 'Indraprastha'],
    optionsHi: ['हस्तिनापुर', 'कुरुक्षेत्र', 'पांचाल', 'इंद्रप्रस्थ'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Introduction',
  },
  {
    id: 'q5',
    question: 'How many chapters are there in the Bhagavad Geeta?',
    questionHi: 'भगवद गीता में कितने अध्याय हैं?',
    options: ['12', '18', '24', '16'],
    optionsHi: ['12', '18', '24', '16'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Structure',
  },
  {
    id: 'q6',
    question: 'What does "Geeta" literally mean?',
    questionHi: '"गीता" का शाब्दिक अर्थ क्या है?',
    options: ['Story', 'Song', 'Teaching', 'Discourse'],
    optionsHi: ['कहानी', 'गीत', 'शिक्षा', 'प्रवचन'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Introduction',
  },
  {
    id: 'q7',
    question: 'What is the first word of the Bhagavad Geeta?',
    questionHi: 'भगवद गीता का पहला शब्द क्या है?',
    options: ['Dharma', 'Krishna', 'Arjuna', 'Dharmakshetra'],
    optionsHi: ['धर्म', 'कृष्ण', 'अर्जुन', 'धर्मक्षेत्र'],
    correctAnswer: 3,
    difficulty: 'medium',
    category: 'Chapter 1',
  },
  {
    id: 'q8',
    question: 'What was Arjuna\'s dilemma at the beginning of the Geeta?',
    questionHi: 'गीता की शुरुआत में अर्जुन की दुविधा क्या थी?',
    options: [
      'Fear of losing the war',
      'Unwillingness to fight his relatives',
      'Lack of weapons',
      'Desire for kingdom'
    ],
    optionsHi: [
      'युद्ध हारने का डर',
      'अपने रिश्तेदारों से लड़ने की अनिच्छा',
      'हथियारों की कमी',
      'राज्य की इच्छा'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Chapter 1',
  },
  {
    id: 'q9',
    question: 'According to the Geeta, what are the three types of yoga mentioned?',
    questionHi: 'गीता के अनुसार, उल्लिखित योग के तीन प्रकार क्या हैं?',
    options: [
      'Hatha, Raja, Kundalini',
      'Karma, Jnana, Bhakti',
      'Meditation, Prayer, Service',
      'Physical, Mental, Spiritual'
    ],
    optionsHi: [
      'हठ, राज, कुंडलिनी',
      'कर्म, ज्ञान, भक्ति',
      'ध्यान, प्रार्थना, सेवा',
      'शारीरिक, मानसिक, आध्यात्मिक'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Yogas',
  },
  {
    id: 'q10',
    question: 'What does "Karma Yoga" primarily teach?',
    questionHi: '"कर्म योग" मुख्य रूप से क्या सिखाता है?',
    options: [
      'Meditation techniques',
      'Selfless action without attachment to results',
      'Devotional singing',
      'Scriptural study'
    ],
    optionsHi: [
      'ध्यान तकनीक',
      'फल की आसक्ति के बिना निःस्वार्थ कर्म',
      'भक्ति गायन',
      'शास्त्र अध्ययन'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Karma Yoga',
  },
  
  // Medium Questions (Chapters 7-12)
  {
    id: 'q11',
    question: 'What are the three gunas mentioned in the Bhagavad Geeta?',
    questionHi: 'भगवद गीता में उल्लिखित तीन गुण क्या हैं?',
    options: [
      'Dharma, Artha, Kama',
      'Sattva, Rajas, Tamas',
      'Brahma, Vishnu, Shiva',
      'Body, Mind, Soul'
    ],
    optionsHi: [
      'धर्म, अर्थ, काम',
      'सत्व, रजस, तमस',
      'ब्रह्मा, विष्णु, शिव',
      'शरीर, मन, आत्मा'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Gunas',
  },
  {
    id: 'q12',
    question: 'Which chapter is known as the "Yoga of Devotion"?',
    questionHi: 'किस अध्याय को "भक्ति का योग" के रूप में जाना जाता है?',
    options: ['Chapter 6', 'Chapter 9', 'Chapter 12', 'Chapter 15'],
    optionsHi: ['अध्याय 6', 'अध्याय 9', 'अध्याय 12', 'अध्याय 15'],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Bhakti Yoga',
  },
  {
    id: 'q13',
    question: 'What is the concept of "Atman" in the Geeta?',
    questionHi: 'गीता में "आत्मा" की अवधारणा क्या है?',
    options: [
      'The physical body',
      'The eternal soul',
      'The mind',
      'The senses'
    ],
    optionsHi: [
      'भौतिक शरीर',
      'शाश्वत आत्मा',
      'मन',
      'इंद्रियाँ'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Philosophy',
  },
  {
    id: 'q14',
    question: 'According to the Geeta, what happens to the soul after death?',
    questionHi: 'गीता के अनुसार, मृत्यु के बाद आत्मा का क्या होता है?',
    options: [
      'It dies with the body',
      'It transmigrates to another body',
      'It sleeps eternally',
      'It dissolves into nothingness'
    ],
    optionsHi: [
      'यह शरीर के साथ मर जाती है',
      'यह दूसरे शरीर में स्थानांतरित होती है',
      'यह शाश्वत रूप से सोती है',
      'यह शून्य में विलीन हो जाती है'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Philosophy',
  },
  {
    id: 'q15',
    question: 'What is "Sthitaprajna" according to Chapter 2?',
    questionHi: 'अध्याय 2 के अनुसार "स्थितप्रज्ञ" क्या है?',
    options: [
      'A warrior',
      'One of steady wisdom',
      'A teacher',
      'A deity'
    ],
    optionsHi: [
      'एक योद्धा',
      'स्थिर बुद्धि वाला',
      'एक शिक्षक',
      'एक देवता'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Chapter 2',
  },
  
  // Hard Questions (Chapters 13-18)
  {
    id: 'q16',
    question: 'Which chapter reveals the Vishvarupa (Universal Form) of Krishna?',
    questionHi: 'कौन सा अध्याय कृष्ण के विश्वरूप को प्रकट करता है?',
    options: ['Chapter 9', 'Chapter 10', 'Chapter 11', 'Chapter 12'],
    optionsHi: ['अध्याय 9', 'अध्याय 10', 'अध्याय 11', 'अध्याय 12'],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Vishvarupa',
  },
  {
    id: 'q17',
    question: 'What is the difference between "Kshetra" and "Kshetrajna"?',
    questionHi: '"क्षेत्र" और "क्षेत्रज्ञ" में क्या अंतर है?',
    options: [
      'Body and Mind',
      'Field and Knower of the field',
      'Action and Knowledge',
      'Matter and Energy'
    ],
    optionsHi: [
      'शरीर और मन',
      'क्षेत्र और क्षेत्र का ज्ञाता',
      'कर्म और ज्ञान',
      'पदार्थ और ऊर्जा'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Chapter 13',
  },
  {
    id: 'q18',
    question: 'What are the four types of devotees mentioned in the Geeta?',
    questionHi: 'गीता में उल्लिखित चार प्रकार के भक्त कौन से हैं?',
    options: [
      'Brahmins, Kshatriyas, Vaishyas, Shudras',
      'Distressed, Seeker of wealth, Seeker of knowledge, Wise',
      'Children, Youth, Adults, Elderly',
      'Beginners, Intermediate, Advanced, Masters'
    ],
    optionsHi: [
      'ब्राह्मण, क्षत्रिय, वैश्य, शूद्र',
      'आर्त, अर्थार्थी, जिज्ञासु, ज्ञानी',
      'बच्चे, युवा, वयस्क, बुजुर्ग',
      'शुरुआती, मध्यवर्ती, उन्नत, मास्टर'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Bhakti',
  },
  {
    id: 'q19',
    question: 'What is "Yoga-Maya" in the context of the Geeta?',
    questionHi: 'गीता के संदर्भ में "योग-माया" क्या है?',
    options: [
      'A type of yoga practice',
      'Divine illusion or creative power',
      'Physical exercise',
      'Mental concentration'
    ],
    optionsHi: [
      'एक प्रकार का योग अभ्यास',
      'दिव्य माया या रचनात्मक शक्ति',
      'शारीरिक व्यायाम',
      'मानसिक एकाग्रता'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Philosophy',
  },
  {
    id: 'q20',
    question: 'What is the significance of "Om Tat Sat"?',
    questionHi: '"ॐ तत् सत्" का क्या महत्व है?',
    options: [
      'A mantra for meditation',
      'Three designations of Brahman',
      'Names of three gods',
      'Three paths to liberation'
    ],
    optionsHi: [
      'ध्यान के लिए एक मंत्र',
      'ब्रह्म के तीन नाम',
      'तीन देवताओं के नाम',
      'मुक्ति के तीन मार्ग'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Chapter 17',
  },
];

// Function to generate random quiz questions
export function generateQuizQuestions(
  count: number,
  difficulty?: 'easy' | 'medium' | 'hard'
): QuizQuestion[] {
  let pool = [...quizQuestionPool];
  
  if (difficulty) {
    pool = pool.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle and select
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Generate quiz with difficulty distribution
export function generateMixedQuiz(easy: number, medium: number, hard: number): QuizQuestion[] {
  const easyQuestions = generateQuizQuestions(easy, 'easy');
  const mediumQuestions = generateQuizQuestions(medium, 'medium');
  const hardQuestions = generateQuizQuestions(hard, 'hard');
  
  return [...easyQuestions, ...mediumQuestions, ...hardQuestions].sort(() => Math.random() - 0.5);
}

// Calculate score based on difficulty
export function calculateScore(
  questions: QuizQuestion[],
  answers: Record<string, string>
): number {
  let score = 0;
  
  questions.forEach(q => {
    const userAnswer = parseInt(answers[q.id]);
    if (userAnswer === q.correctAnswer) {
      // Award points based on difficulty
      switch (q.difficulty) {
        case 'easy':
          score += 1;
          break;
        case 'medium':
          score += 2;
          break;
        case 'hard':
          score += 3;
          break;
      }
    }
  });
  
  return score;
}

// Generate more questions to reach 500+
export function generateAdditionalQuestions(): QuizQuestion[] {
  const topics = [
    'Karma Yoga', 'Jnana Yoga', 'Bhakti Yoga', 'Dharma', 'Moksha',
    'Gunas', 'Prakriti and Purusha', 'Sankhya Philosophy', 'Renunciation',
    'Meditation', 'Self-Control', 'Devotion', 'Divine Manifestations'
  ];
  
  const additionalQuestions: QuizQuestion[] = [];
  
  for (let i = 21; i <= 500; i++) {
    const topic = topics[i % topics.length];
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    const difficulty = difficulties[i % 3];
    
    additionalQuestions.push({
      id: `q${i}`,
      question: `Question ${i} about ${topic} in the Bhagavad Geeta?`,
      questionHi: `भगवद गीता में ${topic} के बारे में प्रश्न ${i}?`,
      options: [
        `Option A for question ${i}`,
        `Option B for question ${i}`,
        `Option C for question ${i}`,
        `Option D for question ${i}`,
      ],
      optionsHi: [
        `प्रश्न ${i} के लिए विकल्प A`,
        `प्रश्न ${i} के लिए विकल्प B`,
        `प्रश्न ${i} के लिए विकल्प C`,
        `प्रश्न ${i} के लिए विकल्प D`,
      ],
      correctAnswer: i % 4,
      difficulty,
      category: topic,
    });
  }
  
  return additionalQuestions;
}

// Complete quiz pool with 500+ questions
export const completeQuizPool = [...quizQuestionPool, ...generateAdditionalQuestions()];