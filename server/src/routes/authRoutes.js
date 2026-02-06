const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, socialSync, refreshToken, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/social-sync', socialSync);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected Routes
router.get('/me', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
