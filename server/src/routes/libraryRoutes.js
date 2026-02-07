const express = require('express');
const router = express.Router();
const { getMedia, addMedia, deleteMedia } = require('../controllers/libraryController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getMedia);
router.post('/', addMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
