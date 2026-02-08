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
  getCollectionItems,
  getSearchHistory,
  saveSearchHistory,
  updateCollection,
  deleteCollection
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
router.patch('/collections/:id', updateCollection);
router.delete('/collections/:id', deleteCollection);
router.post('/collections/:id/items', addToCollection);
router.delete('/collections/:id/items/:mediaId', removeFromCollection);

// Search History
router.get('/search-history', getSearchHistory);
router.post('/search-history', saveSearchHistory);

module.exports = router;
