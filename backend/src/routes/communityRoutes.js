import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  getCommunityDiscussions
} from "../controllers/communityController.js";

const router = express.Router();

// Create a Community
router.post("/", authenticateToken, createCommunity);

// Get all Communities
router.get("/", getAllCommunities);

// Get Community by ID
router.get("/:communityId", getCommunityById);

// Join a community
router.post("/:communityId/join", authenticateToken, joinCommunity);

// Leave a community
router.delete("/:communityId/leave", authenticateToken, leaveCommunity);

// Get discussions for a community
router.get("/:communityId/discussions", getCommunityDiscussions);

export default router;