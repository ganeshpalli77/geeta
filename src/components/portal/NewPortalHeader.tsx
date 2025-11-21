import { Bell, User, Menu, Sun, Moon, LogOut, UserCircle, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { LanguageSelector } from '../LanguageSelector';
import { ProfileSelector } from './ProfileSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

interface NewPortalHeaderProps {
  onNavigate: (page: string) => void;
  onMenuClick?: () => void;
}

export function NewPortalHeader({ onNavigate, onMenuClick }: NewPortalHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { currentProfile, logout, user } = useApp();

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side - Menu button (mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 flex items-center justify-center transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm">🕉️</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900 dark:text-white">LearnGeeta</div>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Olympiad</div>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Profile Selector - Quick Switch */}
          {user && user.profiles && user.profiles.length > 1 && (
            <div className="hidden md:block">
              <ProfileSelector userId={user.id} compact={true} />
            </div>
          )}

          {/* Language Selector */}
          <LanguageSelector variant="compact" showLabel={false} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 flex items-center justify-center transition-colors group"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-600" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => onNavigate('notifications')}
            className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 flex items-center justify-center transition-colors relative group"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></span>
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/30"
                aria-label="Profile"
              >
                {currentProfile?.name ? (
                  <span className="text-white text-sm font-bold">
                    {currentProfile.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentProfile?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">
                    {user?.email && !user.email.includes('placeholder.com') 
                      ? user.email 
                      : user?.phone || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('profile-selection')}>
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    logout();
                    toast.success('Logged out successfully!');
                  }
                }}
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}