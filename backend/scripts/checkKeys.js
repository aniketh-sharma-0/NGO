const mongoose = require('mongoose');
require('dotenv').config();

async function checkKeys() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    
    console.log(`Checking ${tasks.length} tasks...`);
    tasks.forEach(t => {
        console.log(`Task ${t._id}: [${Object.keys(t).join(', ')}]`);
    });
    process.exit(0);
}

checkKeys();
