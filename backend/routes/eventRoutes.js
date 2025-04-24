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

/// Fixed registration route to properly handle user data
router.post('/:eventId/register', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const { name, email, phone, additionalInfo } = req.body;
    
    console.log('Registration data received:', { name, email, phone, additionalInfo });
    
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
    
    // Update event with new registration including all user data
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
      { new: true, runValidators: true } // Return updated document and run validation
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
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + err.message });
    }
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


// Modify the /:eventId/attendees route in the backend
router.get('/:eventId/attendees', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is the creator of the event
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only view attendees for events you created' });
    }

    // Format attendees data based on the frontend expectations
    const attendees = event.registrations.map(registration => {
      return {
        name: registration.userData?.name || 'Anonymous',
        email: registration.userData?.email || 'Not provided',
        phone: registration.userData?.phone || null,
        registeredAt: registration.registeredAt
      };
    });

    res.status(200).json({ 
      event: {
        _id: event._id,
        title: event.title,
        startDate: event.startDate,
        capacity: event.capacity,
        location: event.location,
        startTime: event.startTime
      },
      attendees 
    });
  } catch (err) {
    console.error('Error fetching event attendees:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// At the end of your event routes file
export default router;