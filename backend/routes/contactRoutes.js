const express = require('express');
const router = express.Router();
const { submitContactForm, getMessages, getUnreadCount, markMessageAsRead } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.post('/', submitContactForm);
router.get('/unread/count', protect, checkRole('Admin'), getUnreadCount);
router.get('/', protect, checkRole('Admin'), getMessages);
router.put('/:id/read', protect, checkRole('Admin'), markMessageAsRead);

module.exports = router;
