const mongoose = require('mongoose');
require('dotenv').config();

const volunteerTaskSchema = new mongoose.Schema({
    volunteer: mongoose.Schema.Types.ObjectId,
    status: String,
    assignedHours: Number
});
const VolunteerTask = mongoose.model('VolunteerTask', volunteerTaskSchema);

const volunteerSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    totalHours: Number,
    completedTasks: Number
});
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const tasks = await VolunteerTask.find({});
        console.log(`Total Tasks: ${tasks.length}`);
        const stats = tasks.reduce((acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {});
        console.log('Task Statuses:', stats);

        const volunteers = await Volunteer.find({});
        console.log('Volunteers Count:', volunteers.length);
        
        for (const v of volunteers) {
            const approved = await VolunteerTask.find({ volunteer: v._id, status: 'Approved' });
            console.log(`Volunteer ${v._id}: Approved Tasks=${approved.length}, Total Hours=${approved.reduce((s, t) => s + (t.assignedHours || 0), 0)}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
