// Mock Test Page - Practice Quiz Module
// Similar to Daily Quiz but for practice with language support

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
import { getMockTestQuestions } from '../../services/mockTestService';
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
  Target,
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

export function MockTestPage() {
  const { currentProfile, submitQuiz } = useApp();
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
        e.returnValue = 'You have a mock test in progress. Are you sure you want to leave?';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [quizStarted]);

  const startQuiz = async () => {
    if (!currentProfile) {
      toast.error('Please create a profile first');
      return;
    }

    setIsLoading(true);
    try {
      const loadingToast = toast.loading('Loading mock test questions...');

      // Fetch mock test questions from backend with current language
      const quizQuestions = await getMockTestQuestions(language);
      
      if (!quizQuestions || quizQuestions.length === 0) {
        toast.error('No questions available for mock test');
        return;
      }

      setQuestions(quizQuestions);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeRemaining(quizQuestions.length * 60); // 1 minute per question
      setQuizStarted(true);
      setShowResults(false);
      
      toast.dismiss(loadingToast);
      toast.success(`Mock test loaded with ${quizQuestions.length} questions!`);
    } catch (error) {
      console.error('Error loading mock test:', error);
      toast.error('Failed to load mock test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload questions when language changes during quiz
  useEffect(() => {
    if (quizStarted) {
      const reloadQuestions = async () => {
        try {
          const quizQuestions = await getMockTestQuestions(language);
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

  const handleSubmitQuiz = async () => {
    setShowSubmitDialog(false);
    
    // Calculate score
    let correctCount = 0;
    const questionResults = questions.map((q) => {
      const userAnswer = parseInt(answers[q.id] || '-1');
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const score = (correctCount / questions.length) * 100;
    const timeTaken = (questions.length * 60) - timeRemaining;

    const resultsData = {
      score,
      correctCount,
      totalQuestions: questions.length,
      timeTaken,
      questionResults,
    };

    setResults(resultsData);
    setShowResults(true);
    setQuizStarted(false);

    // Note: Mock test doesn't award credits or save to profile
    toast.success(`Mock test completed! Score: ${score.toFixed(1)}%`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restartTest = () => {
    setShowResults(false);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
  };

  // Results View
  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 p-4">
        <Card className="p-6 md:p-8">
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#193C77] mb-2">Mock Test Completed!</h2>
            <p className="text-gray-600">Here are your results</p>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{results.score.toFixed(1)}%</div>
              <div className="text-xs md:text-sm text-gray-600">Score</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{results.correctCount}</div>
              <div className="text-xs md:text-sm text-gray-600">Correct</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-600">{results.totalQuestions - results.correctCount}</div>
              <div className="text-xs md:text-sm text-gray-600">Wrong</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">{formatTime(results.timeTaken)}</div>
              <div className="text-xs md:text-sm text-gray-600">Time Taken</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#193C77] mb-4">Question Review</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.questionResults.map((result: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    result.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-700">Q{index + 1}:</span>
                      <span className="text-sm text-gray-600 ml-2">{result.question.substring(0, 60)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={restartTest}
              className="flex-1 bg-[#D55328] hover:bg-[#C14820]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Test
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Quiz View
  if (quizStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = (answeredCount / questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-4 p-4">
        {/* Header Card */}
        <Card className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#193C77]">Mock Test - Practice</h2>
              <p className="text-sm md:text-base text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Answered: {answeredCount}/{questions.length}
              </p>
            </div>
            <div className="text-center">
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
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-sm md:text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </Card>

        {/* Navigation */}
        <Card className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-gray-600">
              {answeredCount} / {questions.length} answered
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                className="w-full sm:w-auto bg-[#D55328] hover:bg-[#C14820]"
              >
                Submit Test
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full sm:w-auto bg-[#193C77] hover:bg-[#142B5A]"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Mock Test?</AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answeredCount} out of {questions.length} questions.
                {answeredCount < questions.length && (
                  <div className="mt-2 text-yellow-600 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>You have {questions.length - answeredCount} unanswered question(s).</span>
                  </div>
                )}
                <p className="mt-2">Are you sure you want to submit?</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Review Answers</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmitQuiz}
                className="bg-[#D55328] hover:bg-[#C14820]"
              >
                Submit Test
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Start Screen
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#193C77] mb-2">Mock Test - Practice</h2>
          <p className="text-gray-600">Test your knowledge with practice questions</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900">Comprehensive Questions</p>
              <p className="text-sm text-blue-700">Practice with a variety of questions</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-purple-900">Timed Test</p>
              <p className="text-sm text-purple-700">1 minute per question</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <Languages className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Multi-language Support</p>
              <p className="text-sm text-green-700">Available in 11 languages</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-900">Practice Mode</p>
              <p className="text-sm text-yellow-700">No credits awarded - for practice only</p>
            </div>
          </div>
        </div>

        <Button
          onClick={startQuiz}
          disabled={isLoading || !currentProfile}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-6"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Mock Test
            </>
          )}
        </Button>

        {!currentProfile && (
          <p className="text-center text-sm text-red-600 mt-4">
            Please create a profile to start the mock test
          </p>
        )}
      </Card>
    </div>
  );
}
