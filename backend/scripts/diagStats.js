const mongoose = require('mongoose');
require('dotenv').config();

// Rough schemas for diagnostic
const VolunteerTask = mongoose.model('VolunteerTask', new mongoose.Schema({
    volunteer: mongoose.Schema.Types.ObjectId,
    status: String,
    assignedHours: Number
}));

const Volunteer = mongoose.model('Volunteer', new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    totalHours: Number,
    completedTasks: Number
}));

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const volunteers = await Volunteer.find().populate('user');
    const tasks = await VolunteerTask.find({});

    console.log('--- VOLUNTEERS ---');
    volunteers.forEach(v => {
        console.log(`Volunteer ID: ${v._id}, User: ${v.user ? v.user.email : 'MISSING USER'}, Stats: ${v.totalHours}/${v.completedTasks}`);
    });

    console.log('\n--- TASKS ---');
    tasks.forEach(t => {
        console.log(`Task ID: ${t._id}, Volunteer ID: ${t.volunteer}, Status: ${t.status}, Hrs: ${t.assignedHours}`);
    });

    process.exit(0);
}

check();
