import { ChevronRight, Zap } from 'lucide-react';
import { cn } from '../ui/utils';

interface AdventureCardProps {
  icon: string;
  iconBg?: string;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  credits?: number;
  progress?: { current: number; total: number };
  locked?: boolean;
  unlockTime?: string;
  onClick?: () => void;
  className?: string;
}

export function AdventureCard({
  icon,
  iconBg = 'from-orange-400 to-orange-600',
  title,
  description,
  difficulty,
  credits,
  progress,
  locked = false,
  unlockTime,
  onClick,
  className,
}: AdventureCardProps) {
  // Locked card style (purple gradient)
  if (locked) {
    return (
      <div
        className={cn(
          "relative rounded-3xl p-5 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg",
          "hover:shadow-xl transition-all duration-300",
          className
        )}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-2xl shadow-lg">
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-lg leading-tight">{title}</h3>
              {unlockTime && (
                <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 rounded-full px-3 py-1">
                  ✨ {unlockTime}
                </div>
              )}
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Decorative emoji */}
        <div className="absolute top-4 right-4 text-2xl opacity-50">
          🎁
        </div>
      </div>
    );
  }

  // Available card style (yellow border)
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-3xl p-5 bg-white border-[3px] border-yellow-400 shadow-md",
        "hover:shadow-xl hover:border-yellow-500 transition-all duration-300",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          "shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-md",
          iconBg
        )}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{title}</h3>
            {onClick && (
              <ChevronRight className="w-5 h-5 text-orange-500 shrink-0" />
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{description}</p>

          {/* Badges */}
          {(difficulty || credits) && (
            <div className="flex items-center gap-2 mb-3">
              {difficulty && (
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  <Zap className="w-3 h-3" />
                  {difficulty}
                </div>
              )}
              {credits && (
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
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
              <span className="text-sm font-bold text-orange-600">
                {progress.current}/{progress.total}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
