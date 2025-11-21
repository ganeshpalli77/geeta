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
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Easy' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Create a Slogan',
      description: 'Create an inspiring slogan based on Bhagavad Geeta',
      difficulty: 'Medium' as const,
      credits: 75,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Video,
      title: 'Create a Reel',
      description: 'Create a short video reel sharing your understanding',
      difficulty: 'Medium' as const,
      credits: 100,
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
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Essay Writing',
      description: 'Write an essay on your favorite verse',
      difficulty: 'Hard' as const,
      credits: 150,
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
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Lightbulb,
      title: 'Creative Task',
      description: 'Express your creativity with a Geeta-inspired project',
      difficulty: 'Medium' as const,
      credits: 125,
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
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Video,
      title: 'Video Submission',
      description: 'Share your understanding through a video',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={4} title="Application" week={4} tasks={tasks} />;
}

// Round 5: Creative & Analytical
export function Round5Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Slogan Creation',
      description: 'Create a meaningful slogan inspired by the Geeta',
      difficulty: 'Medium' as const,
      credits: 75,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={5} title="Creative & Analytical" week={5} tasks={tasks} />;
}

// Round 6: Competition Mode
export function Round6Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Hard' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Pencil,
      title: 'Essay Writing',
      description: 'Write a reflective essay on Geeta teachings',
      difficulty: 'Hard' as const,
      credits: 150,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={6} title="Competition Mode" week={6} tasks={tasks} />;
}

// Round 7: Final Challenge
export function Round7Page({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const tasks = [
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Hard' as const,
      credits: 100,
      onClick: () => onNavigate?.('quiz'),
    },
    {
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy' as const,
      credits: 50,
      onClick: () => onNavigate?.('events'),
    },
    {
      icon: Lightbulb,
      title: 'Final Creative Project',
      description: 'Complete your final creative project showcasing your journey',
      difficulty: 'Hard' as const,
      credits: 200,
      onClick: () => onNavigate?.('events'),
    },
  ];

  return <RoundPage roundNumber={7} title="Final Challenge" week={7} tasks={tasks} />;
}