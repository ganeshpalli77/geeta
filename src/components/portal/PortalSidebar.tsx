import { Home, Trophy, Award, BookOpen, Settings, LogOut, Lock } from 'lucide-react';
import { cn } from '../ui/utils';
import { useTranslation } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner';

interface Round {
  id: number;
  titleKey: string;
  subtitleKey: string;
  week: number;
  locked?: boolean;
}

const rounds: Round[] = [
  { id: 1, titleKey: 'round1', subtitleKey: 'Round 1', week: 1, locked: false },
  { id: 2, titleKey: 'round2', subtitleKey: 'Round 2', week: 2, locked: true },
  { id: 3, titleKey: 'round3', subtitleKey: 'Round 3', week: 3, locked: true },
  { id: 4, titleKey: 'round4', subtitleKey: 'Round 4', week: 4, locked: true },
  { id: 5, titleKey: 'round5', subtitleKey: 'Round 5', week: 5, locked: true },
  { id: 6, titleKey: 'round6', subtitleKey: 'Round 6', week: 6, locked: true },
  { id: 7, titleKey: 'round7', subtitleKey: 'Round 7', week: 7, locked: true },
];

interface PortalSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function PortalSidebar({ currentPage, onNavigate }: PortalSidebarProps) {
  const t = useTranslation();
  const { logout } = useApp();
  
  // Round color mapping (LogiQids style)
  const getRoundColor = (id: number) => {
    const colors = [
      'from-indigo-500 to-purple-600', // Round 1
      'from-blue-500 to-cyan-500',     // Round 2
      'from-emerald-500 to-teal-500',  // Round 3
      'from-orange-500 to-yellow-500', // Round 4
      'from-pink-500 to-rose-500',     // Round 5
      'from-purple-500 to-fuchsia-500',// Round 6
      'from-red-500 to-orange-500',    // Round 7
    ];
    return colors[id - 1] || colors[0];
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col overflow-y-auto shadow-xl">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm">🕉️</span>
          </div>
          <div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900 dark:text-white">LearnGeeta</div>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Olympiad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-3 space-y-1">
        <button
          onClick={() => onNavigate('dashboard')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold",
            currentPage === 'dashboard'
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
              : "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600"
          )}
        >
          <Home className="w-4 h-4" />
          {t.nav.dashboard}
        </button>
      </nav>

      {/* Rounds Section */}
      <div className="px-3 py-2 flex-1">
        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 px-3 py-1 uppercase tracking-wider">
          {t.nav.rounds}
        </div>
        <nav className="space-y-1 mt-1">
          {rounds.map((round) => (
            <button
              key={round.id}
              onClick={() => !round.locked && onNavigate(`round-${round.id}`)}
              className={cn(
                "w-full group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-semibold relative overflow-hidden",
                currentPage === `round-${round.id}` && !round.locked
                  ? `bg-gradient-to-r ${getRoundColor(round.id)} text-white shadow-lg`
                  : "text-gray-600 dark:text-gray-400",
                !round.locked && currentPage !== `round-${round.id}` && "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                round.locked && "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800/30"
              )}
              disabled={round.locked}
            >
              <div className="text-left">
                <div className="text-xs font-bold">{round.subtitleKey}</div>
                <div className={cn(
                  "text-xs",
                  currentPage === `round-${round.id}` && !round.locked
                    ? "text-white/90" 
                    : "text-gray-500 dark:text-gray-500"
                )}>{t.rounds[round.titleKey as keyof typeof t.rounds]}</div>
              </div>
              {round.locked ? (
                <Lock className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              ) : (
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  currentPage === `round-${round.id}`
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}>W{round.week}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/20">
        <nav className="p-3 space-y-1">
          <button
            onClick={() => onNavigate('leaderboard')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold",
              currentPage === 'leaderboard'
                ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30"
                : "text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 hover:text-yellow-600"
            )}
          >
            <Trophy className="w-4 h-4" />
            {t.nav.leaderboard}
          </button>

          <button
            onClick={() => onNavigate('rewards')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold",
              currentPage === 'rewards'
                ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                : "text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 hover:text-pink-600"
            )}
          >
            <Award className="w-4 h-4" />
            {t.nav.rewards}
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold",
              currentPage === 'settings'
                ? "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/30"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-300"
            )}
          >
            <Settings className="w-4 h-4" />
            {t.nav.settings}
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                logout();
                toast.success('Logged out successfully!');
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}