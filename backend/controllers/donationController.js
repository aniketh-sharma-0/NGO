const Donation = require('../models/Donation');
const { createNotification } = require('./notificationController');

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

        // Trigger Admin notification
        await createNotification({
            role: 'Admin',
            title: 'New Donation Received',
            message: `${name} has made a new donation.`,
            type: 'New Donation',
            redirectLink: '/dashboard'
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

// @desc    Update donation status (Admin)
// @route   PUT /api/donations/:id/status
// @access  Private/Admin
const updateDonationStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.status = status;
        await donation.save();

        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDonation,
    getDonations,
    updateDonationStatus
};
