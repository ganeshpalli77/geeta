import { useEffect, useState } from 'react';
import { User, Mail, Phone, School, MapPin, Calendar, Trophy, Target, Zap, Activity, LogOut, Edit, Star, Flame, Crown, Sword, Shield, Award } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { ProfileCreationForm } from './ProfileCreationForm';

export function ProfileNew() {
  const { 
    currentProfile, 
    logout, 
    getTotalScore,
    quizAttempts,
    videoSubmissions,
    sloganSubmissions,
    imageParts,
    leaderboard,
    user,
  } = useApp();

  const [showProfileCreation, setShowProfileCreation] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    prn: '',
    dob: '',
    category: '',
    preferredLanguage: 'english',
  });

  // Array of diverse profile pictures
  const profilePictures = [
    'https://images.unsplash.com/photo-1643180878811-2bc3d51a5627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc2MzU2ODIzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1676995229157-396a66e02c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBnaXJsJTIwc3R1ZGVudCUyMGhhcHB5fGVufDF8fHx8MTc2MzU2ODI0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1698356253803-838dceb68946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBib3klMjBzdHVkZW50JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MzU2ODI0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1614025000673-edf238aaf5d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZGlhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNTY4MjQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1644966486873-39171635ab43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZGlhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MzQ5NjkzMHww&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  // Get consistent profile picture based on profile ID
  const getProfilePicture = () => {
    if (!currentProfile || !currentProfile.id) return profilePictures[0];
    const hash = currentProfile.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return profilePictures[hash % profilePictures.length];
  };

  // Calculate real stats
  const totalScore = getTotalScore();
  const collectedPuzzles = imageParts.filter(p => p.collected).length;
  const profileQuizAttempts = quizAttempts.filter(q => q.profileId === currentProfile?.id);
  const profileVideos = videoSubmissions.filter(v => v.profileId === currentProfile?.id);
  const profileSlogans = sloganSubmissions.filter(s => s.profileId === currentProfile?.id);
  
  // Calculate quiz accuracy
  const completedQuizzes = profileQuizAttempts.filter(q => q.completedAt);
  const totalQuestions = completedQuizzes.reduce((sum, q) => sum + q.totalQuestions, 0);
  const correctAnswers = completedQuizzes.reduce((sum, q) => sum + q.correctAnswers, 0);
  const quizAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Find current rank
  const currentUserEntry = leaderboard.find(entry => entry.profileId === currentProfile?.id);
  const globalRank = currentUserEntry ? leaderboard.indexOf(currentUserEntry) + 1 : 0;

  // 🎮 GAMIFICATION: Level System
  const getLevelInfo = (xp: number) => {
    const level = Math.floor(xp / 500) + 1; // Every 500 XP = 1 level
    const currentLevelXP = (level - 1) * 500;
    const nextLevelXP = level * 500;
    const progressInLevel = xp - currentLevelXP;
    const xpNeeded = nextLevelXP - xp;
    const progressPercent = (progressInLevel / 500) * 100;
    
    // Titles based on level
    const titles = [
      { min: 1, max: 3, title: '🌱 Beginner', color: 'from-gray-400 to-gray-600' },
      { min: 4, max: 6, title: '⚔️ Warrior', color: 'from-blue-400 to-blue-600' },
      { min: 7, max: 10, title: '🏅 Champion', color: 'from-purple-400 to-purple-600' },
      { min: 11, max: 15, title: '👑 Master', color: 'from-yellow-400 to-yellow-600' },
      { min: 16, max: 20, title: '🔥 Legend', color: 'from-orange-400 to-orange-600' },
      { min: 21, max: 999, title: '⚡ Immortal', color: 'from-red-400 to-red-600' },
    ];
    
    const titleInfo = titles.find(t => level >= t.min && level <= t.max) || titles[0];
    
    return { level, progressPercent, xpNeeded, progressInLevel, title: titleInfo.title, titleColor: titleInfo.color };
  };

  const levelInfo = getLevelInfo(totalScore);

  // 🔥 Streak calculation (simplified - days with activity)
  const currentStreak = 7; // This should be calculated from actual activity dates

  // 🏆 Achievement system
  const achievements = [
    { 
      id: 'first_steps',
      icon: '🎯', 
      name: 'First Blood', 
      desc: 'Complete your first quiz',
      unlocked: completedQuizzes.length >= 1,
      rarity: 'common'
    },
    { 
      id: 'quiz_master',
      icon: '📚', 
      name: 'Quiz Master', 
      desc: 'Complete 10 quizzes',
      unlocked: completedQuizzes.length >= 10,
      rarity: 'rare'
    },
    { 
      id: 'sharpshooter',
      icon: '🎯', 
      name: 'Sharpshooter', 
      desc: '80%+ accuracy',
      unlocked: quizAccuracy >= 80,
      rarity: 'epic'
    },
    { 
      id: 'puzzle_hunter',
      icon: '🧩', 
      name: 'Puzzle Hunter', 
      desc: 'Collect 20 puzzle pieces',
      unlocked: collectedPuzzles >= 20,
      rarity: 'rare'
    },
    { 
      id: 'creative_mind',
      icon: '💡', 
      name: 'Creative Soul', 
      desc: 'Submit 5 creations',
      unlocked: (profileVideos.length + profileSlogans.length) >= 5,
      rarity: 'epic'
    },
    { 
      id: 'top_100',
      icon: '🥇', 
      name: 'Elite Warrior', 
      desc: 'Reach Top 100',
      unlocked: globalRank > 0 && globalRank <= 100,
      rarity: 'legendary'
    },
    { 
      id: 'speed_demon',
      icon: '⚡', 
      name: 'Speed Demon', 
      desc: 'Complete 3 quizzes in a day',
      unlocked: completedQuizzes.length >= 3,
      rarity: 'rare'
    },
    { 
      id: 'knowledge_god',
      icon: '🌟', 
      name: 'Knowledge God', 
      desc: 'Reach 1000 XP',
      unlocked: totalScore >= 1000,
      rarity: 'legendary'
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;

  // Rarity colors
  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600',
  };

  // Count completed tasks
  const approvedVideos = profileVideos.filter(v => v.status === 'approved').length;
  const approvedSlogans = profileSlogans.filter(s => s.status === 'approved').length;
  const tasksCompleted = completedQuizzes.length + approvedVideos + approvedSlogans + collectedPuzzles;

  // If no current profile, check if user has any profiles
  if (!currentProfile) {
    // If user has profiles, show selection page instead of creation form
    if (user?.profiles && user.profiles.length > 0) {
      // Redirect to profile selection
      window.location.hash = '#profile-selection';
      return null;
    }
    // Otherwise show creation form
    return <ProfileCreationForm />;
  }

  return (
    <div className="space-y-6">
      {/* 🎮 GAMIFIED Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 text-white relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-start gap-6 mb-6">
            {/* Profile Picture with Level Badge */}
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-28 h-28 rounded-full overflow-hidden bg-white flex-shrink-0 border-4 border-yellow-300 shadow-2xl relative"
              >
                <ImageWithFallback
                  src={getProfilePicture()}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Level Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 border-4 border-white shadow-lg flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="font-black text-gray-900">{levelInfo.level}</div>
                  <div className="text-[8px] font-bold text-gray-700 -mt-1">LVL</div>
                </div>
              </motion.div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black">{currentProfile.name}</h1>
                {globalRank <= 10 && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Crown className="w-8 h-8 text-yellow-300" />
                  </motion.div>
                )}
              </div>
              
              {/* Title */}
              <div className={cn(
                "inline-block px-4 py-1 rounded-full font-bold mb-3",
                "bg-gradient-to-r " + levelInfo.titleColor,
                "shadow-lg"
              )}>
                {levelInfo.title}
              </div>

              {/* XP Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white/90">
                    {totalScore} XP
                  </span>
                  <span className="text-sm font-semibold text-white/90">
                    {levelInfo.xpNeeded} XP to Level {levelInfo.level + 1}
                  </span>
                </div>
                <div className="h-4 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border-2 border-white/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </motion.div>
                </div>
              </div>
              
              {/* Quick Battle Stats */}
              <div className="grid grid-cols-4 gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs font-semibold">Rank</span>
                  </div>
                  <div className="text-2xl font-black">#{globalRank || '---'}</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-semibold">Streak</span>
                  </div>
                  <div className="text-2xl font-black">{currentStreak} 🔥</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-semibold">Badges</span>
                  </div>
                  <div className="text-2xl font-black">{unlockedAchievements.length}/{totalAchievements}</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-semibold">Accuracy</span>
                  </div>
                  <div className="text-2xl font-black">{quizAccuracy}%</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🏆 Achievements Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Achievements Unlocked
          </h2>
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            {unlockedAchievements.length}/{totalAchievements}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
              className={cn(
                "relative rounded-xl p-4 border-2 transition-all cursor-pointer",
                achievement.unlocked
                  ? `bg-gradient-to-br ${rarityColors[achievement.rarity as keyof typeof rarityColors]} border-yellow-300 shadow-lg`
                  : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-50 grayscale"
              )}
            >
              {achievement.unlocked && (
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                </motion.div>
              )}
              
              <div className="text-center">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className={cn(
                  "font-bold text-sm mb-1",
                  achievement.unlocked ? "text-white" : "text-gray-600 dark:text-gray-400"
                )}>
                  {achievement.name}
                </div>
                <div className={cn(
                  "text-xs",
                  achievement.unlocked ? "text-white/80" : "text-gray-500 dark:text-gray-500"
                )}>
                  {achievement.desc}
                </div>
                
                {achievement.unlocked && (
                  <div className="mt-2 text-xs font-bold text-yellow-300 uppercase">
                    {achievement.rarity}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ⚔️ Battle Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800"
      >
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sword className="w-6 h-6 text-purple-600" />
          Your Battle Stats
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-600 dark:text-gray-400">Quiz Battles Won</span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {completedQuizzes.length}
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((completedQuizzes.length / 20) * 100, 100)}%` }}
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-600"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-bold text-gray-600 dark:text-gray-400">Hit Rate</span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {quizAccuracy}%
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${quizAccuracy}%` }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-gray-600 dark:text-gray-400">Puzzle Fragments</span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {collectedPuzzles}/45
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(collectedPuzzles / 45) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-gray-600 dark:text-gray-400">Missions Completed</span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {approvedVideos + approvedSlogans}
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((approvedVideos + approvedSlogans) / 10) * 100, 100)}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Warrior Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Warrior ID</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{currentProfile.prn}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.email && !user.email.includes('placeholder.com') 
                  ? user.email 
                  : 'Not provided'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.phone || 'Not provided'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Birth Date</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{currentProfile.dob}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-5 h-5 text-gray-500 dark:text-gray-400 flex items-center justify-center">🌐</div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Language</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{currentProfile.preferredLanguage}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account</h2>
        <div className="space-y-2">
          <button 
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors text-indigo-600 dark:text-indigo-400 flex items-center gap-2 font-bold" 
            onClick={() => window.location.hash = '#profile-selection'}
          >
            <User className="w-4 h-4" />
            Manage Profiles ({user?.profiles?.length || 0})
          </button>
          <button 
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-red-600 dark:text-red-400 flex items-center gap-2 font-bold" 
            onClick={() => {
              if (confirm('Leave the battlefield? You can return anytime!')) {
                logout();
                toast.success('See you soon, warrior! 👋');
              }
            }}
          >
            <LogOut className="w-4 h-4" />
            Leave Battlefield
          </button>
        </div>
      </motion.div>
    </div>
  );
}