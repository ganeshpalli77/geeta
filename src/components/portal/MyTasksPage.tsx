import { CheckSquare, Circle, CheckCircle2, Clock } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { cn } from '../ui/utils';
import { BookOpen, Video, Pencil, Image, Trophy, Puzzle } from 'lucide-react';

type TaskStatus = 'completed' | 'in-progress' | 'locked';

interface MyTask {
  id: string;
  icon: any;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  credits: number;
  status: TaskStatus;
  round: string;
  onClick?: () => void;
}

interface MyTasksPageProps {
  onNavigate?: (page: string) => void;
}

export function MyTasksPage({ onNavigate }: MyTasksPageProps) {
  const myTasks: MyTask[] = [
    {
      id: '1',
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Easy',
      credits: 100,
      status: 'completed',
      round: 'Round 1',
      onClick: () => onNavigate?.('quiz'),
    },
    {
      id: '2',
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy',
      credits: 50,
      status: 'completed',
      round: 'Round 1',
      onClick: () => onNavigate?.('events'),
    },
    {
      id: '3',
      icon: Pencil,
      title: 'Create a Slogan',
      description: 'Create an inspiring slogan based on Bhagavad Geeta',
      difficulty: 'Medium',
      credits: 75,
      status: 'in-progress',
      round: 'Round 1',
      onClick: () => onNavigate?.('events'),
    },
    {
      id: '4',
      icon: Video,
      title: 'Create a Reel',
      description: 'Create a short video reel sharing your understanding',
      difficulty: 'Medium',
      credits: 100,
      status: 'in-progress',
      round: 'Round 1',
      onClick: () => onNavigate?.('events'),
    },
    {
      id: '5',
      icon: BookOpen,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      difficulty: 'Medium',
      credits: 100,
      status: 'locked',
      round: 'Round 2',
      onClick: () => onNavigate?.('quiz'),
    },
    {
      id: '6',
      icon: Puzzle,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      difficulty: 'Easy',
      credits: 50,
      status: 'locked',
      round: 'Round 2',
      onClick: () => onNavigate?.('events'),
    },
    {
      id: '7',
      icon: Pencil,
      title: 'Essay Writing',
      description: 'Write an essay on your favorite verse',
      difficulty: 'Hard',
      credits: 150,
      status: 'locked',
      round: 'Round 2',
      onClick: () => onNavigate?.('events'),
    },
  ];

  const completedTasks = myTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress').length;
  const totalTasks = myTasks.length;

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
            <Clock className="w-4 h-4" />
            <span>In Progress</span>
          </div>
        );
      case 'locked':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600">
            <Circle className="w-4 h-4" />
            <span>Locked</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <CheckSquare className="w-8 h-8" />
          <h1 className="text-3xl font-bold">My Tasks</h1>
        </div>
        <p className="text-blue-100">Track your progress across all rounds</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {completedTasks}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {inProgressTasks}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {totalTasks}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
        </div>
      </div>

      {/* Task List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Tasks</h2>
        <div className="space-y-3">
          {myTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "p-4 rounded-xl border bg-white dark:bg-gray-900 transition-all",
                task.status === 'locked'
                  ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-800"
                  : "border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700"
              )}
              onClick={task.onClick}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                  task.status === 'completed'
                    ? "bg-green-100 dark:bg-green-950/30"
                    : "bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/30 dark:to-orange-900/20"
                )}>
                  <task.icon className={cn(
                    "w-6 h-6",
                    task.status === 'completed'
                      ? "text-green-600 dark:text-green-400"
                      : "text-orange-600 dark:text-orange-400"
                  )} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                    {getStatusBadge(task.status)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                    <span>{task.round}</span>
                    {task.difficulty && <span>• {task.difficulty}</span>}
                    <span>• {task.credits} Credits</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}