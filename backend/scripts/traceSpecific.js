const mongoose = require('mongoose');
require('dotenv').config();

async function traceVolunteers() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const users = await db.collection('users').find({}).toArray();
    const volunteers = await db.collection('volunteers').find({}).toArray();
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    
    const targetNames = ["Super Admin", "demon", "renu", "kirthan", "Test Volunteer", "test"];
    
    for (const name of targetNames) {
        console.log(`\nTRACING: ${name}`);
        const user = users.find(u => (u.name && u.name.includes(name)) || (u.email && u.email.includes(name.toLowerCase())));
        if (!user) {
            console.log(`  User not found for ${name}`);
            continue;
        }
        
        const vol = volunteers.find(v => v.user.toString() === user._id.toString());
        if (!vol) {
            console.log(`  Volunteer Profile not found for ${user.email} (${user._id})`);
            continue;
        }
        
        const volTasks = tasks.filter(t => t.volunteer && t.volunteer.toString() === vol._id.toString());
        console.log(`  Volunteer ID: ${vol._id}, Tasks Found: ${volTasks.length}`);
        volTasks.forEach(t => {
            console.log(`    - Task ${t._id}: status=${t.status}, Title=${t.title}, Hrs=${t.assignedHours}`);
        });
        
        // Also check if there are tasks linked directly to the USER ID for this person
        const orphanedTasks = tasks.filter(t => t.volunteer && t.volunteer.toString() === user._id.toString());
        if (orphanedTasks.length > 0) {
            console.log(`  ORPHANED TASKS (linked to User ID ${user._id}): ${orphanedTasks.length}`);
            orphanedTasks.forEach(t => {
                console.log(`    - Task ${t._id}: status=${t.status}, Title=${t.title}, Hrs=${t.assignedHours}`);
            });
        }
    }

    process.exit(0);
}

traceVolunteers();
