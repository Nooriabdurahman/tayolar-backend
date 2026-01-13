const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createPost, getFeed, toggleLike, followUser } = require('../controllers/social.controller');
const multer = require('multer');

// Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// All routes require authentication
router.use(authMiddleware);

router.get('/feed', getFeed);
router.post('/post', upload.single('image'), createPost); // Assuming you'll add Vercel Blob later or handle it in controller
router.post('/like', toggleLike);
router.post('/follow', followUser);

module.exports = router;
