const express = require('express');
const { getProfile, updateProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     profile:
 *                       $ref: '#/components/schemas/Profile'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *               avatar:
 *                 type: string
 *                 format: binary

 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       500:
 *         description: Server error
 */
router.put('/profile', upload.single('avatar'), updateProfile);


module.exports = router;
