const express = require('express');
const router = express.Router();
const { submitContactForm, getMessages } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.post('/', submitContactForm);
router.get('/', protect, checkRole('Admin'), getMessages);

module.exports = router;
