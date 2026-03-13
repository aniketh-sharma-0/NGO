const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Volunteer = require('./models/Volunteer');
const VolunteerTask = require('./models/VolunteerTask');

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const volunteers = await Volunteer.find();
        for (const vol of volunteers) {
            const tasks = await VolunteerTask.find({ volunteer: vol._id });
            console.log(`VOL_ID:${vol._id}|TASKS:${tasks.length}`);
        }
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
};
checkData();
