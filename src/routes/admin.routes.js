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

// Admin Card Routes
router.get('/cards', getAdminCards);
router.get('/cards/active', getActiveAdminCard);
router.post('/cards', upload.single('image'), createAdminCard);
router.put('/cards/:id', upload.single('image'), updateAdminCard);
router.delete('/cards/:id', deleteAdminCard);

// Commission Settings Routes
router.get('/commission/settings', getCommissionSettings);
router.put('/commission/settings', updateCommissionSettings);

// Commission Records Routes
router.get('/commissions', getCommissions);
router.get('/commission/stats', getCommissionStats);

module.exports = router;

