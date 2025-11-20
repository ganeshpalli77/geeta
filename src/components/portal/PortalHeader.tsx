import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../utils/translations';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Trophy,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { useState } from 'react';

interface PortalHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function PortalHeader({ currentPage, onNavigate }: PortalHeaderProps) {
  const { currentProfile, language, setLanguage, logout } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const t = useTranslation(language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'quiz', label: t('quiz'), icon: BookOpen },
    { id: 'events', label: t('events'), icon: Calendar },
    { id: 'leaderboard', label: t('leaderboard'), icon: Trophy },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center">
              <span className="text-white text-xl">ॐ</span>
            </div>
            <div>
              <h1 className="text-lg text-[#1E3A8A] dark:text-amber-400">
                Geeta Olympiad
              </h1>
              {currentProfile && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {currentProfile.name}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleNavigation(item.id)}
                  className={`relative px-4 ${
                    isActive
                      ? 'text-[#D97706] dark:text-amber-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-amber-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D97706] to-[#F59E0B]" />
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="hidden sm:flex text-gray-600 dark:text-gray-300"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </Button>

            {/* Profile Menu */}
            {currentProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-[#D97706]">
                      <AvatarFallback className="bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white">
                        {currentProfile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white">
                        {currentProfile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm">{currentProfile.name}</p>
                      <p className="text-xs text-gray-500">{currentProfile.prn}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation('profile')}>
                    <User className="w-4 h-4 mr-2" />
                    {t('profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle>Geeta Olympiad</SheetTitle>
                  <SheetDescription>
                    {currentProfile ? currentProfile.name : 'Navigation Menu'}
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? 'default' : 'ghost'}
                        onClick={() => handleNavigation(item.id)}
                        className={`justify-start ${
                          isActive
                            ? 'bg-gradient-to-r from-[#D97706] to-[#F59E0B]'
                            : ''
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}