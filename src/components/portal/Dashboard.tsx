import { Coins, Flame, Target, Trophy, BookOpen, Video, Pencil, Image, ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { StatCard } from './StatCard';
import { TaskCard } from './TaskCard';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { currentProfile } = useApp();
  const t = useTranslation();
  const userName = currentProfile?.name || 'User';
  
  // Mock data
  const stats = {
    credits: 2450,
    streak: 7,
    missions: 15,
    rank: 342,
  };

  const todaysQuests = [
    {
      icon: BookOpen,
      title: 'Daily Quiz Challenge',
      description: 'Test your knowledge with 10 questions',
      difficulty: 'Medium' as const,
      credits: 50,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Video,
      title: 'Watch & Reflect',
      description: 'Watch a 5-minute video and share your thoughts',
      difficulty: 'Easy' as const,
      credits: 30,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Creative Writing',
      description: 'Write a short essay on today\'s theme',
      difficulty: 'Hard' as const,
      credits: 100,
      onClick: () => onNavigate?.('events'),
    },
  ];

  const upcomingAdventures = [
    {
      title: 'Round 3: Characters',
      subtitle: 'Unlocks in 2 days',
      icon: '👥',
      onClick: () => onNavigate?.('round-3'),
    },
    {
      title: 'Round 4: Application',
      subtitle: 'Unlocks in 9 days',
      icon: '🎯',
      onClick: () => onNavigate?.('round-4'),
    },
    {
      title: 'Round 5: Creative',
      subtitle: 'Unlocks in 16 days',
      icon: '🎨',
      onClick: () => onNavigate?.('round-5'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 🙏</h1>
            <p className="text-orange-100">Ready to continue your journey with the Bhagavad Gita?</p>
          </div>
          <div className="text-6xl opacity-20">🕉️</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Coins} label="Credits" value={stats.credits} color="orange" />
        <StatCard icon={Flame} label="Day Streak" value={stats.streak} color="orange" />
        <StatCard icon={Target} label="Missions" value={stats.missions} color="blue" />
        <StatCard icon={Trophy} label="Rank" value={`#${stats.rank}`} color="purple" />
      </div>

      {/* Today's Quests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Quests</h2>
          <button className="text-sm text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid gap-4">
          {todaysQuests.map((quest, index) => (
            <TaskCard key={index} {...quest} />
          ))}
        </div>
      </div>

      {/* Upcoming Adventures */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Adventures</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingAdventures.map((adventure, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all"
              onClick={adventure.onClick}
            >
              <div className="text-4xl mb-3">{adventure.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{adventure.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{adventure.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}