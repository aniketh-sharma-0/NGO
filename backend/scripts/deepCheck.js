const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// We need to provide the models directly since require paths might be tricky in scripts
const volunteerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String
});
const volunteerTaskSchema = new mongoose.Schema({
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
    status: String,
    title: String
});

const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);
const VolunteerTask = mongoose.models.VolunteerTask || mongoose.model('VolunteerTask', volunteerTaskSchema);

const check = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not found');
        await mongoose.connect(process.env.MONGODB_URI);
        
        const allTasks = await VolunteerTask.find();
        console.log(`Total Tasks in DB: ${allTasks.length}`);
        
        const submittedTasks = allTasks.filter(t => t.status === 'Submitted');
        console.log(`Total Submitted Tasks: ${submittedTasks.length}`);
        
        const volunteers = await Volunteer.find();
        console.log(`Total Volunteers: ${volunteers.length}`);

        for (const vol of volunteers) {
            const vTasks = await VolunteerTask.find({ volunteer: vol._id, status: 'Submitted' });
            console.log(`Volunteer ID: ${vol._id}, Submitted Tasks: ${vTasks.length}`);
        }

        process.exit(0);
    } catch (e) {
        console.error('DIAGNOSTIC FAILED:', e);
        process.exit(1);
    }
};

check();
