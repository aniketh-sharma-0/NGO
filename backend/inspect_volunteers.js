const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Volunteer = require('./models/Volunteer');
const VolunteerTask = require('./models/VolunteerTask');
const User = require('./models/User');

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const volunteers = await Volunteer.find().populate('user', 'name email');
        console.log(`Found ${volunteers.length} volunteers:`);
        
        for (const vol of volunteers) {
            console.log(`- ID: ${vol._id}, User: ${vol.user?.name} (${vol.user?.email}), Status: ${vol.status}`);
            const tasks = await VolunteerTask.find({ volunteer: vol._id });
            console.log(`  Tasks count: ${tasks.length}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
