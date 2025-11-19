/**
 * Hindi Translations (हिंदी)
 * Geeta Olympiad Portal
 */

import { Translation } from './en';

export const hi: Translation = {
  // Common
  common: {
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    cancel: "रद्द करें",
    save: "सहेजें",
    delete: "हटाएं",
    edit: "संपादित करें",
    submit: "जमा करें",
    back: "वापस",
    next: "आगे",
    close: "बंद करें",
    search: "खोजें",
    filter: "फ़िल्टर",
    sort: "क्रमबद्ध करें",
    noData: "कोई डेटा उपलब्ध नहीं",
    confirm: "पुष्टि करें",
    yes: "हाँ",
    no: "नहीं",
  },

  // Auth Pages
  auth: {
    welcomeTitle: "गीता ओलंपियाड में आपका स्वागत है",
    welcomeSubtitle: "हजारों लोगों के साथ भगवद्गीता का ज्ञान सीखें",
    login: "लॉगिन करें",
    signup: "साइन अप करें",
    enterEmail: "अपना ईमेल दर्ज करें",
    enterPhone: "अपना फ़ोन नंबर दर्ज करें",
    enterOtp: "OTP दर्ज करें",
    sendOtp: "OTP भेजें",
    verifyOtp: "OTP सत्यापित करें",
    resendOtp: "OTP पुनः भेजें",
    emailPlaceholder: "your.email@example.com",
    phonePlaceholder: "+91 XXXXXXXXXX",
    otpSent: "OTP सफलतापूर्वक भेजा गया",
    otpVerified: "OTP सफलतापूर्वक सत्यापित",
    invalidOtp: "अमान्य OTP",
    adminLogin: "व्यवस्थापक लॉगिन",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    loginSuccess: "लॉगिन सफल",
    loginError: "लॉगिन विफल",
  },

  // Profile
  profile: {
    createProfile: "प्रोफ़ाइल बनाएं",
    editProfile: "प्रोफ़ाइल संपादित करें",
    viewProfile: "प्रोफ़ाइल देखें",
    myProfile: "मेरी प्रोफ़ाइल",
    name: "नाम",
    prn: "प्रतिभागी पंजीकरण संख्या (PRN)",
    dob: "जन्म तिथि",
    category: "श्रेणी / स्कूल का नाम",
    language: "पसंदीदा भाषा",
    selectLanguage: "भाषा चुनें",
    namePlaceholder: "अपना पूरा नाम दर्ज करें",
    prnPlaceholder: "अपना PRN दर्ज करें",
    categoryPlaceholder: "अपने स्कूल का नाम या श्रेणी दर्ज करें",
    profileCreated: "प्रोफ़ाइल सफलतापूर्वक बनाई गई",
    profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई",
    noProfiles: "कोई प्रोफ़ाइल नहीं मिली",
    selectProfile: "प्रोफ़ाइल चुनें",
    createNewProfile: "नई प्रोफ़ाइल बनाएं",
  },

  // Navigation
  nav: {
    dashboard: "डैशबोर्ड",
    myTasks: "मेरे कार्य",
    leaderboard: "लीडरबोर्ड",
    rewards: "पुरस्कार",
    profile: "प्रोफ़ाइल",
    notifications: "सूचनाएं",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    rounds: "राउंड",
  },

  // Dashboard
  dashboard: {
    title: "योद्धा डैशबोर्ड",
    subtitle: "आपका युद्ध मैदान आपकी प्रतीक्षा कर रहा है",
    welcome: "वापसी पर स्वागत है",
    warrior: "योद्धा",
    level: "स्तर",
    xp: "XP",
    rank: "रैंक",
    nextLevel: "अगला स्तर",
    battleStats: "युद्ध आंकड़े",
    quizBattles: "जीती गई क्विज़ लड़ाइयाँ",
    hitRate: "हिट रेट",
    fragments: "एकत्रित टुकड़े",
    missions: "पूर्ण मिशन",
    achievements: "उपलब्धियां",
    viewAll: "सभी देखें",
    recentActivity: "हाल की गतिविधि",
    quickActions: "त्वरित क्रियाएं",
    startQuiz: "क्विज़ युद्ध शुरू करें",
    collectFragment: "दैनिक टुकड़ा एकत्र करें",
    submitMission: "मिशन जमा करें",
  },

  // Rounds
  rounds: {
    round1: "परिचय",
    round2: "व्याख्या",
    round3: "पात्र",
    round4: "अनुप्रयोग",
    round5: "रचनात्मक",
    round6: "प्रतियोगिता",
    round7: "अंतिम चुनौती",
    week: "सप्ताह",
    locked: "लॉक्ड",
    unlocked: "अनलॉक्ड",
    completed: "पूर्ण",
    inProgress: "प्रगति में",
    startRound: "राउंड शुरू करें",
    continueRound: "राउंड जारी रखें",
  },

  // Quiz
  quiz: {
    title: "क्विज़ युद्ध",
    mockQuiz: "अभ्यास युद्ध",
    quiz1: "क्विज़ युद्ध 1",
    quiz2: "क्विज़ युद्ध 2",
    quiz3: "क्विज़ युद्ध 3",
    startQuiz: "युद्ध शुरू करें",
    continueQuiz: "युद्ध जारी रखें",
    submitQuiz: "युद्ध जमा करें",
    question: "प्रश्न",
    of: "का",
    timeRemaining: "शेष समय",
    score: "स्कोर",
    correctAnswers: "सही उत्तर",
    wrongAnswers: "गलत उत्तर",
    accuracy: "सटीकता",
    timeTaken: "लिया गया समय",
    viewResults: "परिणाम देखें",
    retryQuiz: "युद्ध पुनः प्रयास करें",
    nextQuiz: "अगला युद्ध",
    quizCompleted: "युद्ध पूर्ण!",
    quizNotStarted: "युद्ध शुरू नहीं हुआ",
    difficulty: {
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन",
      expert: "विशेषज्ञ",
    },
  },

  // Events
  events: {
    title: "कार्यक्रम और मिशन",
    videoSubmission: "वीडियो सबमिशन",
    shlokaRecitation: "श्लोक पाठ",
    reelCreation: "रील निर्माण",
    sloganSubmission: "नारा सबमिशन",
    submitVideo: "वीडियो जमा करें",
    submitSlogan: "नारा जमा करें",
    videoUrl: "वीडियो URL",
    platform: "प्लेटफ़ॉर्म",
    slogan: "नारा",
    sloganPlaceholder: "अपना रचनात्मक नारा दर्ज करें",
    status: {
      pending: "समीक्षा लंबित",
      approved: "स्वीकृत",
      rejected: "अस्वीकृत",
    },
    submittedOn: "जमा किया गया",
    reviewedOn: "समीक्षा की गई",
    creditScore: "क्रेडिट स्कोर",
    noSubmissions: "अभी तक कोई सबमिशन नहीं",
  },

  // Image Puzzle
  puzzle: {
    title: "दिव्य चित्र खोज",
    subtitle: "पवित्र छवि प्रकट करने के लिए रोज़ाना टुकड़े एकत्र करें",
    collectToday: "आज का टुकड़ा एकत्र करें",
    fragmentCollected: "टुकड़ा एकत्रित!",
    fragmentsCollected: "एकत्रित टुकड़े",
    totalFragments: "कुल टुकड़े",
    daysRemaining: "शेष दिन",
    alreadyCollected: "आज पहले ही एकत्र किया गया",
    comeBackTomorrow: "अगले टुकड़े के लिए कल आएं",
    completionBonus: "पूर्णता बोनस",
    revealImage: "चित्र प्रकट करें",
  },

  // Leaderboard
  leaderboard: {
    title: "योद्धाओं का हॉल",
    subtitle: "मैदान में शीर्ष प्रदर्शन करने वाले",
    overall: "संपूर्ण",
    weekly: "साप्ताहिक",
    myRank: "मेरी रैंक",
    rank: "रैंक",
    warrior: "योद्धा",
    school: "स्कूल",
    totalScore: "कुल स्कोर",
    quizScore: "क्विज़ स्कोर",
    eventScore: "इवेंट स्कोर",
    weeklyScore: "साप्ताहिक स्कोर",
    topWarriors: "शीर्ष योद्धा",
    viewFullLeaderboard: "पूर्ण लीडरबोर्ड देखें",
  },

  // Rewards
  rewards: {
    title: "पुरस्कार और उपलब्धियां",
    subtitle: "आपके युद्ध सम्मान और ट्रॉफियां",
    achievements: "उपलब्धियां",
    badges: "बैज",
    certificates: "प्रमाणपत्र",
    unlocked: "अनलॉक्ड",
    locked: "लॉक्ड",
    progress: "प्रगति",
    earnedOn: "अर्जित किया गया",
    noRewards: "अभी तक कोई पुरस्कार नहीं",
    achievementCategories: {
      quiz: "क्विज़ मास्टर",
      events: "इवेंट योद्धा",
      puzzle: "टुकड़ा शिकारी",
      streak: "निरंतरता चैंपियन",
    },
  },

  // My Tasks
  tasks: {
    title: "मेरा युद्ध लॉग",
    subtitle: "अपनी खोजों और मिशनों को ट्रैक करें",
    pending: "लंबित",
    completed: "पूर्ण",
    inProgress: "प्रगति में",
    dueDate: "नियत तारीख",
    priority: "प्राथमिकता",
    noTasks: "कोई कार्य उपलब्ध नहीं",
    taskCompleted: "कार्य पूर्ण!",
  },

  // Notifications
  notifications: {
    title: "सूचनाएं",
    markAllRead: "सभी को पढ़ा हुआ चिह्नित करें",
    markAsRead: "पढ़ा हुआ चिह्नित करें",
    delete: "हटाएं",
    noNotifications: "कोई सूचना नहीं",
    types: {
      quiz: "क्विज़",
      event: "इवेंट",
      achievement: "उपलब्धि",
      system: "सिस्टम",
    },
  },

  // Settings
  settings: {
    title: "सेटिंग्स",
    language: "भाषा",
    theme: "थीम",
    notifications: "सूचनाएं",
    privacy: "गोपनीयता",
    about: "के बारे में",
    version: "संस्करण",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    systemMode: "सिस्टम मोड",
  },

  // Admin
  admin: {
    title: "व्यवस्थापक डैशबोर्ड",
    submissions: "सबमिशन",
    users: "उपयोगकर्ता",
    reports: "रिपोर्ट",
    reviewSubmission: "सबमिशन की समीक्षा करें",
    approve: "स्वीकृत करें",
    reject: "अस्वीकृत करें",
    assignScore: "स्कोर असाइन करें",
    totalUsers: "कुल उपयोगकर्ता",
    totalSubmissions: "कुल सबमिशन",
    pendingReviews: "लंबित समीक्षाएं",
  },

  // Errors
  errors: {
    somethingWentWrong: "कुछ गलत हो गया",
    networkError: "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।",
    unauthorized: "अनधिकृत। कृपया फिर से लॉगिन करें।",
    notFound: "नहीं मिला",
    serverError: "सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।",
    validationError: "कृपया अपना इनपुट जांचें",
  },

  // Success Messages
  success: {
    saved: "सफलतापूर्वक सहेजा गया",
    updated: "सफलतापूर्वक अपडेट किया गया",
    deleted: "सफलतापूर्वक हटाया गया",
    submitted: "सफलतापूर्वक जमा किया गया",
    approved: "सफलतापूर्वक स्वीकृत",
    rejected: "सफलतापूर्वक अस्वीकृत",
  },

  // Time
  time: {
    today: "आज",
    yesterday: "कल",
    tomorrow: "कल",
    thisWeek: "इस सप्ताह",
    lastWeek: "पिछले सप्ताह",
    thisMonth: "इस महीने",
    lastMonth: "पिछले महीने",
    daysAgo: "दिन पहले",
    hoursAgo: "घंटे पहले",
    minutesAgo: "मिनट पहले",
    justNow: "अभी",
  },

  // Languages
  languages: {
    hindi: "हिंदी",
    english: "English",
    marathi: "मराठी",
    telugu: "తెలుగు",
    kannada: "ಕನ್ನಡ",
    tamil: "தமிழ்",
    malayalam: "മലയാളം",
    gujarati: "ગુજરાતી",
    bengali: "বাংলা",
    odia: "ଓଡ଼ିଆ",
    nepali: "नेपाली",
    assamese: "অসমীয়া",
    sindhi: "سنڌي",
    manipuri: "মৈতৈলোন্",
  },
};
