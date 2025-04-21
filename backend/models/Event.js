// models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  eventType: { type: String, required: true },
  startDate: { type: String, required: true },
  startTime: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Add this field to track registrations
  registrations: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    registeredAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;