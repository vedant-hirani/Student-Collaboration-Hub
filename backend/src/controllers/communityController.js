import prisma from '../prisma.js';

// Create a new community
export const createCommunity = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;
    const { userId } = req;
    
    const community = await prisma.community.create({
      data: {
        name,
        description,
        category: category || 'Development',
        creator: {
          connect: { id: userId }
        },
        members: {
          connect: { id: userId } // Creator is automatically a member
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: true
      }
    });
    
    res.status(201).json(community);
  } catch (error) {
    next(error);
  }
};

// Get all communities
export const getAllCommunities = async (req, res, next) => {
  try {
    const communities = await prisma.community.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            discussions: true
          }
        }
      },
    });
    
    const formattedCommunities = communities.map(community => ({
      ...community,
      discussionCount: community._count.discussions,
      memberCount: community.members.length,
      _count: undefined // Remove the _count field
    }));
    
    res.status(200).json(formattedCommunities);
  } catch (error) {
    next(error);
  }
};

// Get a community by ID
export const getCommunityById = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          select: {
            id: true,
            name: true
          }
        },
        discussions: {
          include: {
            author: {
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
        }
      }
    });
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    const formattedCommunity = {
      ...community,
      discussionCount: community.discussions.length,
      memberCount: community.members.length,
      discussions: community.discussions.map(disc => ({
        ...disc,
        likeCount: disc._count.likes,
        _count: undefined
      }))
    };
    
    res.status(200).json(formattedCommunity);
  } catch (error) {
    next(error);
  }
};

// Join a community
export const joinCommunity = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const { userId } = req;
    
    // Check if user is already a member
    const existingMember = await prisma.community.findFirst({
      where: {
        id: communityId,
        members: {
          some: {
            id: userId
          }
        }
      }
    });
    
    if (existingMember) {
      return res.status(400).json({ message: "User is already a member of this community" });
    }
    
    const community = await prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
      include: {
        members: true
      }
    });
    
    res.status(200).json({
      message: "Successfully joined the community",
      community: {
        id: community.id,
        name: community.name,
        memberCount: community.members.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Leave a community
export const leaveCommunity = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const { userId } = req;
    
    // Check if user is a member
    const existingMember = await prisma.community.findFirst({
      where: {
        id: communityId,
        members: {
          some: {
            id: userId
          }
        }
      }
    });
    
    if (!existingMember) {
      return res.status(400).json({ message: "User is not a member of this community" });
    }
    
    // Check if user is the creator (creators can't leave their own community)
    const isCreator = await prisma.community.findFirst({
      where: {
        id: communityId,
        createdBy: userId
      }
    });
    
    if (isCreator) {
      return res.status(400).json({ 
        message: "As the creator, you cannot leave your own community. You must either delete it or transfer ownership." 
      });
    }
    
    const community = await prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
      include: {
        members: true
      }
    });
    
    res.status(200).json({
      message: "Successfully left the community",
      community: {
        id: community.id,
        name: community.name,
        memberCount: community.members.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get discussions for a community
export const getCommunityDiscussions = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    
    const discussions = await prisma.discussion.findMany({
      where: { communityId: communityId },
      include: {
        author: {
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