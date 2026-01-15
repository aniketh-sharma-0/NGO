const express = require('express');
const router = express.Router();
const { handleMessage, getIntents, createIntent, updateIntent, deleteIntent } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// Public
router.post('/message', handleMessage);

// Admin
router.get('/intents', protect, checkRole('Admin'), getIntents);
router.post('/intents', protect, checkRole('Admin'), createIntent);
router.put('/intents/:id', protect, checkRole('Admin'), updateIntent);
router.delete('/intents/:id', protect, checkRole('Admin'), deleteIntent);

module.exports = router;
