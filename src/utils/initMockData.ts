// Initialize database with mock data on first load
import { mockDb } from './mockDb';

export function initializeMockData() {
  // Check if already initialized
  const initialized = localStorage.getItem('mockDataInitialized');
  if (initialized === 'true') {
    return;
  }

  console.log('Initializing mock database with sample data...');

  // Clear existing data
  mockDb.dropDatabase();

  // ============================================================================
  // MOCK USERS
  // ============================================================================
  const users = [
    {
      email: 'demo@example.com',
      profiles: [],
    },
    {
      phone: '+919876543210',
      profiles: [],
    },
    {
      email: 'john@example.com',
      profiles: [],
    },
    {
      email: 'priya@example.com',
      profiles: [],
    },
  ];

  const createdUsers = users.map(user => mockDb.insertOne('users', user));

  // ============================================================================
  // MOCK PROFILES
  // ============================================================================
  const profilesData = [
    {
      userId: createdUsers[0]._id,
      name: 'Arjun Kumar',
      prn: 'PRN001',
      dob: '2010-05-15',
      preferredLanguage: 'en',
      category: 'kids',
    },
    {
      userId: createdUsers[0]._id,
      name: 'Priya Kumar',
      prn: 'PRN002',
      dob: '2008-08-20',
      preferredLanguage: 'hi',
      category: 'kids',
    },
    {
      userId: createdUsers[1]._id,
      name: 'Rajesh Sharma',
      prn: 'PRN003',
      dob: '1995-03-10',
      preferredLanguage: 'en',
      category: 'youth',
    },
    {
      userId: createdUsers[2]._id,
      name: 'John Doe',
      prn: 'PRN004',
      dob: '2005-12-25',
      preferredLanguage: 'en',
      category: 'kids',
    },
    {
      userId: createdUsers[3]._id,
      name: 'Priya Singh',
      prn: 'PRN005',
      dob: '1990-07-18',
      preferredLanguage: 'hi',
      category: 'youth',
    },
    {
      userId: createdUsers[3]._id,
      name: 'Sanjay Patel',
      prn: 'PRN006',
      dob: '1975-01-05',
      preferredLanguage: 'en',
      category: 'senior',
    },
  ];

  const createdProfiles = profilesData.map(profile => {
    const newProfile = mockDb.insertOne('profiles', profile);
    // Update user's profiles array
    mockDb.updateById('users', profile.userId, {
      $push: { profiles: newProfile._id }
    });
    return newProfile;
  });

  // ============================================================================
  // MOCK QUIZ ATTEMPTS
  // ============================================================================
  const quizAttempts = [
    {
      profileId: createdProfiles[0]._id,
      type: 'mock',
      questions: [],
      answers: {},
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: 600,
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[0]._id,
      type: 'quiz1',
      questions: [],
      answers: {},
      score: 180,
      totalQuestions: 20,
      correctAnswers: 18,
      timeSpent: 1200,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[2]._id,
      type: 'mock',
      questions: [],
      answers: {},
      score: 95,
      totalQuestions: 10,
      correctAnswers: 9,
      timeSpent: 550,
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[2]._id,
      type: 'quiz1',
      questions: [],
      answers: {},
      score: 200,
      totalQuestions: 20,
      correctAnswers: 20,
      timeSpent: 1000,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[3]._id,
      type: 'mock',
      questions: [],
      answers: {},
      score: 75,
      totalQuestions: 10,
      correctAnswers: 7,
      timeSpent: 650,
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[4]._id,
      type: 'mock',
      questions: [],
      answers: {},
      score: 80,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: 580,
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[4]._id,
      type: 'quiz1',
      questions: [],
      answers: {},
      score: 170,
      totalQuestions: 20,
      correctAnswers: 17,
      timeSpent: 1150,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  quizAttempts.forEach(attempt => mockDb.insertOne('quizAttempts', attempt));

  // ============================================================================
  // MOCK VIDEO SUBMISSIONS
  // ============================================================================
  const videoSubmissions = [
    {
      profileId: createdProfiles[0]._id,
      type: 'shloka',
      url: 'https://youtube.com/watch?v=demo1',
      platform: 'YouTube',
      status: 'approved',
      creditScore: 50,
      submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[2]._id,
      type: 'reel',
      url: 'https://instagram.com/reel/demo2',
      platform: 'Instagram',
      status: 'approved',
      creditScore: 60,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[3]._id,
      type: 'reel',
      url: 'https://youtube.com/shorts/demo3',
      platform: 'YouTube Shorts',
      status: 'pending',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[4]._id,
      type: 'shloka',
      url: 'https://youtube.com/watch?v=demo4',
      platform: 'YouTube',
      status: 'approved',
      creditScore: 55,
      submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  videoSubmissions.forEach(video => mockDb.insertOne('videoSubmissions', video));

  // ============================================================================
  // MOCK SLOGAN SUBMISSIONS
  // ============================================================================
  const sloganSubmissions = [
    {
      profileId: createdProfiles[0]._id,
      slogan: 'Geeta ke gyaan se, jeevan ho mahaan',
      status: 'approved',
      creditScore: 30,
      submittedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[1]._id,
      slogan: 'गीता का ज्ञान, जीवन की पहचान',
      status: 'approved',
      creditScore: 35,
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[2]._id,
      slogan: 'Wisdom from Geeta, Peace for all',
      status: 'pending',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      profileId: createdProfiles[4]._id,
      slogan: 'गीता ज्ञान से जीवन में आए शान',
      status: 'approved',
      creditScore: 32,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  sloganSubmissions.forEach(slogan => mockDb.insertOne('sloganSubmissions', slogan));

  // ============================================================================
  // MOCK IMAGE PARTS
  // ============================================================================
  const imageParts = [
    // Arjun has collected 12 parts
    ...[1, 5, 8, 12, 15, 18, 22, 25, 30, 33, 38, 42].map((partNumber, index) => ({
      profileId: createdProfiles[0]._id,
      partNumber,
      collectedAt: new Date(Date.now() - (12 - index) * 24 * 60 * 60 * 1000).toISOString(),
    })),
    // Rajesh has collected 20 parts
    ...[2, 3, 6, 9, 11, 14, 16, 19, 21, 24, 26, 28, 31, 34, 36, 39, 40, 43, 44, 45].map((partNumber, index) => ({
      profileId: createdProfiles[2]._id,
      partNumber,
      collectedAt: new Date(Date.now() - (20 - index) * 24 * 60 * 60 * 1000).toISOString(),
    })),
    // John has collected 5 parts
    ...[4, 7, 10, 13, 17].map((partNumber, index) => ({
      profileId: createdProfiles[3]._id,
      partNumber,
      collectedAt: new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000).toISOString(),
    })),
    // Priya Singh has collected 8 parts
    ...[20, 23, 27, 29, 32, 35, 37, 41].map((partNumber, index) => ({
      profileId: createdProfiles[4]._id,
      partNumber,
      collectedAt: new Date(Date.now() - (8 - index) * 24 * 60 * 60 * 1000).toISOString(),
    })),
  ];

  imageParts.forEach(part => mockDb.insertOne('imageParts', part));

  // Mark as initialized
  localStorage.setItem('mockDataInitialized', 'true');

  console.log('Mock database initialized successfully!');
  console.log(`- ${createdUsers.length} users created`);
  console.log(`- ${createdProfiles.length} profiles created`);
  console.log(`- ${quizAttempts.length} quiz attempts created`);
  console.log(`- ${videoSubmissions.length} video submissions created`);
  console.log(`- ${sloganSubmissions.length} slogan submissions created`);
  console.log(`- ${imageParts.length} image parts collected`);
}

// Function to reset mock data (useful for testing)
export function resetMockData() {
  localStorage.removeItem('mockDataInitialized');
  mockDb.dropDatabase();
  initializeMockData();
}
