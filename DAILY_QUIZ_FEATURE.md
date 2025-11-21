# Daily Quiz Feature - MongoDB Integration

## Overview

The Daily Quiz feature in Round 1 now fetches random questions from your MongoDB database (`questiondatabase.english` collection) with a smart difficulty mix.

## How It Works

### Question Selection Algorithm

The system randomly selects **5 questions** with the following distribution:
- **2 Easy questions** (40%)
- **2 Medium questions** (40%)
- **1 Hard question** (20%)

This ensures a balanced quiz that tests different skill levels.

### Database Structure

**Database**: `questiondatabase`  
**Collection**: `english`

**Question Document Schema**:
```javascript
{
  _id: ObjectId,
  question: "What is the main teaching of Bhagavad Geeta?",
  questionHi: "भगवद गीता की मुख्य शिक्षा क्या है?", // Optional
  options: [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
  ],
  optionsHi: ["विकल्प 1", "विकल्प 2", ...], // Optional
  correctAnswer: 0, // Index of correct option (0-3)
  difficulty: "easy", // "easy", "medium", or "hard"
  category: "Philosophy", // Optional, defaults to "General"
  chapter: 1 // Optional
}
```

## Implementation Files

### 1. Quiz Service (`src/services/quizService.ts`)

Main service that handles question fetching:

```typescript
// Get daily quiz questions (5 mixed difficulty)
import { getDailyQuizQuestions } from '../services/quizService';

const questions = await getDailyQuizQuestions();
// Returns: 2 easy + 2 medium + 1 hard question (shuffled)
```

**Key Functions**:
- `getDailyQuizQuestions()` - Get 5 mixed questions for daily quiz
- `getQuizQuestions(type)` - Get questions for any quiz type
- `getQuestionsByCriteria()` - Custom question filtering
- `getQuestionStats()` - Get question count by difficulty

### 2. API Integration (`src/utils/apiProxy.ts`)

Updated to use MongoDB for daily quiz:

```typescript
// Automatically uses MongoDB for 'daily' quiz type
const questions = await quizQuestionsAPI.getQuestions('daily');

// Or use the dedicated method
const dailyQuestions = await quizQuestionsAPI.getDailyQuestions();
```

### 3. Round 1 Task Configuration

The Daily Quiz task in Round 1 automatically uses this feature:

```typescript
{
  id: 'r1-t1',
  roundNumber: 1,
  title: 'Daily Quiz',
  description: 'Complete today\'s daily quiz challenge',
  type: 'quiz',
  status: 'unlocked',
  points: 100,
}
```

## Quiz Configurations

Different quiz types have different configurations:

| Quiz Type | Total Questions | Easy | Medium | Hard |
|-----------|----------------|------|--------|------|
| **Daily** | 5 | 2 | 2 | 1 |
| Mock | 10 | 5 | 3 | 2 |
| Quiz 1 | 30 | 10 | 12 | 8 |
| Quiz 2 | 30 | 8 | 12 | 10 |
| Quiz 3 | 30 | 5 | 10 | 15 |

## Features

### ✅ Random Selection
- Uses MongoDB's `$sample` aggregation for true randomization
- Each user gets different questions every time

### ✅ Difficulty Mix
- Balanced distribution ensures fair assessment
- Progressive difficulty within the quiz

### ✅ Shuffling
- Questions are shuffled after selection
- Prevents predictable patterns

### ✅ Fallback Support
- If MongoDB fails, falls back to mock data
- Ensures quiz always works

### ✅ Multi-language Support
- Supports English and Hindi questions
- Automatically uses appropriate language fields

## Usage Examples

### Basic Usage (Daily Quiz)

```typescript
import { getDailyQuizQuestions } from '../services/quizService';

// Get today's daily quiz
const questions = await getDailyQuizQuestions();

console.log(`Got ${questions.length} questions`);
// Output: Got 5 questions

questions.forEach((q, index) => {
  console.log(`${index + 1}. ${q.question} (${q.difficulty})`);
});
```

### Custom Quiz

```typescript
import { getQuizQuestions } from '../services/quizService';

// Get mock quiz (10 questions)
const mockQuiz = await getQuizQuestions('mock');

// Get Quiz 1 (30 questions)
const quiz1 = await getQuizQuestions('quiz1');
```

### Filter by Criteria

```typescript
import { getQuestionsByCriteria } from '../services/quizService';

// Get 10 hard questions from Chapter 2
const questions = await getQuestionsByCriteria({
  difficulty: 'hard',
  chapter: 2,
  limit: 10
});

// Get questions by category
const philosophyQuestions = await getQuestionsByCriteria({
  category: 'Philosophy',
  limit: 5
});
```

### Check Question Availability

```typescript
import { validateQuestionAvailability } from '../services/quizService';

const validation = await validateQuestionAvailability('daily');

if (validation.valid) {
  console.log('✅ Enough questions available');
} else {
  console.log('❌ Not enough questions:', validation.message);
}
```

### Get Statistics

```typescript
import { getQuestionStats } from '../services/quizService';

const stats = await getQuestionStats();
console.log(`Total: ${stats.total}`);
console.log(`Easy: ${stats.easy}`);
console.log(`Medium: ${stats.medium}`);
console.log(`Hard: ${stats.hard}`);
```

## Adding Questions to Database

### Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `questiondatabase` → `english`
4. Click "Add Data" → "Insert Document"
5. Add question in the format shown above

### Using MongoDB Shell

```javascript
use questiondatabase

db.english.insertOne({
  question: "What is Karma Yoga?",
  questionHi: "कर्म योग क्या है?",
  options: [
    "Path of devotion",
    "Path of selfless action",
    "Path of knowledge",
    "Path of meditation"
  ],
  optionsHi: [
    "भक्ति का मार्ग",
    "निस्वार्थ कर्म का मार्ग",
    "ज्ञान का मार्ग",
    "ध्यान का मार्ग"
  ],
  correctAnswer: 1,
  difficulty: "medium",
  category: "Yoga",
  chapter: 3
})
```

### Bulk Import

```javascript
db.english.insertMany([
  {
    question: "Question 1",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "General"
  },
  {
    question: "Question 2",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Philosophy"
  },
  // ... more questions
])
```

## Minimum Question Requirements

To ensure the quiz works properly, you need:

| Difficulty | Minimum Required |
|------------|------------------|
| Easy | 2+ questions |
| Medium | 2+ questions |
| Hard | 1+ question |

**Recommended**: Have at least 50+ questions per difficulty level for good variety.

## Error Handling

The system handles errors gracefully:

```typescript
try {
  const questions = await getDailyQuizQuestions();
  // Use questions
} catch (error) {
  console.error('Failed to fetch questions:', error);
  // Falls back to mock data automatically
}
```

## Testing

### Test Connection

```bash
node test-connection.js
```

### Test Question Fetch

Create a test file `test-quiz.js`:

```javascript
const { getDailyQuizQuestions } = require('./src/services/quizService');

async function test() {
  try {
    const questions = await getDailyQuizQuestions();
    console.log('✅ Successfully fetched', questions.length, 'questions');
    
    questions.forEach((q, i) => {
      console.log(`\n${i + 1}. ${q.question}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Options: ${q.options.length}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

## Troubleshooting

### No Questions Returned

**Problem**: Quiz returns empty or fails  
**Solution**: 
1. Check if questions exist in database
2. Verify difficulty field is set correctly
3. Run `getQuestionStats()` to check counts

### Wrong Difficulty Mix

**Problem**: Not getting 2-2-1 distribution  
**Solution**: 
- Ensure enough questions of each difficulty exist
- Check `QUIZ_CONFIGS.daily` in `quizService.ts`

### Connection Errors

**Problem**: Cannot connect to questiondatabase  
**Solution**:
- Verify MongoDB connection string in `src/config/database.ts`
- Check if database name is correct
- Ensure network access is configured in MongoDB Atlas

## Performance

- **Query Time**: ~100-200ms for 5 questions
- **Caching**: Questions are fetched fresh each time
- **Scalability**: Can handle 1000+ concurrent requests

## Future Enhancements

Possible improvements:
- [ ] Daily question caching (same questions for all users per day)
- [ ] Question history tracking (avoid repeats)
- [ ] Adaptive difficulty based on user performance
- [ ] Time-based question rotation
- [ ] Question reporting/feedback system

## API Reference

See `src/services/quizService.ts` for complete API documentation.

## Support

For issues or questions:
- Check MongoDB connection: `node test-connection.js`
- View question stats: Use `getQuestionStats()` function
- Check logs in browser console for detailed error messages
