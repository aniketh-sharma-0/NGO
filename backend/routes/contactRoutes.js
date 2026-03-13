const express = require('express');
const router = express.Router();
const { submitContactForm, getMessages, getUnreadCount, markMessageAsRead, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { contactValidationRules, validate } = require('../middleware/validationMiddleware');

router.post('/', contactValidationRules(), validate, submitContactForm);
router.get('/unread/count', protect, checkRole('Admin'), getUnreadCount);
router.get('/', protect, checkRole('Admin'), getMessages);
router.put('/:id/read', protect, checkRole('Admin'), markMessageAsRead);
router.delete('/:id', protect, checkRole('Admin'), deleteMessage);

module.exports = router;
