const express = require('express');
const router = express.Router();
const { getUserPortfolios, createPortfolio, getPortfolioById, updatePortfolio, getPortfolioBySlug } = require('../controllers/portfolioController');

router.get('/', getUserPortfolios);
router.post('/create', createPortfolio);
router.get('/:id', getPortfolioById);
router.get('/slug/:slug', getPortfolioBySlug);
router.put('/:id', updatePortfolio);

module.exports = router;
