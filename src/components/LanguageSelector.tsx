import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES, SupportedLanguage } from '../locales';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface LanguageSelectorProps {
  variant?: 'button' | 'compact';
  showLabel?: boolean;
}

export function LanguageSelector({ variant = 'button', showLabel = true }: LanguageSelectorProps) {
  const { language, setLanguage, languageConfig } = useLanguage();

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 flex items-center justify-center transition-colors group"
            aria-label="Change language"
          >
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Select Language
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "flex items-center justify-between cursor-pointer py-2.5",
                  language === lang && "bg-indigo-50 dark:bg-indigo-950/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{LANGUAGE_CONFIG[lang].flag}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {LANGUAGE_CONFIG[lang].nativeName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {LANGUAGE_CONFIG[lang].name}
                    </div>
                  </div>
                </div>
                {language === lang && (
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border-gray-200 dark:border-gray-700"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xl">{languageConfig.flag}</span>
          {showLabel && (
            <span className="font-semibold">{languageConfig.nativeName}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Select Language
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "flex items-center justify-between cursor-pointer py-2.5",
                language === lang && "bg-indigo-50 dark:bg-indigo-950/30"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{LANGUAGE_CONFIG[lang].flag}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {LANGUAGE_CONFIG[lang].nativeName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {LANGUAGE_CONFIG[lang].name}
                  </div>
                </div>
              </div>
              {language === lang && (
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
