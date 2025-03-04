// eventController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  const { title, description, location, date } = req.body;
  const { userId } = req;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        creatorId: userId,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: true,
        participants: true,
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

export const joinEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req;

  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          connect: { id: userId },
        },
      },
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error joining event", error });
  }
};
