import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Adjust the path as necessary
const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// **Login Route**
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password }); // Debugging log

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
  
    const token = generateToken(user);

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// **Register Route**
router.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;
  console.log('Register attempt:', { email, password, username }); // Debugging log

  try {

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;