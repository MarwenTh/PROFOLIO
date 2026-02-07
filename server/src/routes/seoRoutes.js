const express = require('express');
const router = express.Router();
const { getSeoSettings, updateSeoSettings } = require('../controllers/seoController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/:portfolioId', getSeoSettings);
router.put('/:portfolioId', updateSeoSettings);

module.exports = router;
