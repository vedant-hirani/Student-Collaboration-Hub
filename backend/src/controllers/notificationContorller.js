import { prisma } from "../prismaClient.js";

// Controller to create a new notification
export const createNotification = async (req, res) => {
  const { content, targetUser, targetCommunity } = req.body;
  try {
    const notification = await prisma.notification.create({
      data: {
        content,
        userId: req.user.id, // User creating the notification
        targetUser,
        targetCommunity,
      },
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification" });
  }
};

// Controller to get notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
