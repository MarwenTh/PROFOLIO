const express = require('express');
const router = express.Router();
const { saveIntegration, getIntegrations, deleteIntegration, testIntegration } = require('../controllers/integrationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/save', saveIntegration);
router.get('/', getIntegrations);
router.post('/test/:service_name', testIntegration);
router.delete('/:service_name', deleteIntegration);

module.exports = router;
