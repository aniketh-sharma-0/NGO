const mongoose = require('mongoose');
require('dotenv').config();

async function fullAudit() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    const volunteers = await db.collection('volunteers').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();
    
    console.log(`Checking ${tasks.length} tasks...`);
    
    for (const task of tasks) {
        const vol = volunteers.find(v => v._id.toString() === (task.volunteer ? task.volunteer.toString() : ''));
        const user = vol ? users.find(u => u._id.toString() === vol.user.toString()) : null;
        
        console.log(`Task ${task._id}: [${task.status}] User: ${user ? user.email : 'UNKNOWN'}, Title: ${task.title}, Hrs: ${task.assignedHours}`);
    }

    process.exit(0);
}

fullAudit();
