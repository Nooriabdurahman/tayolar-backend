const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 format: uri
 *               clientId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       500:
 *         description: Failed to create job
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Post a new job
router.post('/', async (req, res) => {
    try {
        const { title, description, budget, category, delivery, contactPhone, contactEmail, imageUrl, clientId } = req.body;

        const job = await prisma.job.create({
            data: {
                title,
                description,
                budget: parseFloat(budget),
                category,
                delivery,
                contactPhone,
                contactEmail,
                imageUrl,
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Job'
 *                   - type: object
 *                     properties:
 *                       client:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *       500:
 *         description: Failed to fetch jobs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
