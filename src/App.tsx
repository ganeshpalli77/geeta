import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { AuthPage } from './components/portal/AuthPage';
import { HomePage } from './components/portal/HomePage';
import { Header } from './components/Header';
import { PortalHeader } from './components/portal/PortalHeader';
import { DashboardPage } from './components/portal/DashboardPage';
import { NewDashboardPage } from './components/portal/NewDashboardPage';
import { ProfilePage } from './components/portal/ProfilePage';
import { QuizPage } from './components/portal/QuizPage';
import { NewQuizPage } from './components/portal/NewQuizPage';
import { EventsPage } from './components/portal/EventsPage';
import { LeaderboardPage } from './components/portal/LeaderboardPage';
import { AdminPanel } from './components/portal/AdminPanel';
import { PortalLayout } from './components/portal/PortalLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { TOAST_POSITION } from './utils/config';

function AppContent() {
  const { isAuthenticated, isAdmin, currentProfile } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Show profile creation prompt if logged in but no profile
  useEffect(() => {
    if (isAuthenticated && !isAdmin && !currentProfile && currentPage !== 'profile') {
      setCurrentPage('profile');
    }
  }, [isAuthenticated, isAdmin, currentProfile, currentPage]);

  // Close auth dialog when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthDialog(false);
    }
  }, [isAuthenticated]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthDialog(true);
  };

  // Not authenticated - show landing page with auth dialog
  if (!isAuthenticated) {
    return (
      <>
        <Header onOpenAuth={handleOpenAuth} isPortalMode={false} />
        <HomePage onOpenAuth={handleOpenAuth} />
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="max-w-md p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>{authMode === 'login' ? 'Login' : 'Register'}</DialogTitle>
              <DialogDescription>
                {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
              </DialogDescription>
            </DialogHeader>
            <AuthPage mode={authMode} onSwitchMode={handleOpenAuth} />
          </DialogContent>
        </Dialog>
        <Toaster position="bottom-right" />
      </>
    );
  }

  // Admin view
  if (isAdmin) {
    return (
      <div className="min-h-screen mandala-bg">
        <PortalHeader currentPage={currentPage} onNavigate={setCurrentPage} />
        {currentPage === 'admin' && <AdminPanel />}
        {currentPage === 'home' && <HomePage onOpenAuth={handleOpenAuth} />}
        <Toaster position="bottom-right" />
      </div>
    );
  }

  // User view - Use new portal layout
  return (
    <>
      <PortalLayout />
      <Toaster position={TOAST_POSITION} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AppProvider>
    </ThemeProvider>
  );
}