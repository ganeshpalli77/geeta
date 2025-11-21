import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

interface AdventureCardProps {
  icon: string;
  iconBg?: string;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  credits?: number;
  progress?: { current: number; total: number };
  locked?: boolean;
  lockedMessage?: string;
  unlockTime?: string;
  onClick?: () => void;
  className?: string;
  buttonClassName?: string;
  backgroundImage?: string;
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
  lockedMessage,
  unlockTime,
  onClick,
  className,
  buttonClassName,
  backgroundImage,
}: AdventureCardProps) {
  const handleClick = () => {
    if (locked && lockedMessage) {
      toast.info(lockedMessage);
      return;
    }
    onClick?.();
  };

  // Locked card style (epic Mahabharata design)
  if (locked) {
    return (
      <div
        onClick={handleClick}
        className={cn(
          "relative rounded-3xl overflow-hidden bg-white shadow-lg border-2 flex flex-col h-full",
          "hover:shadow-xl transition-all duration-300",
          lockedMessage ? "cursor-pointer" : "",
          className
        )}
        style={{ borderColor: 'rgba(163, 52, 255, 0.2)' }}
      >
        {/* Epic Background Image Section */}
        <div className="relative h-40 overflow-hidden flex-shrink-0">
          {/* Background - either custom image or gradient */}
          {backgroundImage ? (
            <img 
              src={backgroundImage} 
              alt="Adventure background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800"></div>
              {/* Cosmic background effect */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iODAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE1MCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMTIwIiByPSIwLjgiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSIxNzAiIGN5PSIzMCIgcj0iMS4yIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3N0YXJzKSIvPjwvc3ZnPg==')] opacity-40"></div>
              
              {/* Silhouettes - Left archer */}
              <div className="absolute left-4 bottom-0 text-6xl opacity-40">🏹</div>
              
              {/* Temple silhouette */}
              <div className="absolute left-8 bottom-0 text-4xl opacity-30">🕌</div>
              
              {/* Silhouettes - Right archer */}
              <div className="absolute right-4 bottom-0 text-6xl opacity-40 scale-x-[-1]">🏹</div>
            </>
          )}

        </div>

        {/* Content Section - Flex grow to push button down */}
        <div className="p-5 bg-white flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">{description}</p>
          </div>
          
          {/* Unlock Button - Only show if unlockTime is provided (not for permanently locked features) */}
          {unlockTime && !lockedMessage && (
            <button 
              disabled
              className={cn(
                "w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-90",
                buttonClassName
              )}
            >
              Unlock in {unlockTime}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Available card style (brand purple border)
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
        <div className={cn(
          "shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-md",
          iconBg
        )}>
          {icon}
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
