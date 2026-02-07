const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.get('/code', authMiddleware, referralController.getReferralCode);
router.get('/', authMiddleware, referralController.getReferrals);
router.post('/invite', authMiddleware, referralController.sendInvite);

module.exports = router;
