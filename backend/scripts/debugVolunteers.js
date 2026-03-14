const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Fix paths to models
const VolunteerTask = require('../models/VolunteerTask');
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('--- SUBMITTED TASKS ---');
        const tasks = await VolunteerTask.find({ status: 'Submitted' }).lean();
        console.log(`Found ${tasks.length} submitted tasks.`);
        
        for (const t of tasks) {
            const vol = await Volunteer.findById(t.volunteer).populate('user', 'name').lean();
            console.log(`Task ID: ${t._id}, Status: ${t.status}, Volunteer: ${vol?.user?.name || 'Unknown'} (VolID: ${t.volunteer})`);
        }

        console.log('\n--- VOLUNTEERS WITH SUBMISSIONS ---');
        const volunteers = await Volunteer.find().populate('user', 'name').lean();
        for (const v of volunteers) {
            const tCount = await VolunteerTask.countDocuments({ volunteer: v._id, status: 'Submitted' });
            if (tCount > 0) {
                console.log(`Volunteer: ${v.user?.name}, ID: ${v._id}, Pending Submissions: ${tCount}`);
            }
        }

        process.exit();
    } catch (e) {
        console.error('Debug script error:', e);
        process.exit(1);
    }
};

debug();
