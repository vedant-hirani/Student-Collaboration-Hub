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

// Add this to your eventRoutes.js
// Register for an event
router.post('/:id/register', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is already registered
    const alreadyRegistered = event.registrations.some(
      registration => registration.userId.toString() === userId
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    // Add user to registrations
    event.registrations.push({ userId });
    await event.save();
    
    res.status(200).json({ message: 'Successfully registered for event', event });
  } catch (err) {
    console.error(err);
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


// Get registrations for a specific event (for event creators)
router.get('/:id/registrations', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the creator of the event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Populate user data for registrations
    const populatedEvent = await Event.findById(req.params.id)
      .populate({
        path: 'registrations.userId',
        select: 'name email' // Only get non-sensitive user data
      });
    
    res.status(200).json({ registrations: populatedEvent.registrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// At the end of your event routes file
export default router;