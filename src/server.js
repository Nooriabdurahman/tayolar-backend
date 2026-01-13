const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const serviceRoutes = require('./routes/services');
const jobRoutes = require('./routes/jobs');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');
const orderRoutes = require('./routes/order');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Tailor Marketplace API Documentation',
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);


// Public route to get active admin card (for users to see)
const adminController = require('./controllers/admin.controller');

/**
 * @swagger
 * /api/cards/active:
 *   get:
 *     summary: Get active admin card (public endpoint)
 *     tags: [Public]
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
app.get('/api/cards/active', adminController.getActiveAdminCard);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Tailor Marketplace API is running
 */
app.get('/', (req, res) => {
  res.send('Tailor Marketplace API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
