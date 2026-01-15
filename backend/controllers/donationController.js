const Donation = require('../models/Donation');

// @desc    Create a new donation entry
// @route   POST /api/donations
// @access  Public
const createDonation = async (req, res) => {
    try {
        const { category, amount, name, email, phone, organization, address, pan, message } = req.body;

        const donation = await Donation.create({
            category,
            amount,
            name,
            email,
            phone,
            organization,
            address,
            pan,
            message,
            status: 'Pending' // Default to pending until processed (manual or gateway)
        });

        res.status(201).json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations
// @access  Private/Admin
const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDonation,
    getDonations
};
