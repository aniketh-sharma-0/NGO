const mongoose = require('mongoose');
require('dotenv').config();

async function checkRaw() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const task = await db.collection('volunteertasks').findOne({});
    console.log('--- RAW TASK ---');
    console.log(JSON.stringify(task, null, 2));
    process.exit(0);
}

checkRaw();
