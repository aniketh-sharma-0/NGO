const mongoose = require('mongoose');

const volunteerTaskSchema = new mongoose.Schema({
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Assigned', 'InProgress', 'Submitted', 'Approved', 'Rejected'],
        default: 'Assigned'
    },
    dueDate: {
        type: Date
    },
    // Submission Details
    submissionText: {
        type: String
    },
    submissionImage: {
        type: String
    },
    submittedAt: {
        type: Date
    },
    feedback: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VolunteerTask', volunteerTaskSchema);
