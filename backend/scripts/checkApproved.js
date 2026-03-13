const mongoose = require('mongoose');
require('dotenv').config();

async function checkApproved() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const approvedTasks = await db.collection('volunteertasks').find({ 
        status: { $in: ['Approved', 'Completed'] } 
    }).toArray();
    const volunteers = await db.collection('volunteers').find({}).toArray();

    console.log(`Found ${approvedTasks.length} Approved/Completed tasks.`);
    approvedTasks.forEach(t => {
        const match = volunteers.find(v => v._id.toString() === t.volunteer.toString());
        console.log(`Task ${t._id}: volunteerId=${t.volunteer}, match=${match ? 'YES' : 'NO'}`);
    });

    process.exit(0);
}

checkApproved();
