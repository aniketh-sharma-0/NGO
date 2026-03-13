const mongoose = require('mongoose');
require('dotenv').config();

async function debug() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const volunteers = await db.collection('volunteers').find({}).toArray();
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();

    console.log('--- ANALYSIS ---');
    console.log(`Found ${volunteers.length} Volunteers`);
    console.log(`Found ${tasks.length} Tasks`);
    console.log(`Found ${users.length} Users`);

    const volIdSet = new Set(volunteers.map(v => v._id.toString()));
    const userIdSet = new Set(users.map(u => u._id.toString()));

    tasks.forEach(t => {
        const vId = t.volunteer ? t.volunteer.toString() : 'NULL';
        const isVolId = volIdSet.has(vId);
        const isUserId = userIdSet.has(vId);
        
        console.log(`Task ${t._id}: status=${t.status}, assignedHours=${t.assignedHours}, volunteerId=${vId}`);
        console.log(`  Is Volunteer ID? ${isVolId}`);
        console.log(`  Is User ID? ${isUserId}`);
        
        if (isUserId) {
            const volMatch = volunteers.find(v => v.user.toString() === vId);
            console.log(`  Matches Volunteer Doc: ${volMatch ? volMatch._id : 'NONE'}`);
        }
    });

    process.exit(0);
}

debug();
