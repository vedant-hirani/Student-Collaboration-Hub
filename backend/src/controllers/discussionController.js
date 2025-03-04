import prisma from '../prisma.js';

// Create a new discussion
export const createDiscussion = async (req, res, next) => {
  try {
    const { title, content, communityId } = req.body;
    const { userId } = req;
    
    // Check if user is a member of the community
    const isMember = await prisma.community.findFirst({
      where: {
        id: communityId,
        members: {
          some: {
            id: userId
          }
        }
      }
    });
    
    if (!isMember) {
      return res.status(403).json({ 
        message: "You must be a member of the community to create a discussion" 
      });
    }
    
    const discussion = await prisma.discussion.create({
      data: {
        title,
        content,
        author: {
          connect: { id: userId }
        },
        community: {
          connect: { id: communityId }
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    res.status(201).json(discussion);
  } catch (error) {
    next(error);
  }
};

// Get all discussions
export const getAllDiscussions = async (req, res, next) => {
  try {
    const discussions = await prisma.discussion.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const formattedDiscussions = discussions.map(disc => ({
      ...disc,
      likeCount: disc._count.likes,
      _count: undefined
    }));
    
    res.status(200).json(formattedDiscussions);
  } catch (error) {
    next(error);
  }
};

// Get discussion by ID
export const getDiscussionById = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        },
        likes: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    
    res.status(200).json({
      ...discussion,
      likeCount: discussion.likes.length
    });
  } catch (error) {
    next(error);
  }
};

// Like/unlike a discussion
export const toggleLikeDiscussion = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const { userId } = req;
    
    // Check if discussion exists
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        likes: {
          where: {
            id: userId
          }
        }
      }
    });
    
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    
    const hasLiked = discussion.likes.length > 0;
    
    // Toggle like
    if (hasLiked) {
      // Unlike
      await prisma.discussion.update({
        where: { id: discussionId },
        data: {
          likes: {
            disconnect: { id: userId }
          }
        }
      });
      
      res.status(200).json({ 
        message: "Successfully unliked the discussion",
        liked: false
      });
    } else {
      // Like
      await prisma.discussion.update({
        where: { id: discussionId },
        data: {
          likes: {
            connect: { id: userId }
          }
        }
      });
      
      res.status(200).json({ 
        message: "Successfully liked the discussion",
        liked: true
      });
    }
  } catch (error) {
    next(error);
  }
};