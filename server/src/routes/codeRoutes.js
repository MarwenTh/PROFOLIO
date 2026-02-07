const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route
router.get('/public', codeController.getPublicSnippets);

// Protected routes
router.get('/', authMiddleware, codeController.getCodeSnippets);
router.post('/', authMiddleware, codeController.createSnippet);
router.put('/:id', authMiddleware, codeController.updateSnippet);
router.delete('/:id', authMiddleware, codeController.deleteSnippet);

module.exports = router;
