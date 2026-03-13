const mongoose = require('mongoose');
require('dotenv').config();

// Rough schemas for diagnostic
const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String }));
const VolunteerTask = mongoose.model('VolunteerTask', new mongoose.Schema({
    volunteer: mongoose.Schema.Types.ObjectId,
    status: String,
    assignedHours: Number
}));

const Volunteer = mongoose.model('Volunteer', new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalHours: Number,
    completedTasks: Number
}));

async function mockGetVolunteers() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const volunteers = await Volunteer.find().populate('user', 'name email');
    
    const volunteersWithStats = await Promise.all(volunteers.map(async (vol) => {
        const tasks = await VolunteerTask.find({ 
            volunteer: vol._id, 
            status: { $in: ['Approved', 'Completed'] }
        });
        
        const totalHours = tasks.reduce((sum, task) => sum + (Number(task.assignedHours) || 0), 0);
        const completedTasks = tasks.length;
        
        const volObj = vol.toObject();
        volObj.totalHours = totalHours;
        volObj.completedTasks = completedTasks;
        
        return volObj;
    }));

    console.log('--- API MOCK RESPONSE ---');
    console.log(JSON.stringify(volunteersWithStats, null, 2));

    process.exit(0);
}

mockGetVolunteers();
