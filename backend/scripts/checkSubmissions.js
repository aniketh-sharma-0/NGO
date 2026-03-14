const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const VolunteerTask = require('./models/VolunteerTask');
const Volunteer = require('./models/Volunteer');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const tasks = await VolunteerTask.find({ status: 'Submitted' }).populate({
            path: 'volunteer',
            populate: { path: 'user', select: 'name' }
        });
        
        console.log('Total Submitted Tasks:', tasks.length);
        tasks.forEach(t => {
            console.log(`Task: ${t.title}, Volunteer: ${t.volunteer?.user?.name || 'Unknown'}`);
        });

        const volunteers = await Volunteer.find().lean();
        console.log('Total Volunteers:', volunteers.length);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

check();
