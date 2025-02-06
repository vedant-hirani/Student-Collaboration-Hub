console.log("🚀 Server file is executing...");

import dotenv from "dotenv";
dotenv.config(); // Load environment variables FIRST

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcryptjs"; // Import bcrypt for password comparison
import connectDB from "./db.js";
import User from "./models/User.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Debug: Print the MongoDB URL to check if it's loading correctly
console.log("MONGODB_URL from .env:", process.env.MONGODB_URL);

const mongoDBUrl = process.env.MONGODB_URL;
if (!mongoDBUrl) {
  console.error("❌ MongoDB connection string is missing");
  process.exit(1);
}

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: 'http://localhost:3000', // Update this to match your frontend URL
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

console.log("✅ Middleware configured");

app.get("/", (req, res) => {
  console.log("🔥 GET request received on /");
  res.send("Server is running!");
});

// **Login Route**
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password }); // Debugging log

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debugging log
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match'); // Debugging log
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// **Register Route**
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;

  console.log('Register attempt:', { email, password, username }); // Debugging log

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists'); // Debugging log
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('Username already exists'); // Debugging log
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, username });

    // Save the user to the database
    await newUser.save();
    
    console.log('User registered successfully:', newUser); // Debugging log
    res.json({ message: 'User registered successfully', newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ensure the database connection is established before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to MongoDB:', error);
});  