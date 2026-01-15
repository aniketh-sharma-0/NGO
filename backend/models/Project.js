const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Government', 'CSR', 'Client'],
        required: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    images: [String], // Array of image URLs
    projectReport: { type: String }, // URL or text
    financialReport: { type: String }, // URL or text
    members: [{
        name: { type: String },
        position: { type: String }
    }],
    location: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
