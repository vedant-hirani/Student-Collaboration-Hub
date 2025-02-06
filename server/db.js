import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URL;
  if (!mongoURI) {
    console.error('MongoDB connection string is missing');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB with URI:', mongoURI); // Debugging log
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Handle the error appropriately for your application
    throw error;
  }
};

export default connectDB;
