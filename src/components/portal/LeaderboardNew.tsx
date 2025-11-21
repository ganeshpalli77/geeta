import React, { useState, useEffect } from 'react';
import { Trophy, Share2, RefreshCw, Zap, Star } from 'lucide-react';
import { cn } from '../ui/utils';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';


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


  useEffect(() => {
    // Refresh leaderboard on mount
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshLeaderboard();
      toast.success('🔄 Leaderboard updated!');
    } catch (error) {
      toast.error('Failed to refresh leaderboard');
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

  // Process leaderboard data - show global rankings
  const getFilteredLeaderboard = (): LeaderboardEntry[] => {
    if (!leaderboard || leaderboard.length === 0) {
      return [];
    }

    let sortedLeaderboard = [...leaderboard];
    sortedLeaderboard.sort((a, b) => b.totalScore - a.totalScore);

    return sortedLeaderboard.map((entry, index) => ({
      rank: index + 1,
      profileId: entry.profileId,
      name: entry.name,
      avatar: getInitial(entry.name),
      avatarUrl: getProfilePicture(entry.profileId),
      category: entry.category,
      score: entry.totalScore,
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
      toast.error('Participate first to share your rank! 🏆');
      return;
    }

    const rank = currentUserEntry.rank;
    let rankEmoji = '✨';
    if (rank === 1) rankEmoji = '👑';
    else if (rank <= 3) rankEmoji = '🏆';
    else if (rank <= 10) rankEmoji = '⭐';
    else if (rank <= 100) rankEmoji = '🔥';

    const shareText = `${rankEmoji} I'm ranked #${rank} on the Geeta Olympiad Leaderboard with ${currentUserEntry.score} points! Join me in this journey! 💪`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Geeta Olympiad Leaderboard',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Leaderboard stats copied to clipboard! 🎯');
    }
  };

  return (
    <div className="space-y-6">
      {/* 🏆 Gamified Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #f97316, #ea580c, #c2410c)'
        }}
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
                <h1 className="text-4xl font-black">Leaderboard</h1>
                <p className="text-white/90 font-semibold">Top performers in Geeta Olympiad</p>
              </div>
            </div>
            
            {currentUserEntry && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border-2 border-white/30"
              >
                <Trophy className="w-5 h-5" />
                <div>
                  <div className="text-xs font-semibold opacity-90">YOUR RANK</div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black">#{currentUserEntry.rank}</span>
                    <span className="text-sm font-bold">
                      {currentUserEntry.rank === 1 && '👑 1st Place'}
                      {currentUserEntry.rank === 2 && '🥈 2nd Place'}
                      {currentUserEntry.rank === 3 && '🥉 3rd Place'}
                      {currentUserEntry.rank > 3 && currentUserEntry.rank <= 10 && '⭐ Top 10'}
                      {currentUserEntry.rank > 10 && currentUserEntry.rank <= 100 && '🔥 Top 100'}
                      {currentUserEntry.rank > 100 && '✨ Participant'}
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


      {/* 🏆 Top 3 Podium */}
      {displayedLeaderboard.length >= 3 && (
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-8"
        >
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="w-full md:w-64 min-h-[380px] bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-300 dark:border-gray-700"
            >
              <div className="flex flex-col items-center text-center h-full justify-center">
                {/* Medal Badge */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg mb-4">
                  <span className="text-2xl">🥈</span>
                </div>

                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-400 shadow-lg">
                    <ImageWithFallback
                      src={displayedLeaderboard[1].avatarUrl || ''}
                      alt={displayedLeaderboard[1].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 truncate w-full">
                  {displayedLeaderboard[1].name}
                </h3>

                {/* Score */}
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xl font-bold">
                    {displayedLeaderboard[1].score.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Points</p>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="w-full md:w-80 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-3xl p-5 shadow-2xl"
              style={{ 
                border: '2px solid #9333EA',
                boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.3), 0 20px 25px -5px rgba(168, 85, 247, 0.4), 0 8px 10px -6px rgba(168, 85, 247, 0.4)'
              }}
            >
              <div className="flex flex-col items-center text-center">
                {/* Medal Badge */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-xl mb-2">
                  <span className="text-3xl">🥇</span>
                </div>

                {/* Avatar */}
                <div className="relative mb-2">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-400 shadow-2xl">
                    <ImageWithFallback
                      src={displayedLeaderboard[0].avatarUrl || ''}
                      alt={displayedLeaderboard[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Badge */}
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mb-2 shadow-lg">
                  <span className="text-white font-black text-xs tracking-wide">1ST PLACE</span>
                </div>

                {/* Name */}
                <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2 truncate w-full">
                  {displayedLeaderboard[0].name}
                </h3>

                {/* Score */}
                <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <Trophy className="w-5 h-5" />
                  <span className="text-2xl font-black">
                    {displayedLeaderboard[0].score.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">Points</p>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="w-full md:w-64 min-h-[380px] bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-300 dark:border-gray-600"
            >
              <div className="flex flex-col items-center text-center h-full justify-center">
                {/* Medal Badge */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg mb-4">
                  <span className="text-2xl">🥉</span>
                </div>

                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-400 shadow-lg">
                    <ImageWithFallback
                      src={displayedLeaderboard[2].avatarUrl || ''}
                      alt={displayedLeaderboard[2].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 truncate w-full">
                  {displayedLeaderboard[2].name}
                </h3>

                {/* Score */}
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xl font-bold">
                    {displayedLeaderboard[2].score.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Points</p>
              </div>
            </motion.div>
        </div>
      )}

      {/* Leaderboard Rankings */}
      {displayedLeaderboard.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800"
        >
          <Trophy className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-2xl font-black text-gray-600 dark:text-gray-400 mb-2">
            No Participants Yet! 
          </h3>
          <p className="text-gray-500 dark:text-gray-500 font-semibold">
            Be the first to participate and appear on the leaderboard! 🏆
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
                        Points
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Share Rankings */}
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
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 shadow-lg text-lg"
          >
            <Share2 className="w-5 h-5" />
            Share Your Rank! 🏆
          </motion.button>
        </motion.div>
      )}

      {/* Leaderboard Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-300 dark:border-purple-800"
      >
        <div className="flex gap-3">
          <div className="text-4xl">🏆</div>
          <div>
            <p className="font-black mb-2 text-gray-900 dark:text-white text-lg">Leaderboard Info</p>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              Complete quizzes, collect puzzle pieces, and participate in activities to earn points and climb the rankings! 
              Your total score determines your position on the leaderboard.
            </p>
            <p className="mt-3 text-purple-600 dark:text-purple-400 font-bold">
              💪 Keep participating to reach the top! 👑
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      {displayedLeaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-2 border-purple-300 dark:border-purple-800 text-center"
          >
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">
              {displayedLeaderboard.length}
            </div>
            <div className="font-bold text-gray-600 dark:text-gray-400">
              Total Participants
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
              Highest Score
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
              Average Score
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
