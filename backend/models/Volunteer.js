const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    skills: [String],
    availability: {
        type: String
    },
    status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending'],
        default: 'Pending'
    },
    phone: {
        type: String
    },
    address: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
