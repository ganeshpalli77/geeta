import { ChevronRight, Zap, LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface TaskCardProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  credits: number;
  onClick?: () => void;
  className?: string;
  progress?: { current: number; total: number };
}

export function TaskCard({
  icon,
  title,
  description,
  difficulty,
  credits,
  onClick,
  className,
  progress,
}: TaskCardProps) {
  const iconEmoji = typeof icon === 'string' ? icon : '📖';

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-3xl p-5 bg-white border-[3px] border-purple-600 shadow-md flex flex-col h-full",
        "hover:shadow-xl hover:border-purple-700 transition-all duration-300",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-start mb-4">
        <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl shadow-md">
          {iconEmoji}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{title}</h3>
          {onClick && (
            <ChevronRight className="w-5 h-5 text-purple-500 shrink-0" />
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 leading-relaxed flex-1">{description}</p>

        {/* Badges */}
        {(difficulty || credits) && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {difficulty && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                <Zap className="w-3 h-3" />
                {difficulty}
              </div>
            )}
            {credits && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                <span>💎</span>
                +{credits} credits
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        {progress && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Progress</span>
            <span className="text-sm font-bold text-purple-600">
              {progress.current}/{progress.total}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
