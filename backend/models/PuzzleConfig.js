// Puzzle Configuration Model
// Stores admin-uploaded puzzle image and configuration

/**
 * Get puzzle configuration
 */
export async function getPuzzleConfig(db) {
  try {
    const collection = db.collection('puzzleConfig');
    let config = await collection.findOne({ type: 'daily' });
    
    // If no config exists, create default
    if (!config) {
      config = {
        type: 'daily',
        totalPieces: 35,
        imageUrl: null, // Admin will upload image
        imageData: null, // Base64 image data
        creditsPerPiece: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await collection.insertOne(config);
    }
    
    return config;
  } catch (error) {
    console.error('Error getting puzzle config:', error);
    throw error;
  }
}

/**
 * Update puzzle configuration
 */
export async function updatePuzzleConfig(db, updates) {
  try {
    const collection = db.collection('puzzleConfig');
    
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
    console.error('Error updating puzzle config:', error);
    throw error;
  }
}

/**
 * Get user's collected puzzle pieces
 */
export async function getUserPuzzlePieces(db, userId, profileId) {
  try {
    const collection = db.collection('puzzlePieces');
    const pieces = await collection
      .find({ userId, profileId })
      .sort({ collectedAt: 1 })
      .toArray();
    
    return pieces;
  } catch (error) {
    console.error('Error getting user puzzle pieces:', error);
    throw error;
  }
}

/**
 * Collect a puzzle piece for today
 */
export async function collectPuzzlePiece(db, userId, profileId, pieceNumber) {
  try {
    const collection = db.collection('puzzlePieces');
    
    // Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user already collected a piece today
    const todayCollection = await collection.findOne({
      userId,
      profileId,
      collectedDate: today,
    });
    
    if (todayCollection) {
      return {
        success: false,
        message: 'You have already collected a puzzle piece today!',
        alreadyCollected: true,
      };
    }
    
    // Check if this specific piece was already collected
    const existingPiece = await collection.findOne({
      userId,
      profileId,
      pieceNumber,
    });
    
    if (existingPiece) {
      return {
        success: false,
        message: `Piece ${pieceNumber} has already been collected!`,
        alreadyCollected: true,
      };
    }
    
    // Collect the piece
    const result = await collection.insertOne({
      userId,
      profileId,
      pieceNumber,
      collectedDate: today,
      collectedAt: new Date(),
    });
    
    return {
      success: true,
      message: 'Puzzle piece collected successfully!',
      pieceNumber,
      collectedDate: today,
      _id: result.insertedId,
    };
  } catch (error) {
    console.error('Error collecting puzzle piece:', error);
    throw error;
  }
}
