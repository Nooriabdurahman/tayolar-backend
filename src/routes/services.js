const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *               - tailorId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Custom Suit Tailoring
 *               description:
 *                 type: string
 *                 example: Professional custom suit tailoring service
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 299.99
 *               delivery:
 *                 type: string
 *                 example: 7-10 business days
 *               category:
 *                 type: string
 *                 example: Suit
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *                 format: email
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               tailorId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       500:
 *         description: Failed to create service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Service'
 *                   - type: object
 *                     properties:
 *                       tailor:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *       500:
 *         description: Failed to fetch services
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
