import { useState, useEffect } from 'react';
import { BookOpen, Video, Pencil, Image, Trophy, Lightbulb, Puzzle, Clock, Award, Film } from 'lucide-react';
import { RoundHeader } from './RoundHeader';
import { TaskCard } from './TaskCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';

interface Task {
  icon: string | any;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  credits: number;
  onClick?: () => void;
}

interface RoundPageProps {
  roundNumber: number;
  title: string;
  week: number;
  tasks: Task[];
}

export function RoundPage({ roundNumber, title, week, tasks }: RoundPageProps) {
  const completedTasks = 0; // This would come from state/API

  return (
    <div className="space-y-6">
      <RoundHeader
        roundNumber={roundNumber}
        title={title}
        week={week}
        progress={completedTasks}
        totalTasks={tasks.length}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    </div>
  );
}

// Quiz questions for Round 1
const DAILY_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the Bhagavad Gita?",
    options: [
      "A conversation between Krishna and Arjuna",
      "A book of hymns",
      "A collection of laws",
      "A storybook"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Where did the conversation of Bhagavad Gita take place?",
    options: [
      "In a forest",
      "On the battlefield of Kurukshetra",
      "In a temple",
      "On a mountain"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Who is the main speaker in the Bhagavad Gita?",
    options: [
      "Arjuna",
      "Vyasa",
      "Krishna",
      "Sanjaya"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "How many chapters are there in the Bhagavad Gita?",
    options: [
      "16",
      "18",
      "20",
      "24"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What was Arjuna's main concern at the beginning?",
    options: [
      "He was afraid of losing",
      "He didn't want to fight his relatives",
      "He wanted to go home",
      "He was hungry"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "What does Krishna teach in the Gita?",
    options: [
      "How to win battles",
      "Path to self-realization and duty",
      "How to become rich",
      "How to be famous"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "What is 'Dharma' according to the Gita?",
    options: [
      "Religion only",
      "One's duty and righteousness",
      "A place of worship",
      "A ritual"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "What is 'Karma' in the Bhagavad Gita?",
    options: [
      "Luck",
      "Action and its consequences",
      "Meditation",
      "Prayer"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "Who narrated the Bhagavad Gita to King Dhritarashtra?",
    options: [
      "Krishna",
      "Arjuna",
      "Sanjaya",
      "Vyasa"
    ],
    correctAnswer: 2
  },
  {
    id: 10,
    question: "What is the main message of the Bhagavad Gita?",
    options: [
      "Never give up",
      "Do your duty without attachment to results",
      "Always fight",
      "Seek wealth"
    ],
    correctAnswer: 1
  }
];

// Round 1: Introduction
export function Round1Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Timer effect
  useEffect(() => {
    if (quizStarted && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, showResults]);

  const handleStartQuiz = () => {
    setShowQuizDialog(false);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setTimeLeft(600);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < DAILY_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === DAILY_QUIZ_QUESTIONS[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz Results View
  if (showResults) {
    const score = calculateScore();
    const percentage = (score / DAILY_QUIZ_QUESTIONS.length) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <Award className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed! 🎉</h2>
            <p className="text-gray-600">Here are your results</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}/{DAILY_QUIZ_QUESTIONS.length}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{percentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{score * 10}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {DAILY_QUIZ_QUESTIONS.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Question {idx + 1}</span>
                {selectedAnswers[idx] === q.correctAnswer ? (
                  <span className="text-green-600 font-semibold">✓ Correct</span>
                ) : (
                  <span className="text-red-600 font-semibold">✗ Wrong</span>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={() => {
              setQuizStarted(false);
              setShowResults(false);
              setCurrentQuestion(0);
              setSelectedAnswers([]);
              toast.success('Great job! Keep learning!');
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Back to Round 1
          </Button>
        </Card>
      </div>
    );
  }

  // Quiz View
  if (quizStarted) {
    const question = DAILY_QUIZ_QUESTIONS[currentQuestion];

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quiz Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Daily Quiz - Round 1</h2>
              <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {DAILY_QUIZ_QUESTIONS.length}</p>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / DAILY_QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </Card>

        {/* Question Card */}
        <Card className="p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>

            <div className="text-sm text-gray-600">
              {selectedAnswers.filter(a => a !== undefined).length} / {DAILY_QUIZ_QUESTIONS.length} answered
            </div>

            {currentQuestion === DAILY_QUIZ_QUESTIONS.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={selectedAnswers.length !== DAILY_QUIZ_QUESTIONS.length}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Tasks View (Default)
  const tasks = [
    {
      icon: '📖',
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Easy' as const,
      credits: 100,
      onClick: () => onNavigate?.('daily-quiz'),
    },
    {
      icon: '🧩',
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('puzzle-task'),
    },
    {
      icon: '✏️',
      title: 'Create a Slogan',
      description: 'Create an inspiring slogan based on Bhagavad Geeta',
      difficulty: 'Medium' as const,
      credits: 75,
      onClick: () => onNavigate?.('slogan-task'),
    },
    {
      icon: '🎥',
      title: 'Create a Reel',
      description: 'Create a short video reel sharing your understanding',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('reel-task'),
    },
    {
      icon: '🎬',
      title: 'Create Shloka Video',
      description: 'Record yourself reciting a Bhagavad Geeta shloka',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('shloka-task'),
      locked: true,
      lockedMessage: 'Coming Soon! This feature will be available in the next round.',
    },
    {
      icon: '📝',
      title: 'Mock Test',
      description: 'Take a comprehensive mock test to evaluate your knowledge',
      difficulty: 'Hard' as const,
      credits: 150,
      onClick: () => onNavigate?.('mock-test'),
    },
  ];

  return (
    <>
      <RoundPage roundNumber={1} title="Introduction" week={1} tasks={tasks} />

      {/* Quiz Confirmation Dialog */}
      <AlertDialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Daily Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to start the daily quiz with 10 questions. You will have 10 minutes to complete it.
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>10 Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>10 Minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>100 Credits on completion</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStartQuiz}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Start Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Round 2: Interpretation
export function Round2Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Essay Writing',
      description: 'Write an essay on your favorite verse',
      difficulty: 'Hard' as const,
      credits: 150,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={2} title="Interpretation" week={2} tasks={tasks} />;
}

// Round 3: Characters
export function Round3Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Lightbulb,
      title: 'Creative Task',
      description: 'Express your creativity with a Geeta-inspired project',
      difficulty: 'Medium' as const,
      credits: 125,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={3} title="Characters" week={3} tasks={tasks} />;
}

// Round 4: Application
export function Round4Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Video,
      title: 'Video Submission',
      description: 'Share your understanding through a video',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={4} title="Application" week={4} tasks={tasks} />;
}

// Round 5: Creative & Analytical
export function Round5Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Slogan Creation',
      description: 'Create a meaningful slogan inspired by the Geeta',
      difficulty: 'Medium' as const,
      credits: 75,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={5} title="Creative & Analytical" week={5} tasks={tasks} />;
}

// Round 6: Competition Mode
export function Round6Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Hard' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Essay Writing',
      description: 'Write a reflective essay on Geeta teachings',
      difficulty: 'Hard' as const,
      credits: 150,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={6} title="Competition Mode" week={6} tasks={tasks} />;
}

// Round 7: Final Challenge
export function Round7Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Hard' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Lightbulb,
      title: 'Final Creative Project',
      description: 'Complete your final creative project showcasing your journey',
      difficulty: 'Hard' as const,
      credits: 200,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={7} title="Final Challenge" week={7} tasks={tasks} />;
}