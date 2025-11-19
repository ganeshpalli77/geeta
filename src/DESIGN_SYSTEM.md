# Geeta Olympiad Portal - Design System Documentation

## Overview
This design system recreates the Geeta Olympiad portal with a clean, modern interface featuring a sidebar navigation, color-coded rounds, and comprehensive user engagement features.

---

## Color Palette

### Primary Colors
- **Orange/Saffron**: Primary brand color used throughout
  - Light: `#FF6B35`, `#F97316`, `#FB923C`
  - Accent: `#F59E0B`, `#FBBF24`

### Round-Specific Colors
Each round has a unique gradient:
1. **Round 1 (Introduction)**: Orange `#FF6B35` → `#F97316`
2. **Round 2 (Interpretation)**: Orange `#FF8C42` → `#FB923C`
3. **Round 3 (Characters)**: Purple `#8B5CF6` → `#A855F7`
4. **Round 4 (Application)**: Green `#10B981` → `#059669`
5. **Round 5 (Creative)**: Red-Orange `#EF4444` → `#F97316`
6. **Round 6 (Competition)**: Pink `#EC4899` → `#DB2777`
7. **Round 7 (Final Challenge)**: Orange `#FF6B35` → `#F59E0B`

### Background Colors
- **Light Mode**: `#FFFBEB` (cream/beige)
- **Dark Mode**: `#0F172A` (dark slate)
- **Card Background Light**: `#FFFFFF`
- **Card Background Dark**: `#1E293B`

---

## Typography

### Font Family
- **Primary**: Poppins (sans-serif)
- **Devanagari**: Noto Sans Devanagari
- **Accent**: Baloo 2

### Font Sizes
Managed by Tailwind's default scale and CSS variables in `globals.css`.

---

## Components Library

### 1. **PortalSidebar**
**Location**: `/components/portal/PortalSidebar.tsx`

**Description**: Fixed left sidebar navigation with logo, main nav, rounds list, and bottom nav.

**Features**:
- Logo with icon and text
- Dashboard and My Tasks buttons
- Expandable Rounds section (7 rounds)
- Bottom navigation (Leaderboard, Rewards)
- Active state highlighting
- Responsive (hidden on mobile, shown as overlay)

**Usage**:
```tsx
<PortalSidebar 
  currentPage="dashboard" 
  onNavigate={(page) => setCurrentPage(page)} 
/>
```

---

### 2. **NewPortalHeader**
**Location**: `/components/portal/NewPortalHeader.tsx`

**Description**: Top header with logo, theme toggle, notifications, and profile.

**Features**:
- Mobile menu toggle button
- Logo (hidden text on small screens)
- Theme switcher (Sun/Moon icons)
- Notification bell with unread indicator
- Profile avatar with initial

**Props**:
- `onNavigate`: Function to handle navigation
- `onMenuClick`: Optional function for mobile menu toggle

**Usage**:
```tsx
<NewPortalHeader 
  onNavigate={setCurrentPage}
  onMenuClick={() => setSidebarOpen(!sidebarOpen)}
/>
```

---

### 3. **StatCard**
**Location**: `/components/portal/StatCard.tsx`

**Description**: Dashboard statistics card with icon, label, and value.

**Props**:
- `icon`: Lucide icon component
- `label`: Text label (e.g., "Credits")
- `value`: Numeric or string value
- `color`: 'orange' | 'blue' | 'green' | 'purple'

**Variants**:
- Orange (default) - for credits, streak
- Blue - for missions
- Green - for achievements
- Purple - for rankings

**Usage**:
```tsx
<StatCard 
  icon={Coins} 
  label="Credits" 
  value={2450} 
  color="orange" 
/>
```

---

### 4. **TaskCard**
**Location**: `/components/portal/TaskCard.tsx`

**Description**: Interactive card for quests and activities.

**Features**:
- Icon (Lucide component or emoji)
- Title and description
- Difficulty badge (Easy/Medium/Hard)
- Credit reward badge
- Arrow icon on hover
- Hover effects (border color change, shadow)

**Props**:
- `icon`: Icon component or emoji string
- `title`: Task name
- `description`: Task description
- `difficulty`: 'Easy' | 'Medium' | 'Hard' (optional)
- `credits`: Number of credits awarded
- `onClick`: Click handler

**Usage**:
```tsx
<TaskCard 
  icon={BookOpen}
  title="Daily Quiz Challenge"
  description="Test your knowledge with 10 questions"
  difficulty="Medium"
  credits={50}
  onClick={() => startQuiz()}
/>
```

---

### 5. **RoundHeader**
**Location**: `/components/portal/RoundHeader.tsx`

**Description**: Gradient header for round pages showing progress.

**Features**:
- Round-specific gradient background
- Week indicator
- Round title
- Progress stats (tasks completed)
- Completion percentage

**Props**:
- `roundNumber`: 1-7
- `title`: Round name
- `week`: Week number
- `progress`: Tasks completed (optional)
- `totalTasks`: Total tasks (optional)

**Usage**:
```tsx
<RoundHeader 
  roundNumber={1}
  title="Introduction"
  week={1}
  progress={2}
  totalTasks={5}
/>
```

---

### 6. **LeaderboardCard**
**Location**: `/components/portal/LeaderboardNew.tsx` (internal component)

**Description**: User ranking card with medal, avatar, info, and score.

**Features**:
- Medal icons for top 3 (🥇🥈🥉)
- Rank number for others
- User avatar (emoji)
- Name and school
- Score and badge count
- Highlighted state for current user

---

### 7. **BadgeCard**
**Location**: `/components/portal/RewardsPage.tsx` (internal component)

**Description**: Badge display card showing earned vs locked states.

**States**:
- **Earned**: Gradient background, checkmark, full opacity
- **Locked**: Gray background, reduced opacity

**Features**:
- Large emoji icon
- Badge name
- Description text
- Checkmark for earned badges

---

### 8. **NotificationCard**
**Location**: `/components/portal/NotificationsPage.tsx` (internal component)

**Description**: Notification item with colored border and icon.

**Features**:
- Left border color coding by type
- Icon emoji
- Title and message
- Timestamp
- Unread indicator dot
- Background color for unread

**Types**:
- Success (green)
- Achievement (yellow)
- Info (blue)
- Warning (orange)
- Points (purple)
- Error (red)

---

### 9. **ProgressBar**
**Location**: Uses shadcn/ui Progress component

**Description**: Horizontal progress indicator.

**Usage**:
```tsx
<Progress value={75} className="h-2" />
```

---

### 10. **TabNavigation**
**Location**: Used in Leaderboard and Notifications pages

**Description**: Tab switcher for filtering content.

**Features**:
- Multiple tabs
- Active state highlighting
- Smooth transitions

**Usage**:
```tsx
<div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
  {tabs.map((tab) => (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={cn(
        "px-4 py-2 rounded-md transition-colors",
        activeTab === tab.id ? "bg-white shadow-sm" : "text-gray-600"
      )}
    >
      {tab.label}
    </button>
  ))}
</div>
```

---

## Pages

### 1. **Dashboard**
- Hero banner with greeting
- 4 stat cards (Credits, Streak, Missions, Rank)
- Today's Quests section
- Upcoming Adventures preview

### 2. **Round Pages (1-7)**
- Round-specific gradient header
- Task list with TaskCards
- Progress tracking

### 3. **Leaderboard**
- Tab navigation (Global, School, State, Weekly)
- Ranked user cards
- Current user highlighting
- Share rank button

### 4. **Rewards & Badges**
- Collection progress bar
- Quick stats (Badges, Points, Streak)
- Badge grid (earned vs locked)
- Recent achievements timeline

### 5. **Notifications**
- Tab filters (All, Unread, Achievements, Points)
- Notification cards with color coding
- Mark all as read button
- Unread count indicator

### 6. **Profile**
- Hero section with avatar and stats
- Personal information grid
- Olympiad progress stats
- Activity summary with progress bars
- Recent badges grid
- Settings options
- Logout button

---

## Responsive Behavior

### Breakpoints
- **Mobile**: < 1024px
- **Desktop**: ≥ 1024px

### Mobile Adaptations
1. **Sidebar**: Hidden by default, shown as overlay when menu is clicked
2. **Header**: 
   - Shows hamburger menu button
   - Hides logo text on very small screens
3. **Content**: 
   - Reduced padding (p-4 instead of p-6)
   - No left margin
4. **Grids**: 
   - Stats: 1 column → 2 columns → 4 columns
   - Badges: 2 columns → 4 columns
   - Task cards: Always full width

---

## Dark Mode

All components support dark mode using Tailwind's `dark:` variant.

### Key Dark Mode Colors
- Background: `#0F172A`
- Cards: `#1E293B`
- Borders: `#334155`
- Text: `#F1F5F9`

---

## Accessibility

- All interactive elements have hover states
- Icon buttons include `aria-label`
- Sufficient color contrast ratios
- Focus states visible
- Keyboard navigation support

---

## Animation & Effects

### Hover Effects
- Cards: Border color change + shadow
- Buttons: Background color change
- Task cards: Arrow icon color change

### Transitions
- Sidebar: `transform` transition for mobile overlay
- Theme toggle: Smooth icon swap
- All interactive elements: `transition-colors`

---

## File Structure

```
/components/portal/
├── PortalLayout.tsx          # Main layout wrapper
├── PortalSidebar.tsx          # Left sidebar navigation
├── NewPortalHeader.tsx        # Top header
├── Dashboard.tsx              # Dashboard page
├── RoundPage.tsx              # Round pages (1-7)
├── LeaderboardNew.tsx         # Leaderboard page
├── RewardsPage.tsx            # Rewards & badges page
├── NotificationsPage.tsx      # Notifications page
├── ProfileNew.tsx             # Profile page
├── StatCard.tsx               # Stat card component
├── TaskCard.tsx               # Task card component
└── RoundHeader.tsx            # Round header component
```

---

## Usage Example

```tsx
import { PortalLayout } from './components/portal/PortalLayout';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <PortalLayout />
      </AppProvider>
    </ThemeProvider>
  );
}
```

---

## Future Enhancements

- Add animations (task completion, badge unlock)
- Implement puzzle piece collection modal
- Create quiz interface components
- Add task detail pages
- Implement real-time notifications
- Add confetti/celebration effects
- Create onboarding flow
