import { Globe, Moon, Sun, Bell, Lock, Info } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES } from '../../locales';
import { Card } from '../ui/card';
import { cn } from '../ui/utils';

export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white flex items-center gap-3">
          {t.settings.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your portal experience
        </p>
      </div>

      {/* Language Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white">{t.settings.language}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred language
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left hover:shadow-md",
                language === lang
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{LANGUAGE_CONFIG[lang].flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {LANGUAGE_CONFIG[lang].nativeName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {LANGUAGE_CONFIG[lang].name}
                  </div>
                </div>
                {language === lang && (
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
            {isDark ? (
              <Moon className="w-5 h-5 text-white" />
            ) : (
              <Sun className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white">{t.settings.theme}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Switch between light and dark mode
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => !isDark && toggleTheme()}
            className={cn(
              "p-4 rounded-xl border-2 transition-all text-left hover:shadow-md",
              !isDark
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-md"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {t.settings.lightMode}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Bright theme
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => isDark && toggleTheme()}
            className={cn(
              "p-4 rounded-xl border-2 transition-all text-left hover:shadow-md",
              isDark
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-md"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {t.settings.darkMode}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Dark theme
                </div>
              </div>
            </div>
          </button>
        </div>
      </Card>

      {/* Notifications Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white">{t.settings.notifications}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Quiz Reminders
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Get notified about new quizzes
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Event Updates
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updates on your submissions
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Leaderboard Changes
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                When your rank changes
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </label>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white">{t.settings.about}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Application information
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">{t.settings.version}</span>
            <span className="font-semibold text-gray-900 dark:text-white">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">Platform</span>
            <span className="font-semibold text-gray-900 dark:text-white">Geeta Olympiad</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">Build</span>
            <span className="font-semibold text-gray-900 dark:text-white">Production</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
