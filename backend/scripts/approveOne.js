const mongoose = require('mongoose');
require('dotenv').config();

const volunteerTaskSchema = new mongoose.Schema({
    volunteer: mongoose.Schema.Types.ObjectId,
    status: String,
    assignedHours: Number
});
const VolunteerTask = mongoose.model('VolunteerTask', volunteerTaskSchema);

async function approveOne() {
    await mongoose.connect(process.env.MONGO_URI);
    const task = await VolunteerTask.findOne({ status: 'Submitted' });
    if (task) {
        console.log(`Approving task: ${task._id}`);
        task.status = 'Approved';
        await task.save();
        console.log('Task Approved.');
    } else {
        console.log('No Submitted tasks found.');
    }
    process.exit(0);
}

approveOne();
