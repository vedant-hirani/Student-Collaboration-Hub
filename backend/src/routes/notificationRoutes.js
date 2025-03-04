import express from "express";
import prisma from "../prisma.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Notification
router.post("/", authenticateToken, async (req, res) => {
 const { content, targetUser, targetCommunity } = req.body;
 const { userId } = req;
   try {
     const notification = await prisma.notification.create({
       data: {
         content,
         userId: userId, // User creating the notification
         targetUser,
         targetCommunity,
       },
     });
     res.status(201).json(notification);
   } catch (error) {
     console.error("Error creating notification:", error);
     res.status(500).json({ message: "Error creating notification" });
   }});

// Get all Notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        targetUser: true,
        targetCommunity: true,
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
});

export default router;
