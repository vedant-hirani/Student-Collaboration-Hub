import express from "express";
import prisma from "../prisma.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'), false);
      return;
    }
    cb(null, true);
  }
}).single('image');

// Validation function
const validateEventData = (data) => {
  const { title, description, location, date } = data;
  if (!title) return "Title is required";
  if (!description) return "Description is required";
  if (!location) return "Location is required";
  if (!date) return "Date is required";
  
  // Validate date format
  if (isNaN(new Date(date).getTime())) return "Invalid date format";
  
  return null;
};

// Image upload endpoint
router.post("/upload", authenticateToken, (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    } else if (err) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  });
});
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, location, date, category, eventType, imageUrl, creatorId } = req.body;
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        category,
        eventType,
        imageUrl,
        creator: {
          connect: { id: creatorId }
        }
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

export default router;