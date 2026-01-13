const { PrismaClient } = require('@prisma/client');
const { uploadToBlob } = require('../utils/blobUpload');


const prisma = new PrismaClient();

// Get Current User Profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }, // Include the profile relation
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove password from response
        const { password, ...userData } = user;
        res.json(userData);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, bio, location } = req.body;
        let avatarUrl = req.body.avatarUrl;

        if (req.file) {
            avatarUrl = await uploadToBlob(req.file.originalname, req.file.buffer, 'avatars');
        }


        // Update User Model (Basic Info)
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name },
        });

        // Upsert Profile Model (Detailed Info)
        const upsertProfile = await prisma.profile.upsert({
            where: { userId: userId },
            update: { bio, location, avatarUrl },
            create: { userId: userId, bio, location, avatarUrl },
        });

        res.json({ message: 'Profile updated successfully', user: updatedUser, profile: upsertProfile });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile };
