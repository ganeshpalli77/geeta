import React from 'react';
import { Coins, Flame, Target, Trophy, BookOpen, Video, Pencil, Image, ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { StatCard } from './StatCard';
import { AdventureCard } from './AdventureCard';
// @ts-ignore
import welcomeBanner from '../../assets/welcome-banner.png';
// @ts-ignore
import welcomeBannerMobile from '../../assets/welcome-banner-mobile.png';
// @ts-ignore
import adventureCard1Bg from '../../assets/adventure-card-1.png';
// @ts-ignore
import adventureCard2Bg from '../../assets/adventure-card-2.png';
// @ts-ignore
import adventureCard3Bg from '../../assets/adventure-card-3.png';

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
      <div className="rounded-2xl overflow-hidden">
        {/* Desktop Banner - Shows by default, hidden on small screens */}
        <img 
          src={welcomeBanner} 
          alt="Welcome back! Ready to continue your journey with the Bhagavad Geeta?" 
          className="hidden sm:block w-full h-auto object-cover"
        />
        {/* Mobile Banner - Shown only on very small screens */}
        <img 
          src={welcomeBannerMobile} 
          alt="Welcome back! Ready to continue your journey with the Bhagavad Geeta?" 
          className="block sm:hidden w-full h-auto object-cover"
        />
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
            <AdventureCard 
              key={index} 
              {...adventure} 
              buttonClassName={index === 1 || index === 2 ? 'mt-12' : undefined}
              backgroundImage={
                index === 0 ? adventureCard1Bg : 
                index === 1 ? adventureCard2Bg : 
                index === 2 ? adventureCard3Bg :
                undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}