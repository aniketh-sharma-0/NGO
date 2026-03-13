const mongoose = require('mongoose');
require('dotenv').config();

const VolunteerTask = mongoose.model('VolunteerTask', new mongoose.Schema({
    volunteer: mongoose.Schema.Types.ObjectId,
    status: String,
    assignedHours: Number
}, { collection: 'volunteertasks' }));

const Volunteer = mongoose.model('Volunteer', new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    totalHours: Number,
    completedTasks: Number
}, { collection: 'volunteers' }));

async function debugStepByStep() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the volunteer that SHOULD have stats (the one from my previous tests)
    const vol = await Volunteer.findOne({ totalHours: { $gt: 0 } }); // If sync worked
    // If sync didn't work, find the one associated with the approved task
    const approvedTask = await VolunteerTask.findOne({ status: 'Approved' });
    
    if (!approvedTask) {
        console.log('NO APPROVED TASKS FOUND. Manual approval failed?');
        process.exit(0);
    }
    
    const targetVolId = approvedTask.volunteer;
    console.log(`Target Volunteer ID: ${targetVolId}`);
    
    const tasks = await VolunteerTask.find({ 
        volunteer: targetVolId,
        status: { $in: ['Approved', 'Completed'] }
    });
    
    console.log(`Tasks for Volunteer: Found ${tasks.length}`);
    tasks.forEach(t => console.log(`  - Task ${t._id}, status=${t.status}, assignedHours=${t.assignedHours}`));
    
    const totalHours = tasks.reduce((sum, task) => sum + (Number(task.assignedHours) || 0), 0);
    const completedTasks = tasks.length;
    
    console.log(`Calculated: Hours=${totalHours}, Tasks=${completedTasks}`);

    process.exit(0);
}

debugStepByStep();
