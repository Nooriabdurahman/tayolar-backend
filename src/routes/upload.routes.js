const express = require('express');
const multer = require('multer');
const { uploadFile, uploadMultipleFiles } = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

/**
 * @swagger
 * /api/upload/single:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       200:
 *         description: Upload success
 */
router.post('/single', authMiddleware, upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       200:
 *         description: Upload success
 */
router.post('/multiple', authMiddleware, upload.array('files', 10), uploadMultipleFiles);

module.exports = router;
