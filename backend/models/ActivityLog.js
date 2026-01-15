const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        required: true
    },
    resource: {
        type: String, // e.g., 'Project', 'Donation'
        required: true
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: mongoose.Schema.Types.Mixed // Flexible field for extra data
    },
    ipAddress: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
