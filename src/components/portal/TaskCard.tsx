import { ArrowRight, LucideIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface TaskCardProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  credits: number;
  onClick?: () => void;
  className?: string;
}

export function TaskCard({
  icon,
  title,
  description,
  difficulty,
  credits,
  onClick,
  className,
}: TaskCardProps) {
  const Icon = typeof icon === 'string' ? null : icon;

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
        "hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all",
        "text-left group",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/30 dark:to-orange-900/20 flex items-center justify-center flex-shrink-0">
          {Icon ? (
            <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          ) : (
            <span className="text-2xl">{icon}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {difficulty && (
              <Badge variant="secondary" className={cn("text-xs px-2 py-0.5", difficultyColors[difficulty])}>
                {difficulty}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
              {credits} Credits
            </Badge>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-950/30 transition-colors">
            <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
          </div>
        </div>
      </div>
    </button>
  );
}
