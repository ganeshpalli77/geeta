import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/geetaOlympiad?retryWrites=true&w=majority&appName=Cluster0';

async function setupPuzzleImage() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('geetaOlympiad');
    const collection = db.collection('puzzleConfig');
    
    // Read the image file
    const imagePath = join(__dirname, '../../src/assets/bhagavad-gita-complete.jpg');
    console.log('📁 Reading image from:', imagePath);
    
    const imageBuffer = readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageData = `data:image/jpeg;base64,${imageBase64}`;
    
    console.log('✅ Image loaded, size:', Math.round(imageBase64.length / 1024), 'KB');
    
    // Update puzzle configuration
    const result = await collection.updateOne(
      { type: 'daily' },
      {
        $set: {
          type: 'daily',
          totalPieces: 35,
          imageData: imageData,
          imageUrl: null,
          creditsPerPiece: 50,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    
    if (result.upsertedCount > 0) {
      console.log('✅ Puzzle configuration created successfully!');
    } else {
      console.log('✅ Puzzle configuration updated successfully!');
    }
    
    console.log('\n📊 Configuration:');
    console.log('   - Total Pieces: 35 (7x5 grid)');
    console.log('   - Credits per piece: 50');
    console.log('   - Image: Bhagavad Gita Philosophy');
    console.log('\n🎮 Users can now collect puzzle pieces at: http://localhost:3000/#puzzle-task');
    
  } catch (error) {
    console.error('❌ Error setting up puzzle image:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Connection closed');
  }
}

setupPuzzleImage();
