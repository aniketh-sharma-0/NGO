const mongoose = require('mongoose');
require('dotenv').config();

async function checkVolunteers() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const users = await db.collection('users').find({}).toArray();
    const volunteers = await db.collection('volunteers').find({}).toArray();
    const tasks = await db.collection('volunteertasks').find({}).toArray();

    console.log(`Total Users: ${users.length}`);
    console.log(`Total Volunteers (Profiles): ${volunteers.length}`);
    console.log(`Total Tasks: ${tasks.length}`);

    // Find users who have Volunteer role but no profile?
    // We don't know the role ID for Volunteer, so let's look at the users
    users.forEach(u => {
        const profile = volunteers.find(v => v.user.toString() === u._id.toString());
        console.log(`User ${u.email}: Role=${JSON.stringify(u.role)}, Profile=${profile ? profile._id : 'MISSING'}`);
    });

    process.exit(0);
}

checkVolunteers();
