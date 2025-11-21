import { cn } from '../ui/utils';

interface RoundHeaderProps {
  roundNumber: number;
  title: string;
  week: number;
  progress?: number;
  totalTasks?: number;
}

const roundGradients = {
  1: 'from-[#FF6B35] to-[#F97316]',
  2: 'from-[#FF8C42] to-[#FB923C]',
  3: 'from-[#8B5CF6] to-[#A855F7]',
  4: 'from-[#10B981] to-[#059669]',
  5: 'from-[#EF4444] to-[#F97316]',
  6: 'from-[#EC4899] to-[#DB2777]',
  7: 'from-[#FF6B35] to-[#F59E0B]',
};

export function RoundHeader({ roundNumber, title, week, progress, totalTasks }: RoundHeaderProps) {
  const gradient = roundGradients[roundNumber as keyof typeof roundGradients] || roundGradients[1];

  return (
    <div className={cn("rounded-2xl p-6 bg-gradient-to-r text-white", gradient)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm opacity-90 mb-1">Week {week}</div>
          <h1 className="text-3xl font-bold mb-2">Round {roundNumber} — {title}</h1>
          {progress !== undefined && totalTasks !== undefined && (
            <div className="text-sm opacity-90">
              {progress} of {totalTasks} tasks completed
            </div>
          )}
        </div>
        {progress !== undefined && totalTasks !== undefined && (
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round((progress / totalTasks) * 100)}%</div>
            <div className="text-sm opacity-90">Complete</div>
          </div>
        )}
      </div>
    </div>
  );
}
