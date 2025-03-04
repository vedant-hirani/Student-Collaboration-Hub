import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createDiscussion,
  getAllDiscussions,
  getDiscussionById,
  toggleLikeDiscussion
} from "../controllers/discussionController.js";

const router = express.Router();

// Create a Discussion
router.post("/", authenticateToken, createDiscussion);

// Get all Discussions
router.get("/", getAllDiscussions);

// Get Discussion by ID
router.get("/:discussionId", getDiscussionById);

// Like/unlike a Discussion
router.post("/:discussionId/like", authenticateToken, toggleLikeDiscussion);

export default router;