import { BookOpen, Video, Pencil, Image, Trophy, Lightbulb, Puzzle } from 'lucide-react';
import { RoundHeader } from './RoundHeader';
import { TaskCard } from './TaskCard';

interface Task {
  icon: any;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  credits: number;
  onClick?: () => void;
}

interface RoundPageProps {
  roundNumber: number;
  title: string;
  week: number;
  tasks: Task[];
}

export function RoundPage({ roundNumber, title, week, tasks }: RoundPageProps) {
  const completedTasks = 0; // This would come from state/API

  return (
    <div className="space-y-6">
      <RoundHeader
        roundNumber={roundNumber}
        title={title}
        week={week}
        progress={completedTasks}
        totalTasks={tasks.length}
      />

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    </div>
  );
}

// Round 1: Introduction
export function Round1Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Introduction Quiz',
      description: 'Test your basic knowledge about the Bhagavad Gita',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Video,
      title: 'Watch Intro Video',
      description: 'Learn about the context and setting of the Gita',
      difficulty: 'Easy' as const,
      credits: 30,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Reflection Essay',
      description: 'Write about your initial impressions',
      difficulty: 'Medium' as const,
      credits: 75,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={1} title="Introduction" week={1} tasks={tasks} />;
}

// Round 2: Interpretation
export function Round2Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Interpretation Quiz',
      description: 'Answer questions about key verses and their meanings',
      difficulty: 'Medium' as const,
      credits: 75,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Video,
      title: 'Commentary Analysis',
      description: 'Watch and analyze different interpretations',
      difficulty: 'Medium' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Verse Interpretation',
      description: 'Write your own interpretation of selected verses',
      difficulty: 'Hard' as const,
      credits: 100,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Image,
      title: 'Visual Representation',
      description: 'Create a visual representation of a teaching',
      difficulty: 'Medium' as const,
      credits: 80,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={2} title="Interpretation" week={2} tasks={tasks} />;
}

// Round 3: Characters
export function Round3Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Character Quiz',
      description: 'Test your knowledge about key characters',
      difficulty: 'Medium' as const,
      credits: 75,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Video,
      title: 'Character Study Video',
      description: 'Watch detailed analysis of main characters',
      difficulty: 'Easy' as const,
      credits: 40,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Character Analysis',
      description: 'Write an essay analyzing a character\'s role',
      difficulty: 'Hard' as const,
      credits: 100,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: '🎭',
      title: 'Role Play Exercise',
      description: 'Create a dialogue from a character\'s perspective',
      difficulty: 'Medium' as const,
      credits: 85,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={3} title="Characters" week={3} tasks={tasks} />;
}

// Round 4: Application
export function Round4Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Application Quiz',
      description: 'Test how well you can apply Gita teachings',
      difficulty: 'Medium' as const,
      credits: 80,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Lightbulb,
      title: 'Real-Life Scenarios',
      description: 'Apply Gita wisdom to modern situations',
      difficulty: 'Hard' as const,
      credits: 100,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Personal Reflection',
      description: 'Write about how teachings apply to your life',
      difficulty: 'Medium' as const,
      credits: 75,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Video,
      title: 'Application Examples',
      description: 'Share a video of practical applications',
      difficulty: 'Hard' as const,
      credits: 120,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={4} title="Application" week={4} tasks={tasks} />;
}

// Round 5: Creative & Analytical
export function Round5Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: '🎨',
      title: 'Creative Expression',
      description: 'Create art inspired by Gita teachings',
      difficulty: 'Medium' as const,
      credits: 90,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Analytical Essay',
      description: 'Deep analysis of a chapter or theme',
      difficulty: 'Hard' as const,
      credits: 120,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Video,
      title: 'Creative Video',
      description: 'Produce a creative video presentation',
      difficulty: 'Hard' as const,
      credits: 150,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: '📊',
      title: 'Comparative Study',
      description: 'Compare different philosophical perspectives',
      difficulty: 'Hard' as const,
      credits: 110,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={5} title="Creative & Analytical" week={5} tasks={tasks} />;
}

// Round 6: Competition Mode
export function Round6Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: Trophy,
      title: 'Speed Quiz Championship',
      description: 'Compete against others in timed quizzes',
      difficulty: 'Hard' as const,
      credits: 150,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: '⚡',
      title: 'Lightning Round',
      description: 'Rapid-fire questions with time pressure',
      difficulty: 'Hard' as const,
      credits: 130,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: '🏆',
      title: 'Grand Debate',
      description: 'Participate in structured debate competition',
      difficulty: 'Hard' as const,
      credits: 200,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={6} title="Competition Mode" week={6} tasks={tasks} />;
}

// Round 7: Final Challenge
export function Round7Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: Trophy,
      title: 'Final Comprehensive Quiz',
      description: 'Ultimate test covering all rounds',
      difficulty: 'Hard' as const,
      credits: 200,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Pencil,
      title: 'Capstone Essay',
      description: 'Write a comprehensive reflection on your journey',
      difficulty: 'Hard' as const,
      credits: 180,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Video,
      title: 'Final Presentation',
      description: 'Create a final presentation showcasing your learning',
      difficulty: 'Hard' as const,
      credits: 250,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Puzzle,
      title: 'Complete the Puzzle',
      description: 'Reveal your final collected puzzle',
      difficulty: 'Easy' as const,
      credits: 100,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={7} title="Final Challenge" week={7} tasks={tasks} />;
}