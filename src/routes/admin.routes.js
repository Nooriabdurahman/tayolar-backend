const express = require('express');
const multer = require('multer');
const {
  getAdminCards,
  createAdminCard,
  updateAdminCard,
  deleteAdminCard,
  getActiveAdminCard,
  getCommissionSettings,
  updateCommissionSettings,
  getCommissions,
  getCommissionStats,
} = require('../controllers/admin.controller');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Apply admin middleware to all routes
router.use(adminMiddleware);

/**
 * @swagger
 * /api/admin/cards:
 *   get:
 *     summary: Get all admin cards
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminCard'
 *       500:
 *         description: Error fetching admin cards
 */
router.get('/cards', getAdminCards);

/**
 * @swagger
 * /api/admin/cards/active:
 *   get:
 *     summary: Get active admin card
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active admin card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminCard'
 *       500:
 *         description: Error fetching active admin card
 */
router.get('/cards/active', getActiveAdminCard);

/**
 * @swagger
 * /api/admin/cards:
 *   post:
 *     summary: Create a new admin card
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cardNumber
 *               - cardHolder
 *               - expiry
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 example: '1234 5678 9012 3456'
 *               cardHolder:
 *                 type: string
 *                 example: 'John Doe'
 *               expiry:
 *                 type: string
 *                 example: '12/25'
 *               cvc:
 *                 type: string
 *                 example: '123'
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Admin card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminCard'
 *       500:
 *         description: Error creating admin card
 */
router.post('/cards', upload.single('image'), createAdminCard);

/**
 * @swagger
 * /api/admin/cards/{id}:
 *   put:
 *     summary: Update an admin card
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Admin card ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cardNumber:
 *                 type: string
 *               cardHolder:
 *                 type: string
 *               expiry:
 *                 type: string
 *               cvc:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Admin card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminCard'
 *       500:
 *         description: Error updating admin card
 */
router.put('/cards/:id', upload.single('image'), updateAdminCard);

/**
 * @swagger
 * /api/admin/cards/{id}:
 *   delete:
 *     summary: Delete an admin card
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Admin card ID
 *     responses:
 *       200:
 *         description: Card deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Card deleted successfully
 *       500:
 *         description: Error deleting admin card
 */
router.delete('/cards/:id', deleteAdminCard);

/**
 * @swagger
 * /api/admin/commission/settings:
 *   get:
 *     summary: Get commission settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Commission settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommissionSettings'
 *       500:
 *         description: Error fetching commission settings
 */
router.get('/commission/settings', getCommissionSettings);

/**
 * @swagger
 * /api/admin/commission/settings:
 *   put:
 *     summary: Update commission settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rate
 *             properties:
 *               rate:
 *                 type: number
 *                 format: float
 *                 example: 10.0
 *                 description: Commission rate in percentage
 *     responses:
 *       200:
 *         description: Commission settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommissionSettings'
 *       500:
 *         description: Error updating commission settings
 */
router.put('/commission/settings', updateCommissionSettings);

/**
 * @swagger
 * /api/admin/commissions:
 *   get:
 *     summary: Get all commission records
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of commission records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Commission'
 *                   - type: object
 *                     properties:
 *                       order:
 *                         type: object
 *                         properties:
 *                           client:
 *                             type: object
 *                           tailor:
 *                             type: object
 *       500:
 *         description: Error fetching commissions
 */
router.get('/commissions', getCommissions);

/**
 * @swagger
 * /api/admin/commission/stats:
 *   get:
 *     summary: Get commission statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Commission statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAmount:
 *                   type: number
 *                   format: float
 *                   example: 5000.00
 *                 totalCount:
 *                   type: number
 *                   example: 50
 *                 paidAmount:
 *                   type: number
 *                   format: float
 *                   example: 3000.00
 *                 currentRate:
 *                   type: number
 *                   format: float
 *                   example: 10.0
 *       500:
 *         description: Error fetching commission stats
 */
router.get('/commission/stats', getCommissionStats);

module.exports = router;

