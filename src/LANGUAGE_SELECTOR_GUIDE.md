# 🌍 Language Selector - User Guide

## Where to Find Language Selection

The Geeta Olympiad portal now has **multiple ways** to change your language preference!

---

## 🎯 Option 1: Header Globe Icon (Quick Access)

**Location:** Top right corner of every page, next to theme toggle

**How to use:**
1. Look for the 🌐 **Globe icon** in the header
2. Click on it
3. A dropdown appears with all 14 languages
4. Click on your preferred language
5. The entire portal instantly switches to that language!

**Features:**
- ✅ Always visible (on every page)
- ✅ Quick access dropdown
- ✅ Shows language flags 🇮🇳🇬🇧
- ✅ Shows both English and native names
- ✅ Current language is highlighted with a checkmark ✓

---

## 🎯 Option 2: Settings Page (Full Control)

**Location:** Sidebar → Settings (bottom)

**How to use:**
1. Click **"Settings"** in the sidebar
2. First section shows **"Language"** with globe icon
3. All 14 languages are displayed as cards
4. Click on any language card to select it
5. Selected language is highlighted with colored border

**Features:**
- ✅ Visual language selection cards
- ✅ Large flags and names
- ✅ Active language clearly highlighted
- ✅ Also shows Theme settings, Notifications, and About

---

## 🗣️ Available Languages

| Flag | Native Name | English Name | Code |
|------|-------------|--------------|------|
| 🇮🇳 | हिंदी | Hindi | hi |
| 🇬🇧 | English | English | en |
| 🇮🇳 | मराठी | Marathi | mr |
| 🇮🇳 | తెలుగు | Telugu | te |
| 🇮🇳 | ಕನ್ನಡ | Kannada | kn |
| 🇮🇳 | தமிழ் | Tamil | ta |
| 🇮🇳 | മലയാളം | Malayalam | ml |
| 🇮🇳 | ગુજરાતી | Gujarati | gu |
| 🇮🇳 | বাংলা | Bengali | bn |
| 🇮🇳 | ଓଡ଼ିଆ | Odia | or |
| 🇳🇵 | नेपाली | Nepali | ne |
| 🇮🇳 | অসমীয়া | Assamese | as |
| 🇵🇰 | سنڌي | Sindhi | sd |
| 🇮🇳 | মৈতৈলোন্ | Manipuri | mni |

---

## 🎨 UI Components

### Header Globe Button

```
┌─────────────────────────────────────────────┐
│  🕉️ LearnGita    [🌐] [🌙] [🔔] [👤]        │
└─────────────────────────────────────────────┘
                    ↑
               Click here!
```

### Language Dropdown

```
┌────────────────────────────────┐
│  SELECT LANGUAGE               │
├────────────────────────────────┤
│  🇮🇳  हिंदी                     │
│      Hindi                   ✓ │ ← Current
├────────────────────────────────┤
│  🇬🇧  English                   │
│      English                   │
├────────────────────────────────┤
│  🇮🇳  मराठी                     │
│      Marathi                   │
└────────────────────────────────┘
```

### Settings Page Language Cards

```
┌─────────────────────────────────────────────┐
│  🌐 Language                                │
│  Choose your preferred language             │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 🇮🇳       │  │ 🇬🇧       │  │ 🇮🇳       │ │
│  │ हिंदी    │  │ English  │  │ मराठी     │ │
│  │ Hindi  ● │  │ English  │  │ Marathi  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│       ↑                                     │
│   Selected                                  │
└─────────────────────────────────────────────┘
```

---

## 🔄 What Happens When You Change Language?

### Instant Changes:

1. **All UI Text** - Buttons, labels, headings
2. **Navigation** - Sidebar, header, menu items
3. **Dashboard** - Warrior stats, battle info
4. **Quiz Questions** - Questions and options in your language
5. **Leaderboard** - Column headers and labels
6. **Forms** - Profile creation, event submissions
7. **Error Messages** - Validation and errors
8. **Success Messages** - Confirmations

### Persistent:

- ✅ **Saved to localStorage** - Your choice is remembered
- ✅ **Survives page reload** - Don't need to select again
- ✅ **Profile preference** - Can be saved in your profile

---

## 💡 Pro Tips

### Tip 1: Quick Switch
Use the header globe icon for fastest language switching!

### Tip 2: Visual Selection
Use Settings page to see all languages at once with big cards

### Tip 3: Try Different Languages
Your selection is saved, so feel free to explore different languages!

### Tip 4: RTL Support
If you select **Sindhi**, the entire layout will flip to right-to-left!

---

## 🎯 Translation Status

### ✅ Fully Translated:
- **English** - 100% complete
- **Hindi** - 100% complete (हिंदी में पूर्ण)

### 🔄 Using English Fallback:
- Marathi, Telugu, Kannada, Tamil, Malayalam
- Gujarati, Bengali, Odia, Nepali
- Assamese, Sindhi, Manipuri

**Note:** Languages without full translations will show English text. We're working on completing all translations!

---

## 🌐 Technical Details

### How It Works:

```typescript
// Simple usage in any component
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t.dashboard.title}</h1>
      <button onClick={() => setLanguage('hindi')}>
        हिंदी में बदलें
      </button>
    </div>
  );
}
```

### Persistence:

```javascript
// Automatically saved
localStorage.setItem('preferredLanguage', 'hindi');

// Automatically loaded on app start
const savedLanguage = localStorage.getItem('preferredLanguage');
```

---

## 📱 Mobile Experience

### Mobile (< 1024px):

```
┌─────────────────────────┐
│  ☰  🕉️    [🌐][🌙][🔔][👤] │
│                         │
│  Click 🌐 for languages │
└─────────────────────────┘
```

- Globe icon always visible
- Dropdown adapts to screen size
- Settings page is mobile-optimized
- Language cards stack vertically

---

## 🎨 Design Features

### Header Globe Icon:
- Compact 40x40px button
- Hover effect: Light indigo background
- Smooth transitions
- Accessible with keyboard

### Language Dropdown:
- Max height with scroll for 14 languages
- Each language shows:
  - Flag emoji
  - Native name (large, bold)
  - English name (small, gray)
  - Checkmark for current language
- Hover highlights each option

### Settings Page Cards:
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Active language has:
  - Indigo border
  - Light background
  - Pulsing indicator dot

---

## ✅ Accessibility

### Keyboard Navigation:
- Tab to focus on globe button
- Enter to open dropdown
- Arrow keys to navigate languages
- Enter to select

### Screen Readers:
- Globe button has `aria-label="Change language"`
- HTML `lang` attribute updates automatically
- Direction (`dir`) updates for RTL languages

---

## 🎉 Summary

**The language selector is now available in 2 convenient locations:**

1. **Header Globe Icon** 🌐 - Quick access, always visible
2. **Settings Page** ⚙️ - Full control with visual cards

**Features:**
- ✅ 14 Indian languages supported
- ✅ Instant switching
- ✅ Persistent selection
- ✅ Beautiful UI
- ✅ Mobile-friendly
- ✅ Fully accessible
- ✅ RTL support

**Try it now!** Click the 🌐 globe icon in the top right corner! 🚀
