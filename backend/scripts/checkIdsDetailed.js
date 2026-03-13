const mongoose = require('mongoose');
require('dotenv').config();

async function checkIdsDetailed() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    console.log('--- VOLUNTEERS ---');
    const volunteers = await db.collection('volunteers').find({}).toArray();
    for (const v of volunteers) {
        const user = await db.collection('users').findOne({ _id: v.user });
        console.log(`Volunteer ${v._id}: UserID=${v.user}, Email=${user ? user.email : 'NONE'}`);
    }

    console.log('\n--- UNIQUE VOLUNTEER IDS IN TASKS ---');
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    const volunteerIdsInTasks = [...new Set(tasks.map(t => t.volunteer ? t.volunteer.toString() : 'NULL'))];
    
    for (const id of volunteerIdsInTasks) {
        if (id === 'NULL') continue;
        const exists = volunteers.some(v => v._id.toString() === id);
        console.log(`ID in Tasks: ${id}, Exists in Volunteers? ${exists}`);
        
        // If it doesn't exist, check what it might be
        if (!exists) {
            const user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(id) });
            if (user) {
                console.log(`  -> This ID is actually a USER ID for: ${user.email}`);
            } else {
                console.log(`  -> This ID is unknown.`);
            }
        }
    }

    process.exit(0);
}

checkIdsDetailed();
