# 🌍 Multilingual System - Complete Implementation

## Overview
The Geeta Olympiad portal now has full multilingual support with 14 Indian languages!

---

## 🗣️ Supported Languages

1. **Hindi** (हिंदी) - `hindi` / `hi`
2. **English** - `english` / `en`
3. **Marathi** (मराठी) - `marathi` / `mr`
4. **Telugu** (తెలుగు) - `telugu` / `te`
5. **Kannada** (ಕನ್ನಡ) - `kannada` / `kn`
6. **Tamil** (தமிழ்) - `tamil` / `ta`
7. **Malayalam** (മലയാളം) - `malayalam` / `ml`
8. **Gujarati** (ગુજરાતી) - `gujarati` / `gu`
9. **Bengali** (বাংলা) - `bengali` / `bn`
10. **Odia** (ଓଡ଼ିଆ) - `odia` / `or`
11. **Nepali** (नेपाली) - `nepali` / `ne`
12. **Assamese** (অসমীয়া) - `assamese` / `as`
13. **Sindhi** (سنڌي) - `sindhi` / `sd` (RTL)
14. **Manipuri** (মৈতৈলোন্) - `manipuri` / `mni`

---

## 📁 File Structure

```
/locales/
├── index.ts              # Central export & language config
├── en.ts                 # English translations (base)
├── hi.ts                 # Hindi translations (complete)
└── [other languages]     # TODO: Add remaining languages

/contexts/
└── LanguageContext.tsx   # Language state management

/utils/
├── apiProxy.ts           # Updated with language params
└── mockQuizData.ts       # Quiz questions per language
```

---

## 🔧 Implementation Details

### 1. Translation Files (`/locales/*.ts`)

Each language file exports a complete translation object:

```typescript
export const en = {
  common: { ... },
  auth: { ... },
  profile: { ... },
  nav: { ... },
  dashboard: { ... },
  rounds: { ... },
  quiz: { ... },
  events: { ... },
  puzzle: { ... },
  leaderboard: { ... },
  rewards: { ... },
  tasks: { ... },
  notifications: { ... },
  settings: { ... },
  admin: { ... },
  errors: { ... },
  success: { ... },
  time: { ... },
  languages: { ... },
};
```

### 2. Language Context (`/contexts/LanguageContext.tsx`)

Provides:
- `language` - Current selected language
- `setLanguage()` - Change language
- `t` - Translation object
- `languageConfig` - Metadata (code, name, direction, flag)

```typescript
const { language, setLanguage, t } = useLanguage();

// Use translations
<button>{t.common.save}</button>
<h1>{t.dashboard.title}</h1>
```

### 3. Language Configuration

```typescript
export const LANGUAGE_CONFIG = {
  hindi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  // ... other languages
};
```

---

## 🔌 API Integration

### All API calls now support language parameter:

```typescript
// Helper function updated
async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  language?: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Add language parameter to all requests
  if (language) {
    url.searchParams.append('language', language);
  }
  
  // ... rest of implementation
}
```

### Usage in Components:

```typescript
const { language } = useLanguage();

// API will receive ?language=hindi
const questions = await getQuizQuestions(language);
const leaderboard = await getLeaderboard('overall', language);
```

---

## 📚 Mock Data with Language Support

### Quiz Questions (`/utils/mockQuizData.ts`)

```typescript
const questionsByLanguage: Record<SupportedLanguage, QuizQuestion[]> = {
  english: englishQuestions,
  hindi: hindiQuestions,
  // ... other languages
};

// Get questions for current language
const questions = getQuizQuestions(language, {
  round: 1,
  difficulty: 'easy',
  count: 10,
});
```

### Sample Questions:

**English:**
```typescript
{
  id: 'en_q1',
  question: 'Who is the speaker of the Bhagavad Gita?',
  options: ['Arjuna', 'Krishna', 'Vyasa', 'Sanjaya'],
  correctAnswer: 1,
  difficulty: 'easy',
  round: 1,
}
```

**Hindi:**
```typescript
{
  id: 'hi_q1',
  question: 'भगवद गीता के वक्ता कौन हैं?',
  options: ['अर्जुन', 'कृष्ण', 'व्यास', 'संजय'],
  correctAnswer: 1,
  difficulty: 'easy',
  round: 1,
}
```

---

## 🎯 Usage in Components

### Example 1: Simple Text

```tsx
import { useTranslation } from '../contexts/LanguageContext';

function MyComponent() {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t.dashboard.title}</h1>
      <p>{t.dashboard.subtitle}</p>
      <button>{t.common.save}</button>
    </div>
  );
}
```

### Example 2: Language Switcher

```tsx
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES } from '../locales';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
    >
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang} value={lang}>
          {LANGUAGE_CONFIG[lang].flag} {LANGUAGE_CONFIG[lang].nativeName}
        </option>
      ))}
    </select>
  );
}
```

### Example 3: Profile Creation with Language

```tsx
import { useLanguage } from '../contexts/LanguageContext';
import { profileAPI } from '../utils/apiProxy';

function ProfileForm() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    prn: '',
    dob: '',
    preferredLanguage: language,
  });
  
  const handleSubmit = async () => {
    const profile = await profileAPI.createProfile({
      ...formData,
      userId: currentUser._id,
    });
  };
  
  return (
    <form>
      <label>{t.profile.name}</label>
      <input placeholder={t.profile.namePlaceholder} />
      
      <label>{t.profile.language}</label>
      <select 
        value={formData.preferredLanguage}
        onChange={(e) => setFormData({...formData, preferredLanguage: e.target.value})}
      >
        {/* Language options */}
      </select>
    </form>
  );
}
```

---

## 🔄 Data Flow

### User Journey:

```
1. User opens app
   ↓
2. LanguageProvider initializes
   - Checks localStorage for saved language
   - Defaults to 'english' if not found
   ↓
3. User selects language
   ↓
4. setLanguage('hindi')
   ↓
5. Updates:
   - localStorage ('preferredLanguage' = 'hindi')
   - document.documentElement.lang = 'hi'
   - document.documentElement.dir = 'ltr' (or 'rtl' for Sindhi)
   - Translation object (t) updates
   ↓
6. All components re-render with new translations
   ↓
7. API calls include ?language=hindi
   ↓
8. Backend returns Hindi content
```

---

## 🌐 RTL Support

### Sindhi Language (RTL)

```typescript
{
  sindhi: {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي',
    direction: 'rtl',  // ← Right-to-Left
    flag: '🇵🇰',
  }
}
```

When Sindhi is selected:
- `document.documentElement.dir = 'rtl'`
- Layout automatically flips
- Text flows right-to-left

---

## 📝 Translation Keys

### Complete Structure:

```typescript
{
  common: {
    loading, error, success, cancel, save, delete, edit,
    submit, back, next, close, search, filter, sort,
    noData, confirm, yes, no
  },
  
  auth: {
    welcomeTitle, welcomeSubtitle, login, signup,
    enterEmail, enterPhone, enterOtp, sendOtp,
    verifyOtp, resendOtp, emailPlaceholder,
    phonePlaceholder, otpSent, otpVerified,
    invalidOtp, adminLogin, username, password,
    loginSuccess, loginError
  },
  
  profile: {
    createProfile, editProfile, viewProfile, myProfile,
    name, prn, dob, category, language, selectLanguage,
    namePlaceholder, prnPlaceholder, categoryPlaceholder,
    profileCreated, profileUpdated, noProfiles,
    selectProfile, createNewProfile
  },
  
  nav: {
    dashboard, myTasks, leaderboard, rewards, profile,
    notifications, settings, logout, rounds
  },
  
  dashboard: {
    title, subtitle, welcome, warrior, level, xp, rank,
    nextLevel, battleStats, quizBattles, hitRate,
    fragments, missions, achievements, viewAll,
    recentActivity, quickActions, startQuiz,
    collectFragment, submitMission
  },
  
  // ... and many more
}
```

---

## 🚀 Backend Integration

### Expected API Response Format:

```typescript
// Quiz Questions
GET /api/quiz/questions?language=hindi
Response: {
  questions: [
    {
      id: 'hi_q1',
      question: 'भगवद गीता के वक्ता कौन हैं?',
      options: ['अर्जुन', 'कृष्ण', 'व्यास', 'संजय'],
      correctAnswer: 1,
      // ...
    }
  ]
}

// Leaderboard
GET /api/leaderboard/overall?language=hindi
Response: {
  entries: [
    {
      name: 'राज कुमार',
      category: 'युवा',
      // ...
    }
  ]
}

// Events
GET /api/events/videos?language=hindi
Response: {
  videos: [
    {
      title: 'श्लोक पाठ',
      description: 'भगवद्गीता अध्याय 2',
      // ...
    }
  ]
}
```

---

## 📱 Persistence

### localStorage:

```typescript
// Saved automatically on language change
localStorage.setItem('preferredLanguage', 'hindi');

// Read on app initialization
const savedLanguage = localStorage.getItem('preferredLanguage');
```

### Profile:

```typescript
// Saved in user profile
const profile = {
  name: 'User Name',
  prn: 'PRN123',
  preferredLanguage: 'hindi',  // ← Saved preference
  // ...
};
```

---

## ✅ Current Status

### ✅ Complete:
- [x] Language context & provider
- [x] Translation infrastructure
- [x] English translations (100%)
- [x] Hindi translations (100%)
- [x] Language configuration (all 14 languages)
- [x] API parameter support
- [x] Mock quiz data (English & Hindi)
- [x] RTL support (Sindhi)
- [x] localStorage persistence
- [x] HTML lang attribute
- [x] Direction support

### 🚧 In Progress:
- [ ] Translations for remaining 12 languages
- [ ] Quiz questions for all languages
- [ ] Language-specific content

### 📋 TODO:
- [ ] Add Marathi translations
- [ ] Add Telugu translations
- [ ] Add Kannada translations
- [ ] Add Tamil translations
- [ ] Add Malayalam translations
- [ ] Add Gujarati translations
- [ ] Add Bengali translations
- [ ] Add Odia translations
- [ ] Add Nepali translations
- [ ] Add Assamese translations
- [ ] Add Sindhi translations
- [ ] Add Manipuri translations

---

## 🎨 Language Selector Component

### Example Implementation:

```tsx
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES } from '../locales';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Globe className="w-5 h-5" />
        <span>{LANGUAGE_CONFIG[language].nativeName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {SUPPORTED_LANGUAGES.map(lang => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={language === lang ? 'bg-primary/10' : ''}
          >
            <span className="mr-2">{LANGUAGE_CONFIG[lang].flag}</span>
            <span>{LANGUAGE_CONFIG[lang].nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🔍 Testing

### Test Language Switching:

```typescript
// In browser console:
localStorage.setItem('preferredLanguage', 'hindi');
location.reload();

// Should show all text in Hindi
```

### Test RTL:

```typescript
localStorage.setItem('preferredLanguage', 'sindhi');
location.reload();

// Should show RTL layout
```

---

## 📊 Translation Coverage

| Language | UI | Quiz | Events | Status |
|----------|-----|------|--------|--------|
| English | 100% | ✅ | ✅ | Complete |
| Hindi | 100% | ✅ | ✅ | Complete |
| Marathi | 0% | ❌ | ❌ | Pending |
| Telugu | 0% | ❌ | ❌ | Pending |
| Kannada | 0% | ❌ | ❌ | Pending |
| Tamil | 0% | ❌ | ❌ | Pending |
| Malayalam | 0% | ❌ | ❌ | Pending |
| Gujarati | 0% | ❌ | ❌ | Pending |
| Bengali | 0% | ❌ | ❌ | Pending |
| Odia | 0% | ❌ | ❌ | Pending |
| Nepali | 0% | ❌ | ❌ | Pending |
| Assamese | 0% | ❌ | ❌ | Pending |
| Sindhi | 0% | ❌ | ❌ | Pending |
| Manipuri | 0% | ❌ | ❌ | Pending |

---

## 🎯 Result

**The Geeta Olympiad portal now has a complete multilingual foundation!**

✅ **14 Indian languages supported**
✅ **Full translation infrastructure**
✅ **API language parameter support**
✅ **RTL support for Sindhi**
✅ **Persistent language selection**
✅ **Easy to add new languages**
✅ **Easy to use in components**
✅ **Mock data with language support**

**All that's needed now is to add translations for the remaining 12 languages!** 🌍🚀
