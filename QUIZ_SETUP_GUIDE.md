# Daily Quiz Setup Guide

## 🎯 Issue: "No questions available for today's quiz"

This error occurs when there are no questions in the MongoDB database.

---

## 📋 Solution: Add Questions to Database

### Option 1: Using MongoDB Compass (Recommended)

1. **Open MongoDB Compass**
2. **Connect** to your MongoDB instance
3. **Navigate** to database: `questiondatabase`
4. **Select** collection: `english`
5. **Click** "ADD DATA" → "Insert Document"
6. **Add** questions in this format:

```json
{
  "Question": "Who is the author of the Bhagavad Gita?",
  "Question (Hindi)": "भगवद गीता के लेखक कौन हैं?",
  "Option A": "Vyasa",
  "Option B": "Krishna",
  "Option C": "Arjuna",
  "Option D": "Sanjaya",
  "Option A (Hindi)": "व्यास",
  "Option B (Hindi)": "कृष्ण",
  "Option C (Hindi)": "अर्जुन",
  "Option D (Hindi)": "संजय",
  "Correct Answer": "A",
  "Difficulty": "easy",
  "Category": "General Knowledge"
}
```

7. **Repeat** for multiple questions (minimum 10 recommended)

---

### Option 2: Using MongoDB Shell

```javascript
// Connect to MongoDB
use questiondatabase

// Insert sample questions
db.english.insertMany([
  {
    "Question": "Who is the author of the Bhagavad Gita?",
    "Question (Hindi)": "भगवद गीता के लेखक कौन हैं?",
    "Option A": "Vyasa",
    "Option B": "Krishna",
    "Option C": "Arjuna",
    "Option D": "Sanjaya",
    "Option A (Hindi)": "व्यास",
    "Option B (Hindi)": "कृष्ण",
    "Option C (Hindi)": "अर्जुन",
    "Option D (Hindi)": "संजय",
    "Correct Answer": "A",
    "Difficulty": "easy",
    "Category": "General Knowledge"
  },
  {
    "Question": "In which chapter does Krishna reveal his universal form?",
    "Question (Hindi)": "किस अध्याय में कृष्ण ने अपना विश्वरूप प्रकट किया?",
    "Option A": "Chapter 9",
    "Option B": "Chapter 10",
    "Option C": "Chapter 11",
    "Option D": "Chapter 12",
    "Option A (Hindi)": "अध्याय 9",
    "Option B (Hindi)": "अध्याय 10",
    "Option C (Hindi)": "अध्याय 11",
    "Option D (Hindi)": "अध्याय 12",
    "Correct Answer": "C",
    "Difficulty": "medium",
    "Category": "Bhagavad Gita"
  },
  {
    "Question": "What is the total number of chapters in the Bhagavad Gita?",
    "Question (Hindi)": "भगवद गीता में कुल कितने अध्याय हैं?",
    "Option A": "16",
    "Option B": "18",
    "Option C": "20",
    "Option D": "22",
    "Option A (Hindi)": "16",
    "Option B (Hindi)": "18",
    "Option C (Hindi)": "20",
    "Option D (Hindi)": "22",
    "Correct Answer": "B",
    "Difficulty": "easy",
    "Category": "Bhagavad Gita"
  }
])
```

---

### Option 3: Using Backend Script

Create a file `backend/scripts/seedQuestions.js`:

```javascript
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const sampleQuestions = [
  {
    "Question": "Who is the author of the Bhagavad Gita?",
    "Question (Hindi)": "भगवद गीता के लेखक कौन हैं?",
    "Option A": "Vyasa",
    "Option B": "Krishna",
    "Option C": "Arjuna",
    "Option D": "Sanjaya",
    "Option A (Hindi)": "व्यास",
    "Option B (Hindi)": "कृष्ण",
    "Option C (Hindi)": "अर्जुन",
    "Option D (Hindi)": "संजय",
    "Correct Answer": "A",
    "Difficulty": "easy",
    "Category": "General Knowledge"
  },
  // Add more questions here...
];

async function seedQuestions() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('questiondatabase');
    const collection = db.collection('english');
    
    // Clear existing questions (optional)
    // await collection.deleteMany({});
    
    // Insert questions
    const result = await collection.insertMany(sampleQuestions);
    console.log(`✅ Inserted ${result.insertedCount} questions`);
    
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
  } finally {
    await client.close();
  }
}

seedQuestions();
```

Run with:
```bash
node backend/scripts/seedQuestions.js
```

---

## 📊 Question Requirements

### Difficulty Distribution
- **Easy:** 40% of questions
- **Medium:** 40% of questions
- **Hard:** 20% of questions

### Minimum Questions
- **Minimum:** 10 questions total
- **Recommended:** 50+ questions for variety

### Field Requirements

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| Question | ✅ Yes | String | "Who is the author..." |
| Question (Hindi) | ⚠️ Optional | String | "भगवद गीता के लेखक..." |
| Option A | ✅ Yes | String | "Vyasa" |
| Option B | ✅ Yes | String | "Krishna" |
| Option C | ✅ Yes | String | "Arjuna" |
| Option D | ✅ Yes | String | "Sanjaya" |
| Option A (Hindi) | ⚠️ Optional | String | "व्यास" |
| Option B (Hindi) | ⚠️ Optional | String | "कृष्ण" |
| Option C (Hindi) | ⚠️ Optional | String | "अर्जुन" |
| Option D (Hindi) | ⚠️ Optional | String | "संजय" |
| Correct Answer | ✅ Yes | "A", "B", "C", or "D" | "A" |
| Difficulty | ✅ Yes | "easy", "medium", or "hard" | "easy" |
| Category | ⚠️ Optional | String | "General Knowledge" |

---

## ✅ Verification

After adding questions, verify they're working:

1. **Check Database:**
   ```javascript
   use questiondatabase
   db.english.countDocuments()
   // Should return number > 0
   ```

2. **Check API:**
   - Open browser: `http://localhost:5000/api/quiz/daily-questions`
   - Should return JSON with questions array

3. **Check Frontend:**
   - Click "Start Today's Quiz"
   - Should load questions successfully

---

## 🔍 Debugging

### Check Backend Logs

Look for these messages:
```
📋 Fetching daily quiz questions with config: {...}
🌱 Using seed: 20251121 for today's quiz
📊 Available questions: Easy=10, Medium=8, Hard=5
✅ Selected: Easy=4, Medium=4, Hard=2
🎯 Sending 10 daily quiz questions
```

### Check Frontend Console

Look for:
```
🔄 Fetching daily quiz questions from: http://localhost:5000/api/quiz/daily-questions
📡 Response status: 200
📊 Received data: {success: true, questions: Array(10), ...}
✅ Loaded 10 daily quiz questions
```

### Common Issues

**❌ "No questions available"**
- **Cause:** Database is empty
- **Fix:** Add questions using one of the methods above

**❌ "Failed to fetch daily quiz questions"**
- **Cause:** Backend not running or wrong URL
- **Fix:** Start backend server, check VITE_API_URL

**❌ Questions not in correct format**
- **Cause:** Missing required fields
- **Fix:** Ensure all required fields are present

---

## 🎯 Quick Start

**Fastest way to get started:**

1. Open MongoDB Compass
2. Connect to your database
3. Go to `questiondatabase` → `english`
4. Copy-paste this sample question:

```json
{
  "Question": "Who is the author of the Bhagavad Gita?",
  "Option A": "Vyasa",
  "Option B": "Krishna",
  "Option C": "Arjuna",
  "Option D": "Sanjaya",
  "Correct Answer": "A",
  "Difficulty": "easy",
  "Category": "General Knowledge"
}
```

5. Click "Insert"
6. Repeat 9 more times with different questions
7. Refresh your quiz page

**Done!** 🎉

---

## 📚 Sample Questions Pack

Want to get started quickly? Here are 10 ready-to-use questions:

[Download Sample Questions](./sample-quiz-questions.json)

Or use the seed script in `backend/scripts/seedQuestions.js`
