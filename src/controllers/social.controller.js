const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new social post
const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Assuming multer handles file upload
        const userId = req.user.userId;

        const post = await prisma.socialPost.create({
            data: {
                content,
                imageUrl,
                authorId: userId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: { avatarUrl: true }
                        }
                    }
                }
            }
        });

        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get the main feed (Jobs, Services, Posts)
const getFeed = async (req, res) => {
    try {
        // Fetch recent posts
        const posts = await prisma.socialPost.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        profile: { select: { avatarUrl: true } }
                    }
                },
                likes: true
            }
        });

        // Fetch recent jobs
        const jobs = await prisma.job.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        profile: { select: { avatarUrl: true } }
                    }
                }
            }
        });

        // Fetch recent services
        const services = await prisma.service.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                tailor: {
                    select: {
                        id: true,
                        name: true,
                        profile: { select: { avatarUrl: true } }
                    }
                }
            }
        });

        // Combine and sort by date
        const feed = [
            ...posts.map(p => ({ ...p, type: 'POST' })),
            ...jobs.map(j => ({ ...j, type: 'JOB', content: j.description, imageUrl: j.imageUrl })), // Normalize fields
            ...services.map(s => ({ ...s, type: 'SERVICE', content: s.description, imageUrl: s.imageUrl }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(feed);
    } catch (error) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Toggle Like
const toggleLike = async (req, res) => {
    try {
        const { entityId, entityType } = req.body; // entityType: 'POST', 'JOB', 'SERVICE'
        const userId = req.user.userId;

        const existingLike = await prisma.like.findFirst({
            where: {
                userId,
                entityId,
                entityType
            }
        });

        if (existingLike) {
            await prisma.like.delete({ where: { id: existingLike.id } });
            return res.json({ message: 'Unliked', liked: false });
        } else {
            await prisma.like.create({
                data: {
                    userId,
                    entityId,
                    entityType,
                    // If it's a post, link it directly for referential integrity if needed, otherwise rely on entityId
                    postId: entityType === 'POST' ? entityId : undefined
                }
            });
            return res.json({ message: 'Liked', liked: true });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Follow User
const followUser = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const followerId = req.user.userId;

        if (followerId === targetUserId) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId: targetUserId
                }
            }
        });

        if (existingFollow) {
            await prisma.follow.delete({ where: { id: existingFollow.id } });
            return res.json({ message: 'Unfollowed', following: false });
        } else {
            await prisma.follow.create({
                data: {
                    followerId,
                    followingId: targetUserId
                }
            });
            return res.json({ message: 'Followed', following: true });
        }
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createPost,
    getFeed,
    toggleLike,
    followUser
};
