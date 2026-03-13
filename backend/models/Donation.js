const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Government', 'Corporate', 'Voluntary'],
        required: true
    },
    amount: {
        type: Number,
        required: false
    },
    // Donor Details
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
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
        enum: ['Pending', 'Processing', 'Approved', 'Rejected', 'Completed', 'Failed'],
        default: 'Pending'
    },
    transactionId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
