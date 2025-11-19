import { Award, Star, Trophy, Zap, Target, Crown, Flame, Sparkles, Check } from 'lucide-react';
import { cn } from '../ui/utils';
import { Progress } from '../ui/progress';

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

const badges: Badge[] = [
  { id: '1', icon: '⭐', name: 'First Steps', description: 'Complete your first task', earned: true, earnedDate: '2 days ago' },
  { id: '2', icon: '🏆', name: 'Knowledge Seeker', description: 'Complete 5 quizzes', earned: true, earnedDate: '1 day ago' },
  { id: '3', icon: '⚡', name: 'Speed Master', description: 'Complete a quiz in under 5 minutes', earned: true, earnedDate: '3 hours ago' },
  { id: '4', icon: '🎯', name: 'Perfect Match', description: 'Score 100% on a quiz', earned: true, earnedDate: '5 hours ago' },
  { id: '5', icon: '📚', name: 'Quiz Champion', description: 'Complete 10 quizzes', earned: true, earnedDate: '1 day ago' },
  { id: '6', icon: '🥇', name: 'Top 100', description: 'Reach top 100 on leaderboard', earned: true, earnedDate: '2 days ago' },
  { id: '7', icon: '🔥', name: 'Consistent Learner', description: 'Maintain a 7-day streak', earned: true, earnedDate: 'Just now' },
  { id: '8', icon: '💡', name: 'Creative Mind', description: 'Submit 3 creative tasks', earned: true, earnedDate: '6 hours ago' },
  { id: '9', icon: '🧩', name: 'Puzzle Master', description: 'Collect 10 puzzle pieces', earned: false },
  { id: '10', icon: '🎓', name: 'Ultimate Scholar', description: 'Complete all rounds', earned: false },
  { id: '11', icon: '👑', name: 'Leaderboard King', description: 'Reach #1 on leaderboard', earned: false },
  { id: '12', icon: '🧠', name: 'Memory Expert', description: 'Complete 50 quizzes', earned: false },
];

export function RewardsPage() {
  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;
  const progress = (earnedCount / totalCount) * 100;

  const recentAchievements = badges
    .filter(b => b.earned && b.earnedDate)
    .sort((a, b) => {
      // This is simplified - in real app would parse dates properly
      return 0;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Rewards & Badges</h1>
        </div>
        <p className="text-orange-100">Track your achievements and collect badges</p>
      </div>

      {/* Stats Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Collection Progress
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {earnedCount} of {totalCount} badges earned
            </div>
          </div>
          <div className="text-4xl">{Math.round(progress)}%</div>
        </div>
        <Progress value={progress} className="h-2" />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{earnedCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Badges Earned</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2,450</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Points</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">7</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "p-4 rounded-xl border transition-all relative",
                badge.earned
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg"
                  : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60"
              )}
            >
              {badge.earned && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="text-4xl mb-3 text-center">{badge.icon}</div>
              <div className="text-center">
                <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                  {badge.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {badge.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Achievements</h2>
        <div className="space-y-3">
          {recentAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-950/30 dark:to-orange-950/30 flex items-center justify-center text-2xl flex-shrink-0">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {achievement.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {achievement.description}
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {achievement.earnedDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
