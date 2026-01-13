const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getUserOrders);

module.exports = router;
