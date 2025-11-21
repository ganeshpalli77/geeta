// Database Configuration
// MongoDB Atlas connection configuration

export const DATABASE_CONFIG = {
  // MongoDB Atlas connection string
  // Replace <admin> and <admin123> with your actual credentials
  MONGODB_URI: 'mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/geetaOlympiad?retryWrites=true&w=majority&appName=Cluster0',
  
  // Database name
  DB_NAME: 'geetaOlympiad',
  
  // Connection options
  options: {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

// For production, use environment variables:
// export const DATABASE_CONFIG = {
//   MONGODB_URI: import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017',
//   DB_NAME: 'geetaOlympiad',
// };
