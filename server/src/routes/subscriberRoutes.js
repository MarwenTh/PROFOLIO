const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/subscribe', subscriberController.addSubscriber);
router.post('/unsubscribe', subscriberController.unsubscribe);

// Protected routes
router.get('/', authMiddleware, subscriberController.getSubscribers);
router.delete('/:id', authMiddleware, subscriberController.removeSubscriber);
router.post('/import', authMiddleware, subscriberController.importSubscribers);

// Newsletter routes
router.get('/newsletters', authMiddleware, subscriberController.getNewsletters);
router.post('/newsletters', authMiddleware, subscriberController.createNewsletter);
router.post('/newsletters/:id/send', authMiddleware, subscriberController.sendNewsletter);
router.delete('/newsletters/:id', authMiddleware, subscriberController.deleteNewsletter);

module.exports = router;
