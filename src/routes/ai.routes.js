const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/ai.controller');

// Public route for general info, or protect if needed
router.post('/chat', chat);

module.exports = router;
