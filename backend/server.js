import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database.js';
import usersRouter from './routes/users.js';
import profilesRouter from './routes/profiles.js';
import loginsRouter from './routes/logins.js';
import emailUsersRouter from './routes/emailUsers.js';
import phoneUsersRouter from './routes/phoneUsers.js';
import quizRouter from './routes/quiz.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Geeta Olympiad API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/logins', loginsRouter);
app.use('/api/email-users', emailUsersRouter);
app.use('/api/phone-users', phoneUsersRouter);
app.use('/api/quiz', quizRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('MongoDB connection established');

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    // Handle port in use error
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use!`);
        console.error('To fix this, you can:');
        console.error('1. Kill the process using the port:');
        console.error(`   lsof -ti :${PORT} | xargs kill -9`);
        console.error('2. Or use a different port by setting PORT in your .env file\n');
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
