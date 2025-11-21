// Daily Quiz Page - Round 1 Daily Quiz Module
// Uses MongoDB questions with language support

import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { QuizQuestion } from '../../contexts/AppContext';
import { getDailyQuizQuestions } from '../../services/dailyQuizService';
import { API_BASE_URL } from '../../utils/config';
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
  Languages,
  RefreshCw,
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

export function DailyQuizPage() {
  const { currentProfile, submitQuiz, user } = useApp();
  const t = useTranslation();
  const { language, setLanguage } = useLanguage();

  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [nextAttemptTime, setNextAttemptTime] = useState<string | null>(null);

  // Timer effect
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

  // Prevent closing window during quiz
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

  // Check if user already attempted today's quiz - Reset state when profile changes
  useEffect(() => {
    // Reset all state when profile changes
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(0);
    setShowResults(false);
    setResults(null);
    setShowSubmitDialog(false);
    setAlreadyAttempted(false);
    setNextAttemptTime(null);

    const checkDailyAttempt = async () => {
      if (!currentProfile) return;

      try {
        const response = await fetch(`${API_BASE_URL}/quiz/check-daily-attempt/${currentProfile.id}`);
        const data = await response.json();

        if (data.attempted) {
          setAlreadyAttempted(true);
          setNextAttemptTime(data.nextAttemptAt);
          toast.info('You have already completed today\'s daily quiz!');
        }
      } catch (error) {
        console.error('Error checking daily attempt:', error);
      }
    };

    checkDailyAttempt();
  }, [currentProfile?.id]); // Use currentProfile.id to trigger on profile change

  const startQuiz = async () => {
    if (!currentProfile) {
      toast.error('Please create a profile first');
      return;
    }

    if (alreadyAttempted) {
      toast.error('You have already attempted today\'s quiz. Come back tomorrow!');
      return;
    }

    setIsLoading(true);
    try {
      const loadingToast = toast.loading('Loading today\'s daily quiz questions...');

      // Fetch daily quiz questions from backend with current language
      const quizQuestions = await getDailyQuizQuestions(language);
      
      if (!quizQuestions || quizQuestions.length === 0) {
        toast.error('No questions available for today\'s quiz');
        return;
      }

      setQuestions(quizQuestions);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeRemaining(quizQuestions.length * 60); // 1 minute per question
      setQuizStarted(true);
      setShowResults(false);
      
      toast.dismiss(loadingToast);
      toast.success(`Daily quiz loaded with ${quizQuestions.length} questions!`);
    } catch (error) {
      console.error('Error loading daily quiz:', error);
      toast.error('Failed to load daily quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload questions when language changes during quiz
  useEffect(() => {
    if (quizStarted) {
      const reloadQuestions = async () => {
        try {
          const quizQuestions = await getDailyQuizQuestions(language);
          if (quizQuestions && quizQuestions.length > 0) {
            setQuestions(quizQuestions);
            toast.success('Questions updated to ' + language);
          }
        } catch (error) {
          console.error('Error reloading questions:', error);
        }
      };
      reloadQuestions();
    }
  }, [language]);

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

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (parseInt(answers[q.id]) === q.correctAnswer) {
        correctCount++;
      }
    });
    return {
      score: Math.round((correctCount / questions.length) * 100),
      correctAnswers: correctCount,
    };
  };

  const handleSubmitQuiz = async () => {
    if (!currentProfile || !user) return;

    const { score, correctAnswers } = calculateScore();
    const timeSpent = (questions.length * 60) - timeRemaining;

    try {
      await submitQuiz({
        profileId: currentProfile.id,
        userId: user.id,
        type: 'daily' as any,
        questions,
        answers,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpent,
        language,
      });

      // Mark as attempted
      setAlreadyAttempted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
      return;
    }

    setResults({
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
    });

    setShowResults(true);
    setQuizStarted(false);
    setShowSubmitDialog(false);
    toast.success('Daily quiz submitted successfully!');
  };

  const handleRequestSubmit = () => {
    setShowSubmitDialog(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentProfile) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
        <Card className="p-6 md:p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl md:text-2xl text-[#822A12] mb-2">No Profile Selected</h2>
          <p className="text-sm md:text-base text-[#193C77]">Please create or select a profile to start the daily quiz</p>
        </Card>
      </div>
    );
  }

  // Results View
  if (showResults && results) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
        <Card className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-[#E8C56E]" />
            <h2 className="text-2xl md:text-3xl text-[#822A12] mb-2">Daily Quiz Complete!</h2>
            <p className="text-sm md:text-base text-[#193C77]">
              Great job completing today's daily quiz!
            </p>
          </div>

          <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            <div className="p-4 md:p-6 bg-[#FFF8ED] rounded-2xl">
              <div className="text-center">
                <div className="text-xs md:text-sm text-gray-600 mb-2">Your Score</div>
                <div className="text-4xl md:text-5xl text-[#D55328] mb-2">
                  {results.score}%
                </div>
                <Progress value={results.score} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="p-3 md:p-4 bg-[#FFF8ED] rounded-xl text-center">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-green-600" />
                <div className="text-lg md:text-2xl text-[#822A12] mb-1">{results.correctAnswers}</div>
                <div className="text-xs md:text-sm text-gray-600">Correct</div>
              </div>

              <div className="p-3 md:p-4 bg-[#FFF8ED] rounded-xl text-center">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-[#193C77]" />
                <div className="text-lg md:text-2xl text-[#822A12] mb-1">{results.totalQuestions}</div>
                <div className="text-xs md:text-sm text-gray-600">Total</div>
              </div>

              <div className="p-3 md:p-4 bg-[#FFF8ED] rounded-xl text-center">
                <Clock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-[#D55328]" />
                <div className="text-lg md:text-2xl text-[#822A12] mb-1">{formatTime(results.timeSpent)}</div>
                <div className="text-xs md:text-sm text-gray-600">Time</div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setShowResults(false);
              setQuestions([]);
            }}
            className="w-full rounded-[25px]"
            style={{ backgroundColor: '#D55328' }}
          >
            Back to Quiz
          </Button>
        </Card>
      </div>
    );
  }

  // Quiz In Progress
  if (quizStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
        {/* Quiz Header */}
        <Card className="p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0">
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl text-[#822A12]">
                Daily Quiz - Q{currentQuestionIndex + 1}/{questions.length}
              </h2>
              <p className="text-xs md:text-sm text-gray-600">Answered: {answeredCount}/{questions.length}</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="flex items-center gap-2 text-[#D55328] mb-1">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xl md:text-2xl">{formatTime(timeRemaining)}</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600">Time Remaining</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="mt-3 md:mt-4" />
        </Card>

        {/* Language Selector */}
        <Card className="p-3 mb-4 bg-[#FFF8ED]">
          <div className="flex items-center justify-center gap-3 text-sm text-[#193C77]">
            <Languages className="w-4 h-4" />
            <span>Current Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-3 py-1 border border-[#193C77] rounded-md bg-white text-[#193C77] font-semibold cursor-pointer hover:bg-[#FFF8ED] transition-colors"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी (Hindi)</option>
              <option value="marathi">मराठी (Marathi)</option>
              <option value="tamil">தமிழ் (Tamil)</option>
              <option value="telugu">తెలుగు (Telugu)</option>
              <option value="kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="malayalam">മലയാളം (Malayalam)</option>
              <option value="gujarati">ગુજરાતી (Gujarati)</option>
              <option value="bengali">বাংলা (Bengali)</option>
              <option value="odia">ଓଡ଼ିଆ (Odia)</option>
              <option value="nepali">नेपाली (Nepali)</option>
            </select>
          </div>
        </Card>

        {/* Question Card */}
        <Card className="p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
          <div className="mb-6 md:mb-8">
            <div className="text-xs md:text-sm text-[#193C77] mb-2">
              Difficulty: <span className="capitalize px-2 py-1 bg-[#FFF8ED] rounded text-xs md:text-sm">{currentQuestion.difficulty}</span>
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl text-[#822A12] mb-2">
              {currentQuestion.question}
            </h3>
          </div>

          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value: string) => handleAnswerChange(currentQuestion.id, value)}
          >
            <div className="space-y-3 md:space-y-4">
              {currentQuestion.options.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 md:space-x-3 p-3 md:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    answers[currentQuestion.id] === index.toString()
                      ? 'border-[#D55328] bg-[#FFF8ED]'
                      : 'border-gray-200 hover:border-[#E8C56E]'
                  }`}
                  onClick={() => handleAnswerChange(currentQuestion.id, index.toString())}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm md:text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="rounded-[25px] text-sm md:text-base"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Previous
          </Button>

          <div className="flex gap-2 md:gap-4">
            <Button
              onClick={handleRequestSubmit}
              variant="outline"
              className="rounded-[25px] text-sm md:text-base border-[#D55328] text-[#D55328] hover:bg-[#D55328] hover:text-white"
            >
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Submit
            </Button>
            
            {currentQuestionIndex < questions.length - 1 && (
              <Button
                onClick={handleNext}
                className="rounded-[25px] text-sm md:text-base"
                style={{ backgroundColor: '#193C77' }}
              >
                Next
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#D55328]" />
                Submit Daily Quiz?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answeredCount} out of {questions.length} questions. 
                {answeredCount < questions.length && (
                  <span className="block mt-2 text-[#D55328]">
                    You still have {questions.length - answeredCount} unanswered question(s).
                  </span>
                )}
                <span className="block mt-2">
                  Are you sure you want to submit? This action cannot be undone.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmitQuiz}
                className="bg-[#D55328] hover:bg-[#C44820]"
              >
                Yes, Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Quiz Selection View
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
      <div className="mb-6 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#822A12] mb-2">Round 1 - Daily Quiz</h1>
        <p className="text-sm md:text-base text-[#193C77]">Test your knowledge with today's daily quiz challenge</p>
      </div>

      <Card className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E8C56E] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#193C77]" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl text-[#822A12]">Today's Daily Quiz</h3>
            <p className="text-xs md:text-sm text-gray-600">Fresh questions every day</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-[#FFF8ED] rounded-xl">
          <h4 className="text-sm font-semibold text-[#193C77] mb-3">Quiz Features:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Same questions for all users each day</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Mix of easy, medium, and hard questions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Available in English and Hindi</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Questions from Bhagavad Gita database</span>
            </li>
          </ul>
        </div>

        {alreadyAttempted ? (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
              <p className="text-green-800 font-semibold mb-1">Quiz Completed!</p>
              <p className="text-sm text-green-700">You've already completed today's daily quiz.</p>
              <p className="text-xs text-green-600 mt-2">Come back tomorrow for new questions!</p>
            </div>
            <Button
              disabled
              className="w-full rounded-[25px] opacity-60"
              style={{ backgroundColor: '#D55328' }}
            >
              <Clock className="w-4 h-4 mr-2" />
              Next Quiz Available Tomorrow
            </Button>
          </div>
        ) : (
          <Button
            onClick={startQuiz}
            disabled={isLoading}
            className="w-full rounded-[25px]"
            style={{ backgroundColor: '#D55328' }}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Loading Quiz...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Today's Quiz
              </>
            )}
          </Button>
        )}
      </Card>
    </div>
  );
}
