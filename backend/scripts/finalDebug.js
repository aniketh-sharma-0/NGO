const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// Manually load schemas to avoid require errors in scripts
const volunteerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String
});
const volunteerTaskSchema = new mongoose.Schema({
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Rejected', 'Assigned', 'Submitted', 'Approved'] },
    title: String
});

const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);
const VolunteerTask = mongoose.models.VolunteerTask || mongoose.model('VolunteerTask', volunteerTaskSchema);

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- CONNECTED TO DB ---');

        const allVolunteers = await Volunteer.find().lean();
        console.log(`Found ${allVolunteers.length} volunteers.`);

        const allTasks = await VolunteerTask.find().lean();
        console.log(`Found ${allTasks.length} total tasks.`);

        const submittedTasks = allTasks.filter(t => t.status === 'Submitted');
        console.log(`Found ${submittedTasks.length} tasks with status "Submitted".`);

        submittedTasks.forEach(t => {
            console.log(`- Task: "${t.title}", VolID: ${t.volunteer}, Status: ${t.status}`);
            const match = allVolunteers.find(v => v._id.toString() === t.volunteer.toString());
            console.log(`  Match found in Volunteer collection? ${!!match}`);
        });

        console.log('\n--- COUNTS BY VOLUNTEER ID ---');
        for (const v of allVolunteers) {
            const count = await VolunteerTask.countDocuments({ volunteer: v._id, status: 'Submitted' });
            if (count > 0) {
                console.log(`Volunteer ${v._id}: ${count} submitted tasks.`);
            }
        }

        process.exit(0);
    } catch (e) {
        console.error('DEBUG ERROR:', e);
        process.exit(1);
    }
};

debug();
