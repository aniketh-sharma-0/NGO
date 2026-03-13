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
    assignedHours: {
        type: Number,
        required: true,
        default: 1 // Adding default for existing tasks avoiding validation errors
    },
    createdByAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Rejected', 'Assigned', 'Submitted', 'Approved'],
        default: 'Pending'
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
    completedAt: {
        type: Date
    },
    feedback: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VolunteerTask', volunteerTaskSchema);
