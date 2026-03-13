const mongoose = require('mongoose');
require('dotenv').config();

async function checkRecentTasks() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const tasks = await db.collection('volunteertasks').find({}).sort({ createdAt: -1 }).limit(5).toArray();
    const volunteers = await db.collection('volunteers').find({}).toArray();

    console.log('--- RECENT TASKS ---');
    tasks.forEach(t => {
        const match = volunteers.find(v => v._id.toString() === t.volunteer.toString());
        console.log(`Task ${t._id}: status=${t.status}, assignedHours=${t.assignedHours}, volunteerId=${t.volunteer}`);
        console.log(`  Matches Volunteer Doc: ${match ? 'YES' : 'NO'}`);
    });

    process.exit(0);
}

checkRecentTasks();
