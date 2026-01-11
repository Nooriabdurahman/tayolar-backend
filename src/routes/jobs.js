const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
