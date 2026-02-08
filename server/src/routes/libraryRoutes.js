const express = require('express');
const router = express.Router();
const { 
  getMedia, 
  addMedia, 
  deleteMedia,
  searchUnsplash,
  createCollection,
  getCollections,
  addToCollection,
  removeFromCollection,
  getCollectionItems
} = require('../controllers/libraryController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Media
router.get('/', getMedia);
router.post('/', addMedia);
router.delete('/:id', deleteMedia);

// Unsplash
router.get('/unsplash/search', searchUnsplash);

// Collections
router.get('/collections', getCollections);
router.post('/collections', createCollection);
router.get('/collections/:id', getCollectionItems);
router.post('/collections/:id/items', addToCollection);
router.delete('/collections/:id/items/:mediaId', removeFromCollection);

module.exports = router;
