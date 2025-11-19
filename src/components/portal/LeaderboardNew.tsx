import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Share2, RefreshCw, Swords, Crown, Flame, Zap, Star } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';

type LeaderboardTab = 'global' | 'school' | 'state' | 'weekly';

interface LeaderboardEntry {
  rank: number;
  profileId: string;
  name: string;
  avatar: string;
  avatarUrl?: string;
  category?: string;
  score: number;
  quizScore?: number;
  eventScore?: number;
  weeklyScore?: number;
  isCurrentUser?: boolean;
}

export function LeaderboardNew() {
  const { 
    leaderboard, 
    currentProfile, 
    refreshLeaderboard,
    user,
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Array of diverse profile pictures
  const profilePictures = [
    'https://images.unsplash.com/photo-1643180878811-2bc3d51a5627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
    'https://images.unsplash.com/photo-1676995229157-396a66e02c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
    'https://images.unsplash.com/photo-1698356253803-838dceb68946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
    'https://images.unsplash.com/photo-1614025000673-edf238aaf5d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
    'https://images.unsplash.com/photo-1644966486873-39171635ab43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
    'https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
    'https://images.unsplash.com/photo-1633994093783-211e4e2be787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
    'https://images.unsplash.com/photo-1731662262743-d4ed80b88672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
  ];

  // Get consistent profile picture based on profile ID
  const getProfilePicture = (profileId: string) => {
    const hash = profileId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return profilePictures[hash % profilePictures.length];
  };

  const tabs: { id: LeaderboardTab; label: string; icon: any }[] = [
    { id: 'global', label: 'Global Arena', icon: Trophy },
    { id: 'school', label: 'Guild Wars', icon: Swords },
    { id: 'state', label: 'Kingdom', icon: Crown },
    { id: 'weekly', label: 'This Week', icon: Flame },
  ];

  useEffect(() => {
    // Refresh leaderboard on mount
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshLeaderboard();
      toast.success('🔄 Battle rankings updated!');
    } catch (error) {
      toast.error('Failed to refresh rankings');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 via-yellow-500 to-orange-500';
    if (rank === 2) return 'from-gray-300 via-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-400 via-orange-500 to-orange-600';
    if (rank <= 10) return 'from-purple-400 to-purple-600';
    if (rank <= 100) return 'from-blue-400 to-blue-600';
    return 'from-gray-400 to-gray-500';
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Process leaderboard data based on active tab
  const getFilteredLeaderboard = (): LeaderboardEntry[] => {
    if (!leaderboard || leaderboard.length === 0) {
      return [];
    }

    let sortedLeaderboard = [...leaderboard];

    switch (activeTab) {
      case 'global':
        sortedLeaderboard.sort((a, b) => b.totalScore - a.totalScore);
        break;
      case 'school':
        const currentCategory = currentProfile?.category;
        if (currentCategory) {
          sortedLeaderboard = sortedLeaderboard.filter(entry => {
            const profile = user?.profiles?.find(p => p.id === entry.profileId);
            return profile?.category === currentCategory;
          });
        }
        sortedLeaderboard.sort((a, b) => b.totalScore - a.totalScore);
        break;
      case 'state':
        sortedLeaderboard.sort((a, b) => b.totalScore - a.totalScore);
        break;
      case 'weekly':
        sortedLeaderboard.sort((a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0));
        break;
    }

    return sortedLeaderboard.map((entry, index) => ({
      rank: index + 1,
      profileId: entry.profileId,
      name: entry.name,
      avatar: getInitial(entry.name),
      avatarUrl: getProfilePicture(entry.profileId),
      category: entry.category,
      score: activeTab === 'weekly' ? (entry.weeklyScore || 0) : entry.totalScore,
      quizScore: entry.quizScore,
      eventScore: entry.eventScore,
      weeklyScore: entry.weeklyScore,
      isCurrentUser: entry.profileId === currentProfile?.id,
    }));
  };

  const displayedLeaderboard = getFilteredLeaderboard();
  const currentUserEntry = displayedLeaderboard.find(e => e.isCurrentUser);

  const handleShare = () => {
    if (!currentUserEntry) {
      toast.error('Join the battle first! Complete some quests! ⚔️');
      return;
    }

    const rank = currentUserEntry.rank;
    let rankEmoji = '⚔️';
    if (rank === 1) rankEmoji = '👑';
    else if (rank <= 3) rankEmoji = '🏆';
    else if (rank <= 10) rankEmoji = '⭐';
    else if (rank <= 100) rankEmoji = '🔥';

    const shareText = `${rankEmoji} I'm ranked #${rank} on the Geeta Olympiad Battle Arena with ${currentUserEntry.score} XP! Think you can beat me? 💪`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Geeta Olympiad Battle Rankings',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Battle stats copied! Share with your rivals! 🎯');
    }
  };

  return (
    <div className="space-y-6">
      {/* 🏆 Gamified Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6 text-white relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Trophy className="w-10 h-10" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black">Battle Arena</h1>
                <p className="text-white/90 font-semibold">⚔️ Compete. Conquer. Dominate. 🏆</p>
              </div>
            </div>
            
            {currentUserEntry && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border-2 border-white/30"
              >
                <Swords className="w-5 h-5" />
                <div>
                  <div className="text-xs font-semibold opacity-90">YOUR BATTLE RANK</div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black">#{currentUserEntry.rank}</span>
                    <span className="text-sm font-bold">
                      {currentUserEntry.rank === 1 && '👑 CHAMPION'}
                      {currentUserEntry.rank === 2 && '🥈 RUNNER-UP'}
                      {currentUserEntry.rank === 3 && '🥉 FINALIST'}
                      {currentUserEntry.rank > 3 && currentUserEntry.rank <= 10 && '⭐ ELITE'}
                      {currentUserEntry.rank > 10 && currentUserEntry.rank <= 100 && '🔥 WARRIOR'}
                      {currentUserEntry.rank > 100 && '⚔️ FIGHTER'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Gamified Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold whitespace-nowrap border-2",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white border-orange-400 shadow-lg"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700"
              )}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* 🏆 Top 3 Podium */}
      {displayedLeaderboard.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-950/10 dark:via-orange-950/10 dark:to-red-950/10 border-2 border-yellow-300 dark:border-yellow-800"
        >
          {/* 2nd Place */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center pt-8"
          >
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-400 shadow-xl">
                <ImageWithFallback
                  src={displayedLeaderboard[1].avatarUrl || ''}
                  alt={displayedLeaderboard[1].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border-3 border-white shadow-lg flex items-center justify-center text-2xl">
                🥈
              </div>
            </div>
            <div className="font-black text-center text-gray-900 dark:text-white truncate w-full px-2">
              {displayedLeaderboard[1].name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">
              {displayedLeaderboard[1].score.toLocaleString()} XP
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center relative"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-6"
            >
              <Crown className="w-12 h-12 text-yellow-400 fill-yellow-400" />
            </motion.div>
            <div className="relative mb-3 mt-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl"
              >
                <ImageWithFallback
                  src={displayedLeaderboard[0].avatarUrl || ''}
                  alt={displayedLeaderboard[0].name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 border-3 border-white shadow-lg flex items-center justify-center text-3xl">
                🥇
              </div>
            </div>
            <div className="font-black text-center text-gray-900 dark:text-white truncate w-full px-2 text-lg">
              {displayedLeaderboard[0].name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">
              {displayedLeaderboard[0].score.toLocaleString()} XP
            </div>
            <div className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black">
              CHAMPION 👑
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center pt-12"
          >
            <div className="relative mb-3">
              <div className="w-18 h-18 rounded-full overflow-hidden border-4 border-orange-400 shadow-xl">
                <ImageWithFallback
                  src={displayedLeaderboard[2].avatarUrl || ''}
                  alt={displayedLeaderboard[2].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-3 border-white shadow-lg flex items-center justify-center text-2xl">
                🥉
              </div>
            </div>
            <div className="font-black text-center text-gray-900 dark:text-white truncate w-full px-2">
              {displayedLeaderboard[2].name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">
              {displayedLeaderboard[2].score.toLocaleString()} XP
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Battle Rankings List */}
      {displayedLeaderboard.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800"
        >
          <Trophy className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-2xl font-black text-gray-600 dark:text-gray-400 mb-2">
            No Warriors Yet! 
          </h3>
          <p className="text-gray-500 dark:text-gray-500 font-semibold">
            Be the first to conquer quests and claim your throne! ⚔️
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {displayedLeaderboard.slice(3).map((entry, index) => (
            <motion.div
              key={entry.profileId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={cn(
                "p-4 rounded-xl border-2 transition-all",
                entry.isCurrentUser
                  ? "bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-950/30 dark:to-pink-950/30 border-orange-400 dark:border-orange-600 shadow-lg"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className="w-14 flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center font-black text-white shadow-lg",
                      `bg-gradient-to-br ${getRankColor(entry.rank)}`
                    )}
                  >
                    <span className="text-xl">#{entry.rank}</span>
                  </motion.div>
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 rounded-full overflow-hidden border-3 border-orange-400 shadow-lg flex-shrink-0"
                  >
                    <ImageWithFallback
                      src={entry.avatarUrl || ''}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 dark:text-white truncate">
                        {entry.name}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-black">
                          YOU
                        </span>
                      )}
                      {entry.rank <= 10 && !entry.isCurrentUser && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    {entry.category && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate font-semibold">
                        {entry.category}
                      </div>
                    )}
                  </div>
                </div>

                {/* XP Score */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-black text-xl text-gray-900 dark:text-white">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                        XP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Share Battle Stats */}
      {currentUserEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="bg-gradient-to-r from-orange-500 via-pink-600 to-red-600 hover:from-orange-600 hover:via-pink-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 shadow-lg text-lg"
          >
            <Share2 className="w-5 h-5" />
            Challenge Your Rivals! ⚔️
          </motion.button>
        </motion.div>
      )}

      {/* Battle Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-300 dark:border-blue-800"
      >
        <div className="flex gap-3">
          <div className="text-4xl">⚔️</div>
          <div>
            <p className="font-black mb-2 text-gray-900 dark:text-white text-lg">Battle Arena Rules</p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-semibold">
              <li>🏆 <strong>Global Arena:</strong> Fight against all warriors worldwide!</li>
              <li>⚔️ <strong>Guild Wars:</strong> Battle within your school/guild</li>
              <li>👑 <strong>Kingdom:</strong> Compete in your regional kingdom</li>
              <li>🔥 <strong>This Week:</strong> Weekly power rankings reset every 7 days!</li>
            </ul>
            <p className="mt-3 text-orange-600 dark:text-orange-400 font-bold">
              💪 Complete quests, win battles, and dominate the arena! The throne awaits! 👑
            </p>
          </div>
        </div>
      </motion.div>

      {/* Battle Stats Summary */}
      {displayedLeaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-300 dark:border-yellow-800 text-center"
          >
            <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-2">
              {displayedLeaderboard.length}
            </div>
            <div className="font-bold text-gray-600 dark:text-gray-400">
              Active Warriors
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-300 dark:border-blue-800 text-center"
          >
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">
              {displayedLeaderboard[0]?.score.toLocaleString() || 0}
            </div>
            <div className="font-bold text-gray-600 dark:text-gray-400">
              Highest Power
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-300 dark:border-green-800 text-center"
          >
            <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">
              {Math.round(displayedLeaderboard.reduce((sum, e) => sum + e.score, 0) / displayedLeaderboard.length) || 0}
            </div>
            <div className="font-bold text-gray-600 dark:text-gray-400">
              Average Power
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
