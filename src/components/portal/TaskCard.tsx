import { ChevronRight, Zap, LucideIcon, Lock } from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

interface TaskCardProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  credits: number;
  onClick?: () => void;
  className?: string;
  progress?: { current: number; total: number };
  locked?: boolean;
  lockedMessage?: string;
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
  locked = false,
  lockedMessage,
}: TaskCardProps) {
  const iconEmoji = typeof icon === 'string' ? icon : '📖';

  const handleClick = () => {
    if (locked) {
      toast.info(lockedMessage || 'This feature is locked');
      return;
    }
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative rounded-3xl p-5 bg-white border-[3px] shadow-md flex flex-col h-full transition-all duration-300",
        locked 
          ? "border-gray-300 opacity-60 cursor-not-allowed" 
          : "border-purple-600 hover:shadow-xl hover:border-purple-700 cursor-pointer",
        className
      )}
    >
      {/* Lock Icon Overlay */}
      {locked && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center shadow-md">
          <Lock className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center justify-start mb-4">
        <div className={cn(
          "shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md",
          locked 
            ? "bg-gradient-to-br from-gray-300 to-gray-400" 
            : "bg-gradient-to-br from-orange-400 to-orange-600"
        )}>
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
