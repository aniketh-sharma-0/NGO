const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    availability: {
        type: String
    },
    status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending'],
        default: 'Pending'
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    address: {
        type: String
    },
    totalHours: {
        type: Number,
        default: 0
    },
    completedTasks: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
