const mongoose = require('mongoose');

const chatIntentSchema = new mongoose.Schema({
    keywords: [{
        type: String,
        required: true
    }],
    question: { // The canonical questions, e.g. "How do I donate?"
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['General', 'Donation', 'Volunteer', 'Project'],
        default: 'General'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatIntent', chatIntentSchema);
