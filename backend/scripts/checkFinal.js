const mongoose = require('mongoose');
require('dotenv').config();

const VolunteerTask = mongoose.model('VolunteerTask', new mongoose.Schema({
    volunteer: mongoose.Schema.Types.ObjectId,
    status: String,
    assignedHours: Number
}, { collection: 'volunteertasks' }));

const Volunteer = mongoose.model('Volunteer', new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalHours: Number,
    completedTasks: Number
}, { collection: 'volunteers' }));

mongoose.model('User', new mongoose.Schema({ email: String }));

async function checkFinal() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Exact logic from adminController
    const vol = await Volunteer.findById('69b2ebd63098f98a3b313fa8').populate('user');
    
    const tasks = await VolunteerTask.find({ 
        volunteer: vol._id, 
        status: { $in: ['Approved', 'Completed'] }
    });
    
    const totalHours = tasks.reduce((sum, task) => sum + (Number(task.assignedHours) || 0), 0);
    const completedTasks = tasks.length;
    
    const volObj = vol.toObject();
    volObj.totalHours = totalHours;
    volObj.completedTasks = completedTasks;
    
    console.log('--- STATS FOR VOLUNTEER 69b2ebd63098f98a3b313fa8 ---');
    console.log(`Email: ${vol.user?.email}`);
    console.log(`Hours: ${volObj.totalHours}`);
    console.log(`Tasks: ${volObj.completedTasks}`);

    process.exit(0);
}

checkFinal();
