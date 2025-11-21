import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { AdventureCard } from './AdventureCard';
import {
  Trophy,
  BookOpen,
  Video,
  MessageSquare,
  Puzzle,
  Award,
  TrendingUp,
  Calendar,
  Sparkles,
  Target,
  Flame,
  Star,
} from 'lucide-react';
import { motion } from 'motion/react';

export function NewDashboardPage() {
  const {
    currentProfile,
    quizAttempts,
    videoSubmissions,
    sloganSubmissions,
    imageParts,
    getTotalScore,
    collectImagePart,
  } = useApp();
  const t = useTranslation();

  if (!currentProfile) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-12">
        <Card className="p-12 text-center glass-card">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center animate-float">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl gradient-text mb-4">No Profile Selected</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please create or select a profile to view your dashboard
          </p>
        </Card>
      </div>
    );
  }

  const profileQuizzes = quizAttempts.filter(q => q.profileId === currentProfile.id);
  const profileVideos = videoSubmissions.filter(v => v.profileId === currentProfile.id);
  const profileSlogans = sloganSubmissions.filter(s => s.profileId === currentProfile.id);
  const collectedParts = imageParts.filter(p => p.collected).length;
  const totalScore = getTotalScore();

  const handleCollectPart = () => {
    const success = collectImagePart();
    if (success) {
      toast.success('🎉 You collected a new puzzle piece! +10 credits');
    } else {
      toast.error('You have already collected today\'s piece. Come back tomorrow!');
    }
  };

  const quizScore = profileQuizzes.reduce((sum, q) => sum + q.score, 0);
  const eventScore = totalScore - quizScore - (collectedParts * 10);
  const completionRate = Math.round((collectedParts / 45) * 100);

  // Stats for the overview
  const stats = [
    {
      label: t('totalScore'),
      value: totalScore,
      icon: Trophy,
      gradient: 'from-[#D97706] to-[#F59E0B]',
      description: 'Total Points',
    },
    {
      label: t('quizzesAttempted'),
      value: profileQuizzes.length,
      icon: BookOpen,
      gradient: 'from-[#1E3A8A] to-[#3B82F6]',
      description: 'Quizzes Completed',
    },
    {
      label: t('eventsParticipated'),
      value: profileVideos.length + profileSlogans.length,
      icon: Calendar,
      gradient: 'from-[#FBBF24] to-[#FCD34D]',
      description: 'Events Joined',
    },
    {
      label: 'Puzzle Progress',
      value: `${completionRate}%`,
      icon: Puzzle,
      gradient: 'from-[#F59E0B] to-[#FBBF24]',
      description: `${collectedParts}/45 Pieces`,
    },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#D97706] via-[#F59E0B] to-[#FBBF24] dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#60A5FA] text-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-float">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl">
                  Namaste, {currentProfile.name}! 🙏
                </h1>
                <p className="text-white/80 mt-1">Welcome back to your spiritual journey</p>
              </div>
            </div>
            
            {/* Quick Stats Bar */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                <Flame className="w-5 h-5" />
                <span>Day {Math.min(collectedParts + 1, 45)} of 45</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                <Target className="w-5 h-5" />
                <span>{profileQuizzes.length} Quizzes Done</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                <Star className="w-5 h-5" />
                <span>{totalScore} Total Points</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] -mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 card-3d glass-card border-0 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
                    <p className="text-3xl gradient-text">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Puzzle - Takes 2 columns */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 md:p-8 glass-card border-0 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl gradient-text flex items-center gap-3 mb-2">
                    <Puzzle className="w-7 h-7" />
                    {t('imagePuzzle')}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Collect a piece every day for 45 days
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {collectedParts}/45
                  </Badge>
                </div>
              </div>

              <Progress 
                value={(collectedParts / 45) * 100} 
                className="h-3 mb-6"
              />

              {/* Puzzle Grid */}
              <div className="grid grid-cols-9 gap-1 mb-6 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                {imageParts.map((part) => (
                  <motion.div
                    key={part.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: part.id * 0.01 }}
                    className={`aspect-square rounded-sm transition-all ${
                      part.collected
                        ? 'bg-gradient-to-br from-[#D97706] to-[#F59E0B] shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    title={part.collected ? `Collected on ${new Date(part.collectedDate!).toLocaleDateString()}` : 'Not collected'}
                  />
                ))}
              </div>

              {collectedParts === 45 ? (
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white">
                  <Trophy className="w-16 h-16 mx-auto mb-4 animate-float" />
                  <h3 className="text-2xl mb-2">{t('puzzleComplete')}</h3>
                  <p>Congratulations! You've completed the entire puzzle!</p>
                </div>
              ) : (
                <Button
                  onClick={handleCollectPart}
                  className="w-full h-12 text-lg rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white shadow-lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {t('collectToday')}
                </Button>
              )}
            </Card>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-6 glass-card border-0 shadow-lg">
              <h2 className="text-xl md:text-2xl gradient-text mb-6">Score Breakdown</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#1E3A8A]/10 to-[#3B82F6]/10 dark:from-[#1E3A8A]/20 dark:to-[#3B82F6]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quiz Score</p>
                      <p className="text-2xl gradient-text">{quizScore}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-[#D97706]/10 to-[#F59E0B]/10 dark:from-[#D97706]/20 dark:to-[#F59E0B]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Event Score</p>
                      <p className="text-2xl gradient-text">{eventScore}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-[#FBBF24]/10 to-[#FCD34D]/10 dark:from-[#FBBF24]/20 dark:to-[#FCD34D]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FBBF24] to-[#FCD34D] flex items-center justify-center">
                      <Puzzle className="w-5 h-5 text-gray-800" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Puzzle Score</p>
                      <p className="text-2xl gradient-text">
                        {collectedParts * 10 + (collectedParts === 45 ? 100 : 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Rank Placeholder */}
                <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <Award className="w-10 h-10 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Rank</p>
                      <p className="text-xl text-gray-500">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6 md:p-8 glass-card border-0 shadow-lg">
            <h2 className="text-2xl md:text-3xl gradient-text mb-6">Recent Activity</h2>
            
            <div className="space-y-3">
              {profileQuizzes.length === 0 && profileVideos.length === 0 && profileSlogans.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No activity yet. Start your journey by taking a quiz!
                  </p>
                </div>
              )}

              {profileQuizzes.slice(0, 3).map((quiz) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#1E3A8A]/5 to-transparent dark:from-[#1E3A8A]/10 hover:from-[#1E3A8A]/10 dark:hover:from-[#1E3A8A]/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-gray-900 dark:text-gray-100">{quiz.type.toUpperCase()} Completed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Score: {quiz.score} | Correct: {quiz.correctAnswers}/{quiz.totalQuestions}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(quiz.completedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}

              {profileVideos.slice(0, 2).map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#D97706]/5 to-transparent dark:from-[#D97706]/10 hover:from-[#D97706]/10 dark:hover:from-[#D97706]/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-gray-900 dark:text-gray-100">Video Submitted</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status: {video.status}</p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(video.submittedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}

              {profileSlogans.slice(0, 2).map((slogan) => (
                <motion.div
                  key={slogan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#FBBF24]/5 to-transparent dark:from-[#FBBF24]/10 hover:from-[#FBBF24]/10 dark:hover:from-[#FBBF24]/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FBBF24] to-[#FCD34D] flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-gray-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-gray-900 dark:text-gray-100">Slogan Submitted</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status: {slogan.status}</p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(slogan.submittedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}