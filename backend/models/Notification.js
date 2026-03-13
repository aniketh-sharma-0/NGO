const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Can be null if the notification is meant for a specific role generally
    },
    role: {
        type: String, // e.g. 'Admin', 'Volunteer', 'User'
        required: false, // Target all users of a specific role
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    redirectLink: {
        type: String,
        required: false,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
