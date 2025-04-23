import express from 'express';
import multer from 'multer';
import path from 'path';
import Event from '../models/Event.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();
// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Create Event (Protected)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  console.log('Received event creation request:', req.body);
  try {
    const { title, category, eventType, startDate, startTime, location, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = new Event({
      title,
      category,
      eventType,
      startDate,
      startTime,
      location,
      description,
      imageUrl,
      createdBy: req.user.id
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Updated registration route to fix validation error
router.post('/:eventId/register', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const { name, email, phone, additionalInfo } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is already registered
    const alreadyRegistered = event.registrations.some(
      registration => registration.userId && registration.userId.toString() === userId.toString()
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    
    // Instead of creating a new Event document, we'll update the existing one
    // This avoids issues with required fields like createdBy
    const result = await Event.findByIdAndUpdate(
      eventId,
      {
        $push: {
          registrations: {
            userId,
            userData: {
              name,
              email,
              phone,
              additionalInfo
            },
            registeredAt: new Date()
          }
        }
      },
      { new: true, runValidators: false } // Return updated document and skip validation
    );
    
    if (!result) {
      return res.status(500).json({ message: 'Failed to update event registration' });
    }
    
    // Get the newly added registration from the result
    const newRegistration = result.registrations[result.registrations.length - 1];
    
    res.status(200).json({ 
      message: 'Registration successful',
      registration: newRegistration
    });
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get events created by user
router.get('/user/created', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all events created by this user
    const events = await Event.find({ createdBy: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ events });
  } catch (err) {
    console.error('Error fetching user events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events the user has registered for
router.get('/user/registered', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all events where this user is registered
    const events = await Event.find({ 
      'registrations.userId': userId 
    }).sort({ startDate: 1 });
    
    res.status(200).json({ events });
  } catch (err) {
    console.error('Error fetching registered events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// At the end of your event routes file
export default router;