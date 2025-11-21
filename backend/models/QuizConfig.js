// Quiz Configuration Model
// Stores admin-configurable quiz settings

/**
 * Get quiz configuration
 */
export async function getQuizConfig(db) {
  try {
    const collection = db.collection('quizConfig');
    let config = await collection.findOne({ type: 'daily' });
    
    // If no config exists, create default
    if (!config) {
      config = {
        type: 'daily',
        dailyQuizQuestionCount: 10,
        easyPercentage: 40,
        mediumPercentage: 40,
        hardPercentage: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await collection.insertOne(config);
    }
    
    return config;
  } catch (error) {
    console.error('Error getting quiz config:', error);
    throw error;
  }
}

/**
 * Update quiz configuration
 */
export async function updateQuizConfig(db, updates) {
  try {
    const collection = db.collection('quizConfig');
    
    const result = await collection.updateOne(
      { type: 'daily' },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    
    return result;
  } catch (error) {
    console.error('Error updating quiz config:', error);
    throw error;
  }
}

/**
 * Calculate question distribution based on total count and percentages
 */
export function calculateQuestionDistribution(config) {
  const total = config.dailyQuizQuestionCount;
  const easyCount = Math.round((total * config.easyPercentage) / 100);
  const mediumCount = Math.round((total * config.mediumPercentage) / 100);
  const hardCount = total - easyCount - mediumCount; // Remaining questions
  
  return {
    totalQuestions: total,
    easyCount: Math.max(1, easyCount), // At least 1 of each
    mediumCount: Math.max(1, mediumCount),
    hardCount: Math.max(1, hardCount),
  };
}
