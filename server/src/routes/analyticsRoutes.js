const express = require('express');
const router = express.Router();
const { 
  trackView,
  getOverview,
  getPortfolioAnalytics,
  getTrafficSources
} = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for tracking views
router.post('/track', trackView);

// Protected routes
router.get('/overview', authMiddleware, getOverview);
router.get('/portfolio/:portfolioId', authMiddleware, getPortfolioAnalytics);
router.get('/traffic-sources', authMiddleware, getTrafficSources);

module.exports = router;
