const mongoose = require('mongoose');
require('dotenv').config();

async function dumpAll() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    console.log('--- VOLUNTEER TASKS SAMPLE ---');
    const tasks = await db.collection('volunteertasks').find({}).limit(5).toArray();
    console.log(JSON.stringify(tasks, null, 2));

    console.log('\n--- VOLUNTEERS SAMPLE ---');
    const volunteers = await db.collection('volunteers').find({}).limit(5).toArray();
    console.log(JSON.stringify(volunteers, null, 2));

    process.exit(0);
}

dumpAll();
