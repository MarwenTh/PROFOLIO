const express = require('express');
const router = express.Router();
const { updateSlug, getDomains, addDomain, deleteDomain } = require('../controllers/domainController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.put('/slug/:portfolioId', updateSlug);
router.get('/:portfolioId', getDomains);
router.post('/:portfolioId', addDomain);
router.delete('/:domainId', deleteDomain);

module.exports = router;
