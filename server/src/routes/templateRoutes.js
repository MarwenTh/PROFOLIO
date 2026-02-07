const express = require('express');
const router = express.Router();
const { 
  getTemplates, 
  getTemplateById, 
  getUserTemplates,
  useTemplate,
  purchaseTemplate
} = require('../controllers/templateController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTemplates);
router.get('/:id', getTemplateById);

// Protected routes
router.get('/user/purchased', authMiddleware, getUserTemplates);
router.post('/:id/use', authMiddleware, useTemplate);
router.post('/:id/purchase', authMiddleware, purchaseTemplate);

module.exports = router;
