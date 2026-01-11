const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new service
router.post('/', async (req, res) => {
    try {
        const { title, description, price, delivery, category, contactPhone, contactEmail, imageUrl, tailorId } = req.body;

        // In a real app, tailorId would come from the authenticated user token
        // For now we accept it in the body or default to a demo user if not present (handled by frontend or middleware)

        const service = await prisma.service.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                delivery,
                category,
                contactPhone,
                contactEmail,
                imageUrl,
                tailorId
            }
        });

        res.status(201).json(service);
    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({ error: "Failed to create service" });
    }
});

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            include: { tailor: { select: { name: true } } }
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

module.exports = router;
