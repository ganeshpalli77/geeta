/**
 * English Translations
 * Geeta Olympiad Portal
 */

export const en = {
  // Common
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    submit: "Submit",
    back: "Back",
    next: "Next",
    close: "Close",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    noData: "No data available",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
  },

  // Auth Pages
  auth: {
    welcomeTitle: "Welcome to Geeta Olympiad",
    welcomeSubtitle: "Join thousands learning the wisdom of Bhagavad Geeta",
    login: "Login",
    signup: "Sign Up",
    enterEmail: "Enter your email",
    enterPhone: "Enter your phone number",
    enterOtp: "Enter OTP",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    resendOtp: "Resend OTP",
    emailPlaceholder: "your.email@example.com",
    phonePlaceholder: "+91 XXXXXXXXXX",
    otpSent: "OTP sent successfully",
    otpVerified: "OTP verified successfully",
    invalidOtp: "Invalid OTP",
    adminLogin: "Admin Login",
    username: "Username",
    password: "Password",
    loginSuccess: "Login successful",
    loginError: "Login failed",
  },

  // Profile
  profile: {
    createProfile: "Create Profile",
    editProfile: "Edit Profile",
    viewProfile: "View Profile",
    myProfile: "My Profile",
    name: "Name",
    prn: "Participant Registration Number (PRN)",
    dob: "Date of Birth",
    category: "Category / School Name",
    language: "Preferred Language",
    selectLanguage: "Select Language",
    namePlaceholder: "Enter your full name",
    prnPlaceholder: "Enter your PRN",
    categoryPlaceholder: "Enter your school name or category",
    profileCreated: "Profile created successfully",
    profileUpdated: "Profile updated successfully",
    noProfiles: "No profiles found",
    selectProfile: "Select Profile",
    createNewProfile: "Create New Profile",
  },

  // Navigation
  nav: {
    dashboard: "Dashboard",
    myTasks: "My Tasks",
    leaderboard: "Leaderboard",
    rewards: "Rewards",
    profile: "Profile",
    notifications: "Notifications",
    settings: "Settings",
    logout: "Logout",
    rounds: "Rounds",
  },

  // Dashboard
  dashboard: {
    title: "Warrior Dashboard",
    subtitle: "Your Battle Arena Awaits",
    welcome: "Welcome back",
    warrior: "Warrior",
    level: "Level",
    xp: "XP",
    rank: "Rank",
    nextLevel: "Next Level",
    battleStats: "Battle Stats",
    quizBattles: "Quiz Battles Won",
    hitRate: "Hit Rate",
    fragments: "Fragments Collected",
    missions: "Missions Completed",
    achievements: "Achievements",
    viewAll: "View All",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    startQuiz: "Start Quiz Battle",
    collectFragment: "Collect Daily Fragment",
    submitMission: "Submit Mission",
  },

  // Rounds
  rounds: {
    round1: "Introduction",
    round2: "Interpretation",
    round3: "Characters",
    round4: "Application",
    round5: "Creative",
    round6: "Competition",
    round7: "Final Challenge",
    week: "Week",
    locked: "Locked",
    unlocked: "Unlocked",
    completed: "Completed",
    inProgress: "In Progress",
    startRound: "Start Round",
    continueRound: "Continue Round",
  },

  // Quiz
  quiz: {
    title: "Quiz Battle",
    mockQuiz: "Practice Battle",
    quiz1: "Quiz Battle 1",
    quiz2: "Quiz Battle 2",
    quiz3: "Quiz Battle 3",
    startQuiz: "Start Battle",
    continueQuiz: "Continue Battle",
    submitQuiz: "Submit Battle",
    question: "Question",
    of: "of",
    timeRemaining: "Time Remaining",
    score: "Score",
    correctAnswers: "Correct Answers",
    wrongAnswers: "Wrong Answers",
    accuracy: "Accuracy",
    timeTaken: "Time Taken",
    viewResults: "View Results",
    retryQuiz: "Retry Battle",
    nextQuiz: "Next Battle",
    quizCompleted: "Battle Completed!",
    quizNotStarted: "Battle Not Started",
    difficulty: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      expert: "Expert",
    },
  },

  // Events
  events: {
    title: "Events & Missions",
    videoSubmission: "Video Submission",
    shlokaRecitation: "Shloka Recitation",
    reelCreation: "Reel Creation",
    sloganSubmission: "Slogan Submission",
    submitVideo: "Submit Video",
    submitSlogan: "Submit Slogan",
    videoUrl: "Video URL",
    platform: "Platform",
    slogan: "Slogan",
    sloganPlaceholder: "Enter your creative slogan",
    status: {
      pending: "Pending Review",
      approved: "Approved",
      rejected: "Rejected",
    },
    submittedOn: "Submitted on",
    reviewedOn: "Reviewed on",
    creditScore: "Credit Score",
    noSubmissions: "No submissions yet",
  },

  // Image Puzzle
  puzzle: {
    title: "Divine Image Quest",
    subtitle: "Collect fragments daily to reveal the sacred image",
    collectToday: "Collect Today's Fragment",
    fragmentCollected: "Fragment Collected!",
    fragmentsCollected: "Fragments Collected",
    totalFragments: "Total Fragments",
    daysRemaining: "Days Remaining",
    alreadyCollected: "Already collected today",
    comeBackTomorrow: "Come back tomorrow for next fragment",
    completionBonus: "Completion Bonus",
    revealImage: "Reveal Image",
  },

  // Leaderboard
  leaderboard: {
    title: "Hall of Warriors",
    subtitle: "Top performers in the arena",
    overall: "Overall",
    weekly: "Weekly",
    myRank: "My Rank",
    rank: "Rank",
    warrior: "Warrior",
    school: "School",
    totalScore: "Total Score",
    quizScore: "Quiz Score",
    eventScore: "Event Score",
    weeklyScore: "Weekly Score",
    topWarriors: "Top Warriors",
    viewFullLeaderboard: "View Full Leaderboard",
  },

  // Rewards
  rewards: {
    title: "Rewards & Achievements",
    subtitle: "Your battle honors and trophies",
    achievements: "Achievements",
    badges: "Badges",
    certificates: "Certificates",
    unlocked: "Unlocked",
    locked: "Locked",
    progress: "Progress",
    earnedOn: "Earned on",
    noRewards: "No rewards yet",
    achievementCategories: {
      quiz: "Quiz Master",
      events: "Event Warrior",
      puzzle: "Fragment Hunter",
      streak: "Consistency Champion",
    },
  },

  // My Tasks
  tasks: {
    title: "My Battle Log",
    subtitle: "Track your quests and missions",
    pending: "Pending",
    completed: "Completed",
    inProgress: "In Progress",
    dueDate: "Due Date",
    priority: "Priority",
    noTasks: "No tasks available",
    taskCompleted: "Task completed!",
  },

  // Notifications
  notifications: {
    title: "Notifications",
    markAllRead: "Mark all as read",
    markAsRead: "Mark as read",
    delete: "Delete",
    noNotifications: "No notifications",
    types: {
      quiz: "Quiz",
      event: "Event",
      achievement: "Achievement",
      system: "System",
    },
  },

  // Settings
  settings: {
    title: "Settings",
    language: "Language",
    theme: "Theme",
    notifications: "Notifications",
    privacy: "Privacy",
    about: "About",
    version: "Version",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    systemMode: "System Mode",
  },

  // Admin
  admin: {
    title: "Admin Dashboard",
    submissions: "Submissions",
    users: "Users",
    reports: "Reports",
    reviewSubmission: "Review Submission",
    approve: "Approve",
    reject: "Reject",
    assignScore: "Assign Score",
    totalUsers: "Total Users",
    totalSubmissions: "Total Submissions",
    pendingReviews: "Pending Reviews",
  },

  // Errors
  errors: {
    somethingWentWrong: "Something went wrong",
    networkError: "Network error. Please check your connection.",
    unauthorized: "Unauthorized. Please login again.",
    notFound: "Not found",
    serverError: "Server error. Please try again later.",
    validationError: "Please check your input",
  },

  // Success Messages
  success: {
    saved: "Saved successfully",
    updated: "Updated successfully",
    deleted: "Deleted successfully",
    submitted: "Submitted successfully",
    approved: "Approved successfully",
    rejected: "Rejected successfully",
  },

  // Time
  time: {
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    lastWeek: "Last Week",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    daysAgo: "days ago",
    hoursAgo: "hours ago",
    minutesAgo: "minutes ago",
    justNow: "Just now",
  },

  // Languages
  languages: {
    hindi: "Hindi",
    english: "English",
    marathi: "Marathi",
    telugu: "Telugu",
    kannada: "Kannada",
    tamil: "Tamil",
    malayalam: "Malayalam",
    gujarati: "Gujarati",
    bengali: "Bengali",
    odia: "Odia",
    nepali: "Nepali",
    assamese: "Assamese",
    sindhi: "Sindhi",
    manipuri: "Manipuri",
  },
};

export type Translation = typeof en;