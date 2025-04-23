import dotenv from "dotenv";
dotenv.config(); 
import path from 'path';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from'./routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'


const app = express();
const PORT = process.env.PORT || 5000;


// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: 'http://localhost:3000', // Update this to match your frontend URL
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// Routes
app.use('/api/events', eventRoutes);


// Ensure the database connection is established before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to MongoDB:', error);
});  