const mongoose = require('mongoose');
require('dotenv').config();

async function checkIds() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    const volunteerIds = [...new Set(tasks.map(t => t.volunteer ? t.volunteer.toString() : 'NULL'))];
    
    console.log('Unique Volunteer IDs in Tasks:', volunteerIds);
    
    const volunteers = await db.collection('volunteers').find({}).toArray();
    const volIdSet = new Set(volunteers.map(v => v._id.toString()));
    
    volunteerIds.forEach(id => {
        if (id === 'NULL') return;
        console.log(`ID ${id}: Exists in Volunteers? ${volIdSet.has(id)}`);
    });

    process.exit(0);
}

checkIds();
