import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PortalSidebar } from './PortalSidebar';
import { NewPortalHeader } from './NewPortalHeader';
import { Dashboard } from './Dashboard';
import { MyTasksPage } from './MyTasksPage';
import { Round1Page, Round2Page, Round3Page, Round4Page, Round5Page, Round6Page, Round7Page } from './RoundPage';
import { LeaderboardNew } from './LeaderboardNew';
import { RewardsPage } from './RewardsPage';
import { NotificationsPage } from './NotificationsPage';
import { ProfileNew } from './ProfileNew';
import { NewQuizPage } from './NewQuizPage';
import { EventsPage } from './EventsPage';
import { SettingsPage } from './SettingsPage';
import { cn } from '../ui/utils';

export function PortalLayout() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'my-tasks':
        return <MyTasksPage onNavigate={handleNavigate} />;
      case 'round-1':
        return <Round1Page onNavigate={handleNavigate} />;
      case 'round-2':
        return <Round2Page onNavigate={handleNavigate} />;
      case 'round-3':
        return <Round3Page onNavigate={handleNavigate} />;
      case 'round-4':
        return <Round4Page onNavigate={handleNavigate} />;
      case 'round-5':
        return <Round5Page onNavigate={handleNavigate} />;
      case 'round-6':
        return <Round6Page onNavigate={handleNavigate} />;
      case 'round-7':
        return <Round7Page onNavigate={handleNavigate} />;
      case 'leaderboard':
        return <LeaderboardNew />;
      case 'rewards':
        return <RewardsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfileNew />;
      case 'quiz':
        return <NewQuizPage />;
      case 'events':
        return <EventsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, shown as overlay when open */}
      <div className={cn(
        "fixed left-0 top-0 h-screen w-[200px] z-30 transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <PortalSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      </div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 lg:left-[200px] right-0 z-10">
        <NewPortalHeader onNavigate={handleNavigate} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      
      {/* Main Content */}
      <main className="lg:ml-[200px] mt-16 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}