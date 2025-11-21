import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { calculateScore } from '../../utils/quizData';
import { QuizQuestion } from '../../contexts/AppContext';
import { getQuizQuestions } from '../../services/quizServiceAPI';
import { AdventureCard } from './AdventureCard';
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
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

export function QuizPage() {
  const { currentProfile, getAvailableQuizzes, submitQuiz, setQuizInProgress, devMode, toggleDevMode } = useApp();
  const t = useTranslation();

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

  const startQuiz = async (type: 'mock' | 'quiz1' | 'quiz2' | 'quiz3') => {
    if (!currentProfile) {
      toast.error('Please create a profile first');
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Loading quiz questions from database...');

      // Fetch questions from database based on quiz type
      const quizQuestions = await getQuizQuestions(type);
      
      // Set duration based on quiz type
      let duration: number;
      switch (type) {
        case 'mock':
          duration = 30 * 60; // 30 minutes
          break;
        case 'quiz1':
          duration = 30 * 60; // 30 minutes
          break;
        case 'quiz2':
          duration = 40 * 60; // 40 minutes
          break;
        case 'quiz3':
          duration = 50 * 60; // 50 minutes
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
      
      toast.dismiss(loadingToast);
      toast.success(`Quiz loaded with ${quizQuestions.length} questions!`);
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error('Failed to load quiz questions. Please try again.');
    }
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

  if (!currentProfile) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
        <Card className="p-6 md:p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl md:text-2xl text-[#822A12] mb-2">No Profile Selected</h2>
          <p className="text-sm md:text-base text-[#193C77]">Please create or select a profile to start a quiz</p>
        </Card>
      </div>
    );
  }

  // Results View
  if (showResults && results) {
    if (showDetailedReview) {
      // Detailed Review View
      return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
          <Card className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl text-[#822A12]">Detailed Answer Review</h2>
              <Button
                onClick={() => setShowDetailedReview(false)}
                variant="outline"
                className="rounded-[25px]"
              >
                Back to Results
              </Button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {questions.map((question, index) => {
                const userAnswer = parseInt(answers[question.id]);
                const isCorrect = userAnswer === question.correctAnswer;
                const wasAnswered = answers[question.id] !== undefined;

                return (
                  <Card key={question.id} className={`p-4 md:p-6 border-2 ${
                    !wasAnswered ? 'border-gray-300 bg-gray-50' :
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-sm md:text-base font-semibold text-[#193C77] min-w-[30px]">Q{index + 1}.</span>
                      <div className="flex-1">
                        <p className="text-sm md:text-base text-[#822A12] mb-3">
                          {t.language === 'hi' ? question.questionHi : question.question}
                        </p>

                        <div className="space-y-2 mb-3">
                          {(t.language === 'hi' ? question.optionsHi : question.options).map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer = question.correctAnswer === optIndex;

                            return (
                              <div
                                key={optIndex}
                                className={`p-2 md:p-3 rounded-lg text-xs md:text-sm ${
                                  isCorrectAnswer ? 'bg-green-200 border-2 border-green-600' :
                                  isUserAnswer && !isCorrect ? 'bg-red-200 border-2 border-red-600' :
                                  'bg-white border border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{option}</span>
                                  {isCorrectAnswer && (
                                    <CheckCircle className="w-4 h-4 text-green-700 flex-shrink-0 ml-2" />
                                  )}
                                  {isUserAnswer && !isCorrect && (
                                    <XCircle className="w-4 h-4 text-red-700 flex-shrink-0 ml-2" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                          <span className={`px-2 py-1 rounded ${
                            !wasAnswered ? 'bg-gray-300 text-gray-700' :
                            isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {!wasAnswered ? 'Not Answered' : isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                          <span className="text-gray-600">
                            Difficulty: <span className="capitalize">{question.difficulty}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => setShowDetailedReview(false)}
                variant="outline"
                className="flex-1 rounded-[25px]"
              >
                Back to Results
              </Button>
              <Button
                onClick={() => {
                  setShowResults(false);
                  setShowDetailedReview(false);
                  setSelectedQuiz(null);
                }}
                className="flex-1 rounded-[25px]"
                style={{ backgroundColor: '#D55328' }}
              >
                Back to Quizzes
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    // Summary Results View
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
        <Card className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-[#E8C56E]" />
            <h2 className="text-2xl md:text-3xl text-[#822A12] mb-2">{t('quizResults')}</h2>
            <p className="text-sm md:text-base text-[#193C77]">
              {selectedQuiz === 'mock' ? 'Great practice! Practice quiz scores don\'t count toward your total.' : 'Great job completing the quiz!'}
            </p>
          </div>

          <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            <div className="p-4 md:p-6 bg-[#FFF8ED] rounded-2xl">
              <div className="text-center">
                <div className="text-xs md:text-sm text-gray-600 mb-2">{t('yourScore')}</div>
                <div className="text-4xl md:text-5xl text-[#D55328] mb-2">
                  {results.score}
                  {selectedQuiz === 'mock' && (
                    <span className="text-sm md:text-base text-gray-500 ml-2">(Practice)</span>
                  )}
                </div>
                <Progress value={(results.score / (results.totalQuestions * 3)) * 100} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="p-3 md:p-4 bg-[#FFF8ED] rounded-xl text-center">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-green-600" />
                <div className="text-lg md:text-2xl text-[#822A12] mb-1">{results.correctAnswers}</div>
                <div className="text-xs md:text-sm text-gray-600">{t('correctAnswers')}</div>
              </div>

              <div className="p-3 md:p-4 bg-[#FFF8ED] rounded-xl text-center">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-[#193C77]" />
                <div className="text-lg md:text-2xl text-[#822A12] mb-1">{results.totalQuestions}</div>
                <div className="text-xs md:text-sm text-gray-600">Total Questions</div>
              </div>

              <div className="p-3 md:p-4 bg-[#FFF8ED] rounded-xl text-center">
                <Clock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-[#D55328]" />
                <div className="text-lg md:text-2xl text-[#822A12] mb-1">{formatTime(results.timeSpent)}</div>
                <div className="text-xs md:text-sm text-gray-600">{t('timeTaken')}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowDetailedReview(true)}
              variant="outline"
              className="w-full rounded-[25px] border-[#193C77] text-[#193C77] hover:bg-[#193C77] hover:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Detailed Answer Review
            </Button>

            <Button
              onClick={() => {
                setShowResults(false);
                setSelectedQuiz(null);
              }}
              className="w-full rounded-[25px]"
              style={{ backgroundColor: '#D55328' }}
            >
              {t('back')} to Quizzes
            </Button>
          </div>
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
                {selectedQuiz?.toUpperCase()} - Q{currentQuestionIndex + 1}/{questions.length}
              </h2>
              <p className="text-xs md:text-sm text-gray-600">Answered: {answeredCount}/{questions.length}</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="flex items-center gap-2 text-[#D55328] mb-1">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xl md:text-2xl">{formatTime(timeRemaining)}</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600">{t('timeRemaining')}</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="mt-3 md:mt-4" />
        </Card>

        {/* Question Card */}
        <Card className="p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
          <div className="mb-6 md:mb-8">
            <div className="text-xs md:text-sm text-[#193C77] mb-2">
              Difficulty: <span className="capitalize px-2 py-1 bg-[#FFF8ED] rounded text-xs md:text-sm">{currentQuestion.difficulty}</span>
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl text-[#822A12] mb-2">
              {t.language === 'hi' ? currentQuestion.questionHi : currentQuestion.question}
            </h3>
          </div>

          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            <div className="space-y-3 md:space-y-4">
              {(t.language === 'hi' ? currentQuestion.optionsHi : currentQuestion.options).map((option, index) => (
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
            <span className="hidden sm:inline">{t('previous')}</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          <div className="flex gap-2 md:gap-4">
            {/* Early submit button - always visible */}
            <Button
              onClick={handleRequestSubmit}
              variant="outline"
              className="rounded-[25px] text-sm md:text-base border-[#D55328] text-[#D55328] hover:bg-[#D55328] hover:text-white"
            >
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Submit Quiz</span>
              <span className="sm:hidden">Submit</span>
            </Button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={true}
                className="rounded-[25px] text-sm md:text-base opacity-50"
                style={{ backgroundColor: '#193C77' }}
              >
                {t('next')}
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="rounded-[25px] text-sm md:text-base"
                style={{ backgroundColor: '#193C77' }}
              >
                {t('next')}
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
                Submit Quiz?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answeredCount} out of {questions.length} questions. 
                {answeredCount < questions.length && (
                  <span className="block mt-2 text-[#D55328]">
                    You still have {questions.length - answeredCount} unanswered question(s).
                  </span>
                )}
                <span className="block mt-2">
                  Are you sure you want to submit your quiz? This action cannot be undone.
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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#822A12]">{t('quiz')}</h1>
          {/* Dev Mode Toggle */}
          <Button
            onClick={toggleDevMode}
            variant="outline"
            size="sm"
            className={`rounded-[25px] text-xs md:text-sm ${
              devMode ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300'
            }`}
          >
            {devMode ? '✓ Dev Mode' : 'Dev Mode'}
          </Button>
        </div>
        <p className="text-sm md:text-base text-[#193C77]">Test your knowledge of the Bhagavad Geeta</p>
        {devMode && (
          <p className="text-xs md:text-sm text-green-600 mt-2">
            🔓 Dev Mode Active - All quizzes unlocked for testing
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Mock Quiz */}
        <Card className="p-4 md:p-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E8C56E] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#193C77]" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl text-[#822A12]">{t('mockQuiz')}</h3>
              <p className="text-xs md:text-sm text-gray-600">Practice Quiz - 30 Questions</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-[#193C77] mb-2">
            Test your knowledge with 30 questions covering all difficulty levels. Time: 30 minutes
          </p>
          <p className="text-xs text-orange-600 mb-4 italic">
            ⚠️ Practice only - Score doesn't count toward total
          </p>
          <div className="space-y-2 mb-4 text-xs md:text-sm">
            <div className="flex justify-between">
              <span>Easy Questions:</span>
              <span>10</span>
            </div>
            <div className="flex justify-between">
              <span>Medium Questions:</span>
              <span>15</span>
            </div>
            <div className="flex justify-between">
              <span>Hard Questions:</span>
              <span>5</span>
            </div>
          </div>
          <Button
            onClick={() => startQuiz('mock')}
            disabled={!availableQuizzes.mock.available}
            className="w-full rounded-[25px]"
            style={{ backgroundColor: availableQuizzes.mock.available ? '#D55328' : '#ccc' }}
          >
            {availableQuizzes.mock.available ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                {t('startQuiz')}
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('attempted')}
              </>
            )}
          </Button>
        </Card>

        {/* Quiz 1 */}
        <Card className={`p-4 md:p-6 relative ${!availableQuizzes.quiz1.available ? 'opacity-75' : ''}`}>
          {!availableQuizzes.quiz1.available && availableQuizzes.quiz1.reason && (
            <div className="absolute top-4 right-4">
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Locked
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#193C77] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl text-[#822A12]">{t('quiz1')}</h3>
              <p className="text-xs md:text-sm text-gray-600">Main Quiz - 30 Questions</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-[#193C77] mb-4">
            Official Quiz 1 with 30 questions. Time: 30 minutes
          </p>
          <div className="space-y-2 mb-4 text-xs md:text-sm">
            <div className="flex justify-between">
              <span>Easy Questions:</span>
              <span>10</span>
            </div>
            <div className="flex justify-between">
              <span>Medium Questions:</span>
              <span>15</span>
            </div>
            <div className="flex justify-between">
              <span>Hard Questions:</span>
              <span>5</span>
            </div>
          </div>
          {!availableQuizzes.quiz1.available && availableQuizzes.quiz1.reason && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs md:text-sm text-yellow-800">
              🔒 {availableQuizzes.quiz1.reason}
            </div>
          )}
          <Button
            onClick={() => startQuiz('quiz1')}
            disabled={!availableQuizzes.quiz1.available}
            className="w-full rounded-[25px]"
            style={{ backgroundColor: availableQuizzes.quiz1.available ? '#193C77' : '#ccc' }}
          >
            {availableQuizzes.quiz1.available ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                {t('startQuiz')}
              </>
            ) : (
              <>
                {availableQuizzes.quiz1.reason?.includes('Already') ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                {availableQuizzes.quiz1.reason?.includes('Already') ? t('attempted') : 'Locked'}
              </>
            )}
          </Button>
        </Card>

        {/* Quiz 2 */}
        <Card className={`p-4 md:p-6 relative ${!availableQuizzes.quiz2.available ? 'opacity-75' : ''}`}>
          {!availableQuizzes.quiz2.available && availableQuizzes.quiz2.reason && (
            <div className="absolute top-4 right-4">
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                {availableQuizzes.quiz2.reason.includes('Dec') ? (
                  <Calendar className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {availableQuizzes.quiz2.reason.includes('Dec') ? 'Coming Soon' : 'Locked'}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D55328] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl text-[#822A12]">{t('quiz2')}</h3>
              <p className="text-xs md:text-sm text-gray-600">Main Quiz - 40 Questions</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-[#193C77] mb-4">
            Official Quiz 2 with 40 questions. Time: 40 minutes
          </p>
          <div className="space-y-2 mb-4 text-xs md:text-sm">
            <div className="flex justify-between">
              <span>Easy Questions:</span>
              <span>10</span>
            </div>
            <div className="flex justify-between">
              <span>Medium Questions:</span>
              <span>20</span>
            </div>
            <div className="flex justify-between">
              <span>Hard Questions:</span>
              <span>10</span>
            </div>
          </div>
          {!availableQuizzes.quiz2.available && availableQuizzes.quiz2.reason && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs md:text-sm text-yellow-800">
              {availableQuizzes.quiz2.reason.includes('Dec') ? '📅' : '🔒'} {availableQuizzes.quiz2.reason}
            </div>
          )}
          <Button
            onClick={() => startQuiz('quiz2')}
            disabled={!availableQuizzes.quiz2.available}
            className="w-full rounded-[25px]"
            style={{ backgroundColor: availableQuizzes.quiz2.available ? '#D55328' : '#ccc' }}
          >
            {availableQuizzes.quiz2.available ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                {t('startQuiz')}
              </>
            ) : (
              <>
                {availableQuizzes.quiz2.reason?.includes('Already') ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : availableQuizzes.quiz2.reason?.includes('Dec') ? (
                  <Calendar className="w-4 h-4 mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                {availableQuizzes.quiz2.reason?.includes('Already') ? t('attempted') : 
                 availableQuizzes.quiz2.reason?.includes('Dec') ? 'Coming Soon' : 'Locked'}
              </>
            )}
          </Button>
        </Card>

        {/* Quiz 3 */}
        <Card className={`p-4 md:p-6 relative ${!availableQuizzes.quiz3.available ? 'opacity-75' : ''}`}>
          {!availableQuizzes.quiz3.available && availableQuizzes.quiz3.reason && (
            <div className="absolute top-4 right-4">
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                {availableQuizzes.quiz3.reason.includes('Dec') ? (
                  <Calendar className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {availableQuizzes.quiz3.reason.includes('Dec') ? 'Coming Soon' : 'Locked'}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#822A12] flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl text-[#822A12]">{t('quiz3')}</h3>
              <p className="text-xs md:text-sm text-gray-600">Advanced Quiz - 50 Questions</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-[#193C77] mb-4">
            Official Quiz 3 with 50 questions. Time: 50 minutes
          </p>
          <div className="space-y-2 mb-4 text-xs md:text-sm">
            <div className="flex justify-between">
              <span>Easy Questions:</span>
              <span>15</span>
            </div>
            <div className="flex justify-between">
              <span>Medium Questions:</span>
              <span>20</span>
            </div>
            <div className="flex justify-between">
              <span>Hard Questions:</span>
              <span>15</span>
            </div>
          </div>
          {!availableQuizzes.quiz3.available && availableQuizzes.quiz3.reason && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs md:text-sm text-yellow-800">
              {availableQuizzes.quiz3.reason.includes('Dec') ? '📅' : '🔒'} {availableQuizzes.quiz3.reason}
            </div>
          )}
          <Button
            onClick={() => startQuiz('quiz3')}
            disabled={!availableQuizzes.quiz3.available}
            className="w-full rounded-[25px]"
            style={{ backgroundColor: availableQuizzes.quiz3.available ? '#822A12' : '#ccc' }}
          >
            {availableQuizzes.quiz3.available ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                {t('startQuiz')}
              </>
            ) : (
              <>
                {availableQuizzes.quiz3.reason?.includes('Already') ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : availableQuizzes.quiz3.reason?.includes('Dec') ? (
                  <Calendar className="w-4 h-4 mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                {availableQuizzes.quiz3.reason?.includes('Already') ? t('attempted') : 
                 availableQuizzes.quiz3.reason?.includes('Dec') ? 'Coming Soon' : 'Locked'}
              </>
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}