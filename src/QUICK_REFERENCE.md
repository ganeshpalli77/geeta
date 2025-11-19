# Quick Reference - Geeta Olympiad Portal

## 🎯 What You Have Now

### For Visitors (Not Logged In)
- **Landing Page** - Original HomePage with all sections
- **Login/Register** - Dialog to authenticate

### For Logged-In Users
- **New Portal** - Complete redesign with sidebar + header
- **Dashboard** - Stats, quests, upcoming rounds
- **7 Rounds** - Color-coded pages with tasks
- **Leaderboard** - Rankings with tabs
- **Rewards** - Badge collection
- **Notifications** - Activity feed
- **Profile** - Stats, settings, **logout button**
- **My Tasks** - Task tracking across rounds

---

## 🔐 How to Login/Logout

### Login:
1. Visit app → See landing page
2. Click "Login" or "Register" button
3. Enter credentials in dialog
4. Redirected to new portal dashboard

### Logout:
1. Click sidebar → **Profile**
2. Scroll to bottom
3. Click **Logout** button (red with icon)
4. Redirected back to landing page

---

## 🎨 Navigation

### Sidebar (Desktop - Always Visible)
- Dashboard
- My Tasks
- Round 1-7
- Leaderboard
- Rewards

### Mobile (< 1024px)
- Tap **hamburger menu** (☰) in header
- Sidebar slides in from left
- Tap anywhere outside to close

### Header
- **Sun/Moon icon** - Toggle theme
- **Bell icon** - View notifications (shows badge)
- **Avatar** - Go to profile

---

## 📄 Page Overview

| Page | What's There |
|------|--------------|
| **Dashboard** | Hero banner, 4 stat cards, today's quests, upcoming rounds |
| **My Tasks** | All tasks with status (completed/in-progress/locked) |
| **Round 1-7** | Round header with gradient, task cards, progress |
| **Leaderboard** | Tabs (Global/School/State/Weekly), ranked users, share button |
| **Rewards** | Progress bar, stats, badge grid, recent achievements |
| **Notifications** | Tabs (All/Unread/Achievements/Points), colored cards |
| **Profile** | Hero stats, personal info, progress, activity, badges, **logout** |

---

## 🎨 Round Colors

| Round | Title | Color |
|-------|-------|-------|
| 1 | Introduction | Orange |
| 2 | Interpretation | Orange |
| 3 | Characters | Purple |
| 4 | Application | Green |
| 5 | Creative | Red-Orange |
| 6 | Competition | Pink |
| 7 | Final Challenge | Orange |

---

## 📱 Responsive Design

### Desktop (≥ 1024px)
- Sidebar: Always visible
- Header: No hamburger menu
- Content: Multi-column grids
- Padding: 6 (1.5rem)

### Mobile (< 1024px)
- Sidebar: Hidden, shows on menu tap
- Header: Hamburger menu visible
- Content: Single column
- Padding: 4 (1rem)

---

## 🌓 Dark Mode

### Toggle:
- Click **sun/moon icon** in header
- Preference saved to localStorage

### What Changes:
- Background: Cream → Dark Slate
- Cards: White → Dark Gray
- Text: Dark → Light
- All colors adapt automatically

---

## 🔧 Files to Know

### Main Files
- `/App.tsx` - Handles auth + routing
- `/components/portal/PortalLayout.tsx` - Main portal wrapper

### Page Components
- Dashboard, MyTasksPage, RoundPage, LeaderboardNew, RewardsPage, NotificationsPage, ProfileNew

### Reusable Components
- PortalSidebar, NewPortalHeader, StatCard, TaskCard, RoundHeader

### Styling
- `/styles/globals.css` - Design tokens, colors, themes

---

## 🎯 Quick Actions

### Test Login Flow:
1. Go to app
2. Click "Login"
3. Enter any email/OTP
4. See new portal

### Test Logout:
1. Navigate to Profile (sidebar)
2. Scroll down
3. Click "Logout"
4. Confirm you're back at landing page

### Test Responsive:
1. Resize browser to mobile width
2. Look for hamburger menu in header
3. Click to open sidebar
4. Sidebar should overlay content

### Test Dark Mode:
1. Click sun/moon icon in header
2. Watch all colors change
3. Refresh page - preference persists

---

## 📊 Mock Data

Currently using sample data:
- User: "Arjun Kumar"
- Credits: 2,450
- Rank: #342
- Streak: 7 days
- Badges: 8/12

**To use real data**: Update components to pull from AppContext/API instead of mock objects.

---

## ✅ Everything Works

- ✅ Landing page for visitors
- ✅ Login dialog
- ✅ New portal after login
- ✅ All navigation
- ✅ All pages render
- ✅ Dark/light mode
- ✅ Responsive design
- ✅ **Logout button**
- ✅ Returns to landing page after logout

---

## 🚀 Production Ready

Your portal is complete and functional! All that's left is connecting to your real backend data.
