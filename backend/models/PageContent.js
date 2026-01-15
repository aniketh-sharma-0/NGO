const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can be string, object (for advanced content), or array
        required: true
    },
    section: {
        type: String, // e.g., 'Home', 'About', 'Contact'
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PageContent', pageContentSchema);
