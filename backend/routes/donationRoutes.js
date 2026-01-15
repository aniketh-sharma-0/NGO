const express = require('express');
const router = express.Router();
const { createDonation, getDonations } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.post('/', createDonation);
router.get('/', protect, checkRole('Admin'), getDonations);

module.exports = router;
