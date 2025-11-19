import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { generateMixedQuiz, calculateScore } from '../../utils/quizData';
import { QuizQuestion } from '../../contexts/AppContext';
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Play,
  AlertTriangle,
  Lock,
  Calendar,
  Eye,
  Target,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { motion, AnimatePresence } from 'motion/react';

export function NewQuizPage() {
  const { currentProfile, language, getAvailableQuizzes, submitQuiz, setQuizInProgress, devMode, quizAttempts } = useApp();
  const t = useTranslation(language);

  const [selectedQuiz, setSelectedQuiz] = useState<'mock' | 'quiz1' | 'quiz2' | 'quiz3' | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  const availableQuizzes = getAvailableQuizzes();

  // Prevent closing/refreshing window when quiz is in progress
  useEffect(() => {
    if (quizStarted) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'You have a quiz in progress. Are you sure you want to leave?';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [quizStarted]);

  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining]);

  const startQuiz = (type: 'mock' | 'quiz1' | 'quiz2' | 'quiz3') => {
    if (!currentProfile) {
      toast.error('Please create a profile first');
      return;
    }

    // Generate questions based on quiz type
    let quizQuestions: QuizQuestion[];
    let duration: number;

    switch (type) {
      case 'mock':
        quizQuestions = generateMixedQuiz(10, 15, 5); // 30 questions
        duration = 30 * 60; // 30 minutes
        break;
      case 'quiz1':
        quizQuestions = generateMixedQuiz(10, 15, 5); // 30 questions
        duration = 30 * 60;
        break;
      case 'quiz2':
        quizQuestions = generateMixedQuiz(10, 20, 10); // 40 questions
        duration = 40 * 60;
        break;
      case 'quiz3':
        quizQuestions = generateMixedQuiz(15, 20, 15); // 50 questions
        duration = 50 * 60;
        break;
    }

    setSelectedQuiz(type);
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(duration);
    setQuizStarted(true);
    setShowResults(false);
    setQuizInProgress(true); // Lock navigation
  };

  const handleAnswerChange = (questionId: string, answerIndex: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!currentProfile || !selectedQuiz) return;

    const score = calculateScore(questions, answers);
    const correctAnswers = questions.filter(
      (q) => parseInt(answers[q.id]) === q.correctAnswer
    ).length;
    const timeSpent = (
      selectedQuiz === 'mock' ? 30 * 60 :
      selectedQuiz === 'quiz1' ? 30 * 60 :
      selectedQuiz === 'quiz2' ? 40 * 60 :
      50 * 60
    ) - timeRemaining;

    submitQuiz({
      profileId: currentProfile.id,
      type: selectedQuiz,
      questions,
      answers,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
    });

    setResults({
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
    });

    setShowResults(true);
    setQuizStarted(false);
    setQuizInProgress(false); // Unlock navigation
    setShowSubmitDialog(false);
    toast.success('Quiz submitted successfully!');
  };

  const handleRequestSubmit = () => {
    setShowSubmitDialog(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  // Get profile-specific quiz attempts
  const profileQuizAttempts = currentProfile 
    ? quizAttempts.filter(q => q.profileId === currentProfile.id)
    : [];

  const quizTypes = [
    {
      id: 'mock',
      name: 'Mock Test',
      description: '30 Questions • 30 Minutes',
      icon: Target,
      gradient: 'from-[#10B981] to-[#059669]',
      difficulty: 'Practice',
      questions: 30,
      duration: 30,
      isAvailable: availableQuizzes.mock?.available || false,
      isCompleted: profileQuizAttempts.some(q => q.type === 'mock'),
    },
    {
      id: 'quiz1',
      name: 'Quiz 1',
      description: '30 Questions • 30 Minutes',
      icon: BookOpen,
      gradient: 'from-[#3B82F6] to-[#2563EB]',
      difficulty: 'Easy',
      questions: 30,
      duration: 30,
      isAvailable: availableQuizzes.quiz1?.available || false,
      isCompleted: profileQuizAttempts.some(q => q.type === 'quiz1'),
    },
    {
      id: 'quiz2',
      name: 'Quiz 2',
      description: '40 Questions • 40 Minutes',
      icon: BookOpen,
      gradient: 'from-[#F59E0B] to-[#D97706]',
      difficulty: 'Medium',
      questions: 40,
      duration: 40,
      isAvailable: availableQuizzes.quiz2?.available || false,
      isCompleted: profileQuizAttempts.some(q => q.type === 'quiz2'),
    },
    {
      id: 'quiz3',
      name: 'Quiz 3',
      description: '50 Questions • 50 Minutes',
      icon: BookOpen,
      gradient: 'from-[#EF4444] to-[#DC2626]',
      difficulty: 'Hard',
      questions: 50,
      duration: 50,
      isAvailable: availableQuizzes.quiz3?.available || false,
      isCompleted: profileQuizAttempts.some(q => q.type === 'quiz3'),
    },
  ];

  if (!currentProfile) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-12">
        <Card className="p-12 text-center glass-card border-0 shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center animate-float">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl gradient-text mb-4">No Profile Selected</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please create or select a profile to start a quiz
          </p>
        </Card>
      </div>
    );
  }

  // Quiz Selection View
  if (!quizStarted && !showResults) {
    return (
      <div className="min-h-screen pb-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#1E3A8A] via-[#3B82F6] to-[#60A5FA] text-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-float">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl">
                  Test Your Knowledge 📚
                </h1>
              </div>
              <p className="text-white/80 text-lg">
                Choose a quiz to test your understanding of the Bhagavad Gita
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] -mt-8">
          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizTypes.map((quiz, index) => {
              const Icon = quiz.icon;
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`p-6 md:p-8 card-3d glass-card border-0 shadow-lg relative overflow-hidden ${
                    !quiz.isAvailable ? 'opacity-60' : ''
                  }`}>
                    {/* Background Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${quiz.gradient} opacity-5`} />
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${quiz.gradient} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl gradient-text">{quiz.name}</h3>
                              <Badge variant="secondary" className="mt-1">
                                {quiz.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {quiz.isCompleted && (
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                          <Target className="w-5 h-5" />
                          <span>{quiz.questions} Questions</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                          <Clock className="w-5 h-5" />
                          <span>{quiz.duration} Minutes</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {quiz.isAvailable ? (
                        <Button
                          onClick={() => startQuiz(quiz.id as any)}
                          className={`w-full h-12 text-lg rounded-xl bg-gradient-to-r ${quiz.gradient} hover:opacity-90 text-white shadow-lg`}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Start Quiz
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="w-full h-12 text-lg rounded-xl"
                          variant="secondary"
                        >
                          <Lock className="w-5 h-5 mr-2" />
                          Locked
                        </Button>
                      )}

                      {quiz.isCompleted && (
                        <p className="text-sm text-center mt-3 text-green-600 dark:text-green-400">
                          ✓ Already completed
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Previous Attempts */}
          {profileQuizAttempts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Card className="p-6 md:p-8 glass-card border-0 shadow-lg">
                <h2 className="text-2xl gradient-text mb-6">Previous Attempts</h2>
                <div className="space-y-3">
                  {profileQuizAttempts.slice(0, 5).map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/50 hover:from-gray-100 dark:hover:from-gray-800 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base text-gray-900 dark:text-gray-100">
                          {attempt.type.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Score: {attempt.score} | Correct: {attempt.correctAnswers}/{attempt.totalQuestions}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Quiz In Progress View
  if (quizStarted && currentQuestion) {
    return (
      <div className="min-h-screen pb-12">
        {/* Quiz Header - Sticky */}
        <div className="sticky top-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Progress */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {answeredCount} answered
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                timeRemaining < 300
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 md:p-8 glass-card border-0 shadow-lg mb-6">
                {/* Question */}
                <div className="mb-6">
                  <Badge variant="secondary" className="mb-4">
                    {currentQuestion.difficulty}
                  </Badge>
                  <h2 className="text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-2">
                    {language === 'hi' ? currentQuestion.questionHi : currentQuestion.question}
                  </h2>
                </div>

                {/* Options */}
                <RadioGroup
                  value={answers[currentQuestion.id]}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  <div className="space-y-3">
                    {(language === 'hi' ? currentQuestion.optionsHi : currentQuestion.options).map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          answers[currentQuestion.id] === String(index)
                            ? 'border-[#D97706] bg-[#D97706]/5 dark:bg-[#D97706]/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <RadioGroupItem value={String(index)} id={`option-${index}`} className="mt-1" />
                        <span className="flex-1 text-gray-900 dark:text-gray-100">{option}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="h-12 px-6"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleRequestSubmit}
                    className="h-12 px-6 bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white"
                  >
                    Submit Quiz
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="h-12 px-6 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1E40AF] text-white"
                  >
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answeredCount} out of {questions.length} questions.
                {answeredCount < questions.length && (
                  <span className="block mt-2 text-amber-600 dark:text-amber-400">
                    ⚠️ {questions.length - answeredCount} questions are unanswered.
                  </span>
                )}
                <span className="block mt-2">Are you sure you want to submit?</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitQuiz}>
                Yes, Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Results View
  if (showResults && results) {
    const percentage = (results.correctAnswers / results.totalQuestions) * 100;
    const isPassed = percentage >= 50;

    return (
      <div className="min-h-screen pb-12">
        {/* Results Hero */}
        <div className={`${
          isPassed 
            ? 'bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857]'
            : 'bg-gradient-to-br from-[#EF4444] via-[#DC2626] to-[#B91C1C]'
        } text-white`}>
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="w-12 h-12" />
              </div>
              <h1 className="text-4xl md:text-5xl mb-4">
                {isPassed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
              </h1>
              <p className="text-xl text-white/80 mb-8">
                You scored {results.score} points
              </p>
              
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">{results.correctAnswers}</div>
                  <div className="text-white/80">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">{results.totalQuestions - results.correctAnswers}</div>
                  <div className="text-white/80">Wrong</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">{percentage.toFixed(0)}%</div>
                  <div className="text-white/80">Accuracy</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] -mt-8">
          <Card className="p-8 glass-card border-0 shadow-lg text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => {
                  setShowResults(false);
                  setSelectedQuiz(null);
                }}
                className="h-12 px-8 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1E40AF] text-white"
              >
                Back to Quizzes
              </Button>
              <Button
                onClick={() => setShowDetailedReview(true)}
                variant="outline"
                className="h-12 px-8"
              >
                <Eye className="w-5 h-5 mr-2" />
                Review Answers
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Detailed Review (keeping original implementation)
  if (showDetailedReview) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-12">
        <Card className="p-6 md:p-8 glass-card border-0 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl gradient-text">Detailed Answer Review</h2>
            <Button
              onClick={() => setShowDetailedReview(false)}
              variant="outline"
              className="rounded-xl"
            >
              Back to Results
            </Button>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = parseInt(answers[question.id]);
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAnswered = answers[question.id] !== undefined;

              return (
                <Card key={question.id} className={`p-6 border-2 ${
                  !wasAnswered ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50' :
                  isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    <Badge variant="secondary">Q{index + 1}</Badge>
                    <p className="flex-1 text-lg">
                      {language === 'hi' ? question.questionHi : question.question}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {(language === 'hi' ? question.optionsHi : question.options).map((option, optIndex) => {
                      const isUserAnswer = userAnswer === optIndex;
                      const isCorrectAnswer = question.correctAnswer === optIndex;

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg ${
                            isCorrectAnswer ? 'bg-green-200 dark:bg-green-900/40 border-2 border-green-600' :
                            isUserAnswer && !isCorrect ? 'bg-red-200 dark:bg-red-900/40 border-2 border-red-600' :
                            'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {isCorrectAnswer && (
                              <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-400 flex-shrink-0 ml-2" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <XCircle className="w-5 h-5 text-red-700 dark:text-red-400 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!wasAnswered && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Not answered</p>
                  )}
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  return null;
}