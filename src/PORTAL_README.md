# Geeta Olympiad Web Portal

## Overview
A comprehensive, multilingual web portal for the Geeta Olympiad spiritual learning competition, featuring interactive events, quizzes, gamification, and admin management.

## Features

### 🔐 Authentication
- **SSO Login**: Email or Phone OTP authentication (Demo OTP: `1234`)
- **Admin Login**: Username: `admin`, Password: `admin123`
- **Multiple Profiles**: Create and manage multiple profiles per user account

### 👤 User Module
- **Profile Management**: Create, edit, and switch between profiles
- **Profile Fields**: Name, PRN, Date of Birth, Preferred Language (English/Hindi)
- **Dashboard**: Comprehensive overview with stats, scores, and activity tracking
- **Language Support**: Full multilingual support with English and Hindi

### 📚 Quiz Module
- **Mock Quiz**: 30 questions (10 easy, 15 medium, 5 hard) - 30 minutes
- **Quiz 1**: 30 questions - 30 minutes
- **Quiz 2**: 40 questions (10 easy, 20 medium, 10 hard) - 40 minutes
- **Quiz 3**: 50 questions (15 easy, 20 medium, 15 hard) - 50 minutes
- **Question Pool**: 500+ MCQs about Bhagavad Gita with multiple difficulty levels
- **Features**:
  - Timer-based auto-submission
  - Random question selection without repetition
  - Skip and navigate between questions
  - Detailed results and scoring
  - Difficulty-based scoring (Easy: 1pt, Medium: 2pt, Hard: 3pt)

### 🎬 Events Module

#### Video/Reel Submission
- Submit videos from YouTube, Instagram, Facebook, Twitter, or other platforms
- Admin review and credit score assignment
- Track submission status (Pending/Approved/Rejected)

#### Slogan Creation
- Submit multiple creative slogans about Bhagavad Gita
- Admin evaluation and scoring
- Maximum 200 characters per slogan

#### Image Reveal Game
- Collect 1 puzzle piece per day
- 45 total pieces to complete the image
- Scoring:
  - +10 points per piece collected
  - +100 bonus points for completing all 45 pieces
  - Maximum: 550 points

### 🏆 Leaderboard Module
- **Overall Leaderboard**: All-time cumulative scores
- **Weekly Leaderboard**: Top scorers in the last 7 days
- **Tie-breaker Rules**: Quiz scores > Event scores
- **Rankings**: Top 3 highlighted with special badges
- **Statistics**: Total participants, highest score, average score

### 👨‍💼 Admin Module
- **User Management**: View all users and their profiles
- **Video Review**: Approve/reject video submissions and assign scores (0-100)
- **Slogan Review**: Approve/reject slogans and assign scores (0-50)
- **Dashboard**: Overview of system statistics
- **Reports**: User participation, event submissions, quiz attempts

## Technical Details

### Technology Stack
- **Frontend**: React, TypeScript
- **UI Framework**: Tailwind CSS v4.0
- **Components**: Shadcn/UI
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: LocalStorage (frontend-only implementation)
- **Fonts**: 
  - Poppins (English text)
  - Noto Sans Devanagari (Hindi text)
  - Baloo 2 (Portal UI)

### Design System
- **Colors**:
  - Orange: #D55328
  - Blue: #193C77
  - Golden Yellow: #E8C56E
  - Beige: #FFF8ED
  - Brown: #822A12
  - White: #FFFFFF
- **Border Radius**: 
  - Buttons: 25px
  - Cards: 16px
- **Layout**: 1440px max width, 80px horizontal padding, 120px section spacing

### Data Structure

#### User Profile
```typescript
{
  id: string;
  name: string;
  prn: string;
  dob: string;
  preferredLanguage: 'en' | 'hi';
  createdAt: string;
}
```

#### Quiz Attempt
```typescript
{
  id: string;
  profileId: string;
  type: 'mock' | 'quiz1' | 'quiz2' | 'quiz3';
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
}
```

## Usage Guide

### For Users

1. **Login**: Use email or phone with OTP (demo: `1234`)
2. **Create Profile**: Fill in name, PRN, DOB, and preferred language
3. **Dashboard**: View your stats and collect daily puzzle pieces
4. **Take Quizzes**: Navigate to Quiz page and start available quizzes
5. **Participate in Events**: Submit videos, create slogans, collect puzzle pieces
6. **Check Leaderboard**: See your ranking among all participants
7. **Switch Profiles**: Manage multiple profiles from Profile page

### For Admins

1. **Login**: Username: `admin`, Password: `admin123`
2. **Review Submissions**: Go to Admin Panel
3. **Score Videos**: Enter score (0-100) and approve/reject
4. **Score Slogans**: Enter score (0-50) and approve/reject
5. **View Reports**: Check user statistics and participation

## Gamification Elements

- **Daily Puzzle Collection**: Encourages daily engagement
- **Progressive Rewards**: Unlock pieces gradually over 45 days
- **Competitive Leaderboards**: Weekly and overall rankings
- **Multiple Quiz Attempts**: Mock quiz for practice, 3 official quizzes
- **Score Multipliers**: Harder questions worth more points
- **Achievement Milestones**: Complete puzzle for bonus 100 points

## Security Features

- OTP-based authentication
- Session management via context
- Input validation for all forms
- Secure localStorage usage
- XSS prevention through React

## Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly buttons (25px border radius)
- Adaptive navigation (hamburger menu on mobile)
- Optimized for all screen sizes

## Future Enhancements (Requires Backend)

- Real Supabase integration for production
- Real-time leaderboard updates
- SMS/WhatsApp OTP integration
- Email notifications
- File upload for videos
- Advanced analytics dashboard
- Export reports functionality
- Social sharing features

## Notes

- This is a frontend-only implementation using localStorage
- OTP is mocked (always use `1234`)
- All data persists in browser localStorage
- Clearing browser data will reset all progress
- Not suitable for production without proper backend integration
- Should not be used for collecting PII or sensitive data in production

## Demo Credentials

### User Login
- **Email**: any@email.com
- **Phone**: +91 1234567890
- **OTP**: 1234

### Admin Login
- **Username**: admin
- **Password**: admin123

## Support

For questions or issues, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for Geeta Olympiad**
