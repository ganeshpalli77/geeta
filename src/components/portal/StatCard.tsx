import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: 'orange' | 'blue' | 'green' | 'purple';
  className?: string;
}

const colorClasses = {
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    icon: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
};

export function StatCard({ icon: Icon, label, value, color = 'orange', className }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={cn(
      "p-4 rounded-xl border bg-white dark:bg-gray-900 transition-all hover:shadow-md",
      colors.border,
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-6 h-6", colors.icon)} />
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
}
