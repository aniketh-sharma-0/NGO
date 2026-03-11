const express = require('express');
const router = express.Router();
const { createDonation, getDonations, updateDonationStatus } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.post('/', createDonation);
router.get('/', protect, checkRole('Admin'), getDonations);
router.put('/:id/status', protect, checkRole('Admin'), updateDonationStatus);

module.exports = router;
