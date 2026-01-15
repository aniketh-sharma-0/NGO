const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Government', 'Corporate', 'Voluntary'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    // Donor Details
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    organization: { // For Government/Corporate
        type: String
    },
    address: {
        type: String
    },
    pan: { // Tax requirement
        type: String
    },
    // Meta
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Failed'],
        default: 'Pending'
    },
    transactionId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
