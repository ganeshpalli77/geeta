import { Coins, Flame, Target, Trophy, BookOpen, Video, Pencil, Image, ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { StatCard } from './StatCard';
import { AdventureCard } from './AdventureCard';

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
      icon: '📖',
      title: 'Daily Quiz Challenge',
      description: 'Test your knowledge of Chapter 2 • 5 questions',
      difficulty: 'Medium' as const,
      credits: 50,
      progress: { current: 0, total: 1 },
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: '🎯',
      title: 'Meaning Match Adventure',
      description: 'Match shlokas with their meanings • Fun puzzle',
      difficulty: 'Medium' as const,
      credits: 75,
      progress: { current: 0, total: 1 },
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: '✍️',
      title: 'Creative Writing',
      description: 'Write a short essay on today\'s theme',
      difficulty: 'Hard' as const,
      credits: 100,
      progress: { current: 0, total: 1 },
      onClick: () => onNavigate?.('events'),
    },
  ];

  const upcomingAdventures = [
    {
      icon: '🎁',
      title: 'Next Adventure Unlocks Soon!',
      description: 'Round 3 - Character Analysis\n\n🎭 Dive deep into the personalities of Krishna, Arjuna, and other legendary figures!',
      unlockTime: '2 days',
      locked: true,
    },
    {
      icon: '🎁',
      title: 'Round 4: Application',
      description: 'Apply Geeta wisdom to modern life scenarios',
      unlockTime: '9 days',
      locked: true,
    },
    {
      icon: '🎁',
      title: 'Round 5: Creative',
      description: 'Express your learning through art and creativity',
      unlockTime: '16 days',
      locked: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 🙏</h1>
            <p className="text-orange-100">Ready to continue your journey with the Bhagavad Geeta?</p>
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
            <AdventureCard key={index} {...quest} />
          ))}
        </div>
      </div>

      {/* Upcoming Adventures */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Adventures</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingAdventures.map((adventure, index) => (
            <AdventureCard key={index} {...adventure} />
          ))}
        </div>
      </div>
    </div>
  );
}