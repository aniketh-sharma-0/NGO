const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const tasks = await db.collection('volunteertasks').find({}).toArray();

    console.log('--- ALL TASKS FIELDS ---');
    tasks.forEach(t => {
        console.log(`ID: ${t._id}, Status: ${t.status}, Fields: ${Object.keys(t).join(', ')}`);
        if (t.assignedHours !== undefined) console.log(`  assignedHours: ${t.assignedHours}`);
        if (t.hours !== undefined) console.log(`  hours: ${t.hours}`);
    });

    process.exit(0);
}

check();
