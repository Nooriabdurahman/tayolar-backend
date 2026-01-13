const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const { uploadToBlob } = require('../utils/blobUpload');
const prisma = new PrismaClient();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});


/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting with multiple images
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - budget
 *               - category
 *               - clientId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Need a custom wedding dress
 *               description:
 *                 type: string
 *                 example: Looking for a professional tailor to create a custom wedding dress
 *               budget:
 *                 type: number
 *                 format: float
 *                 example: 1500.00
 *               category:
 *                 type: string
 *                 example: Wedding Dress
 *               delivery:
 *                 type: string
 *                 example: 2024-06-15
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *                 format: email
 *               imageUrl:
 *                 type: string
 *                 description: Fallback/Initial image URL
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 5 reference images
 *               clientId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Job created successfully
 *       500:
 *         description: Failed to create job
 */
// Post a new job with multiple images
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, budget, category, delivery, contactPhone, contactEmail, clientId } = req.body;
        let imageUrls = req.body.imageUrl ? [req.body.imageUrl] : [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                uploadToBlob(file.originalname, file.buffer, 'jobs')
            );
            const newUrls = await Promise.all(uploadPromises);
            imageUrls = [...imageUrls, ...newUrls];
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                budget: parseFloat(budget),
                category,
                delivery,
                contactPhone,
                contactEmail,
                imageUrl: imageUrls.join(','),
                clientId
            }
        });

        res.status(201).json(job);
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ error: "Failed to create job" });
    }
});

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all job postings
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all jobs
 */
// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            include: { client: { select: { name: true } } }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

module.exports = router;
