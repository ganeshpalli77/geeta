import { useState } from 'react';
import { Bell, Check, Award, Star, AlertCircle, Info } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

type NotificationTab = 'all' | 'unread' | 'achievements' | 'credits';

interface Notification {
  id: string;
  type: 'success' | 'achievement' | 'info' | 'warning' | 'credits' | 'error';
  icon: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    icon: '✓',
    title: 'Task Completed',
    message: 'You completed "Daily Quiz Challenge" and earned 50 credits!',
    timestamp: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'achievement',
    icon: '🏆',
    title: 'New Badge Unlocked!',
    message: 'Congratulations! You earned the "Consistent Learner" badge for maintaining a 7-day streak.',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'credits',
    icon: '⭐',
    title: 'Credits Awarded',
    message: 'You earned 100 bonus credits for completing Round 1!',
    timestamp: '3 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'info',
    icon: '🔔',
    title: 'New Round Available',
    message: 'Round 3: Characters is now unlocked. Start your journey!',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'warning',
    icon: 'ℹ️',
    title: 'Streak Reminder',
    message: 'Don\'t forget to complete today\'s task to maintain your streak!',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '6',
    type: 'error',
    icon: '⚠️',
    title: 'Submission Review',
    message: 'Your creative writing submission needs revision. Check feedback.',
    timestamp: '2 days ago',
    read: true,
  },
];

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs: { id: NotificationTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'credits', label: 'Credits' },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'achievements') return notification.type === 'achievement';
    if (activeTab === 'credits') return notification.type === 'credits';
    return true;
  });

  const getNotificationBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'achievement':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      case 'warning':
        return 'border-l-orange-500';
      case 'credits':
        return 'border-l-purple-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getNotificationBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20';
      case 'achievement':
        return 'bg-yellow-50 dark:bg-yellow-950/20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/20';
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-950/20';
      case 'credits':
        return 'bg-purple-50 dark:bg-purple-950/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Notifications</h1>
            </div>
            <p className="text-purple-100">Stay updated with your progress and achievements</p>
          </div>
          {unreadCount > 0 && (
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="font-semibold">{unreadCount} new</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-md transition-colors text-sm font-medium",
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button variant="ghost" size="sm" className="text-orange-600 dark:text-orange-400">
          Mark all as read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 rounded-xl border-l-4 transition-all",
                getNotificationBorderColor(notification.type),
                notification.read
                  ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  : getNotificationBgColor(notification.type) + " border-gray-200 dark:border-gray-800"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                  {notification.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {notification.message}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {notification.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
