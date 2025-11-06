import { useState } from 'react';
import { Button } from './ui/button';
import geetaParivarLogo from 'figma:asset/ed1389060fec7b047c20c2280d90378f169a3725.png';
import learnGeetaLogo from 'figma:asset/ed490f058240e311ed9a1717bca41bcdbe4954ba.png';
import { Menu, LogIn, UserPlus, X, Home, LayoutDashboard, Trophy, User, LogOut, Globe, Shield, BookOpen, Sparkles, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from '../utils/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface HeaderProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
  // Portal-specific props (when user is authenticated)
  currentPage?: string;
  onNavigate?: (page: string) => void;
  isPortalMode?: boolean;
}

export function Header({ onOpenAuth, currentPage, onNavigate, isPortalMode = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQuizWarning, setShowQuizWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  
  // Only use context if in portal mode
  const appContext = isPortalMode ? useApp() : null;
  const { logout, changeLanguage, language, currentProfile, isAdmin, quizInProgress, isAuthenticated } = appContext || {};
  const t = isPortalMode && language ? useTranslation(language) : null;

  // Portal navigation items
  // Disable dashboard, quiz, events, leaderboard for logged-in users
  const navItems = isPortalMode && isAdmin
    ? [
        { id: 'admin', label: t?.('admin') || 'Admin', icon: Shield },
        { id: 'home', label: t?.('home') || 'Home', icon: Home },
      ]
    : isPortalMode && isAuthenticated
    ? [
        // Only show Home for logged-in users - dashboard, quiz, events, leaderboard are disabled
        { id: 'home', label: t?.('home') || 'Home', icon: Home },
      ]
    : [];

  const handleNavClick = (pageId: string) => {
    // If quiz is in progress and trying to navigate away from quiz page, show warning
    if (quizInProgress && currentPage === 'quiz' && pageId !== 'quiz') {
      setPendingNavigation(pageId);
      setShowQuizWarning(true);
      return;
    }

    if (onNavigate) {
      onNavigate(pageId);
    }
    setMobileMenuOpen(false);
  };

  // Portal mode (authenticated user)
  if (isPortalMode) {
    return (
      <header className="w-full bg-white text-[#193C77] shadow-lg sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Logos */}
            <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 cursor-pointer" onClick={() => handleNavClick('home')}>
              <img
                src={geetaParivarLogo}
                alt="Geeta Parivar Logo"
                className="h-10 sm:h-14 lg:h-16 w-auto"
              />
              <img
                src={learnGeetaLogo}
                alt="Learn Geeta"
                className="h-7 sm:h-9 lg:h-10 w-auto"
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Switcher */}
              {language && changeLanguage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-[#B54520] hover:bg-[#B54520] hover:text-white rounded-[25px] font-bold">
                      <Globe className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'हिं'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    <DropdownMenuItem onClick={() => changeLanguage('en')}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage('hi')}>
                      हिंदी
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Profile Menu (Non-admin) */}
              {!isAdmin && currentProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden sm:flex text-[#B54520] hover:bg-[#B54520] hover:text-white rounded-[25px] font-bold">
                      <User className="w-4 h-4 mr-2" />
                      {currentProfile.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuLabel>{currentProfile.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavClick('profile')}>
                      <User className="w-4 h-4 mr-2" />
                      {t?.('profile') || 'Profile'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t?.('logout') || 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Admin Logout (Desktop) */}
              {isAdmin && logout && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:flex text-[#B54520] hover:bg-[#B54520] hover:text-white rounded-[25px] font-bold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t?.('logout') || 'Logout'}
                </Button>
              )}

              {/* Hamburger Menu with Sheet */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 hover:bg-[#B54520] rounded-lg transition-colors font-bold">
                    <Menu className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#B54520] hover:text-white" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white border-l-2">
                  <SheetHeader>
                  <SheetTitle className="text-left text-[#B54520] font-bold">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-6">
                    {/* Navigation Items */}
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        disabled={quizInProgress && currentPage === 'quiz' && item.id !== 'quiz'}
                        className={`flex items-center gap-3 px-4 py-3 rounded-[25px] transition-colors text-left ${
                          currentPage === item.id
                            ? 'bg-[#B54520] text-white'
                            : quizInProgress && currentPage === 'quiz' && item.id !== 'quiz'
                            ? 'text-gray-400 cursor-not-allowed opacity-50'
                            : 'text-gray-700 hover:bg-[#B54520] hover:text-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-bold">{item.label}</span>
                      </button>
                    ))}

                    {/* Mobile Profile (for non-admin) */}
                    {!isAdmin && currentProfile && (
                      <>
                        <div className="border-t border-gray-300 my-4"></div>
                        <button
                          onClick={() => handleNavClick('profile')}
                          disabled={quizInProgress && currentPage === 'quiz'}
                          className={`flex items-center gap-3 px-4 py-3 rounded-[25px] transition-colors text-left sm:hidden ${
                            quizInProgress && currentPage === 'quiz'
                              ? 'text-gray-400 cursor-not-allowed opacity-50'
                              : 'text-gray-700 hover:bg-[#B54520] hover:text-white'
                          }`}
                        >
                          <User className="w-5 h-5" />
                          <span className="font-bold">{t?.('profile') || 'Profile'}</span>
                        </button>
                      </>
                    )}

                    {/* Logout */}
                    {logout && (
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-[25px] text-gray-700 hover:bg-[#B54520] hover:text-white transition-colors text-left sm:hidden"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold">{t?.('logout') || 'Logout'}</span>
                      </button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Quiz Warning Dialog */}
        <AlertDialog open={showQuizWarning} onOpenChange={setShowQuizWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#B54520]" />
                Quiz in Progress
              </AlertDialogTitle>
              <AlertDialogDescription>
                You have a quiz in progress. If you navigate away, your quiz progress will be lost and you won't be able to submit it.
                <span className="block mt-2 text-[#B54520]">
                  Please finish and submit your quiz before navigating to other pages.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
    );
  }

  // Landing page mode (not authenticated)
  return (
    <header className="w-full h-[80px] sm:h-[90px] lg:h-[100px] bg-white flex items-center justify-between px-4 sm:px-8 lg:px-20 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
        {/* Geeta Parivar Logo */}
        <img
          src={geetaParivarLogo}
          alt="Geeta Parivar Logo"
          className="h-12 sm:h-16 lg:h-20 w-auto"
        />
        {/* LearnGeeta Logo */}
        <img
          src={learnGeetaLogo}
          alt="Learn Geeta"
          className="h-8 sm:h-10 lg:h-12 w-auto"
        />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {onOpenAuth && (
          <>
            <Button 
              variant="outline"
              onClick={() => onOpenAuth('login')}
              className="hidden sm:flex border-[#B54520] text-[#B54520] hover:bg-[#B54520] hover:text-white rounded-[25px] px-4 lg:px-6 font-bold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button 
              onClick={() => onOpenAuth('register')}
              className="bg-[#B54520] hover:bg-[#9C3B1B] rounded-[25px] px-4 sm:px-6 font-bold"
            >
              <UserPlus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Register</span>
            </Button>
          </>
        )}
        {!onOpenAuth && (
          <Button className="bg-[#B54520] hover:bg-[#9C3B1B] rounded-[25px] px-4 sm:px-6 font-bold">
            Register
          </Button>
        )}
      </div>
    </header>
  );
}
