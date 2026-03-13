const mongoose = require('mongoose');
require('dotenv').config();

async function checkOrphans() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const vols = await db.collection('volunteers').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();
    const userIdSet = new Set(users.map(u => u._id.toString()));

    console.log(`Checking ${vols.length} volunteers against ${users.length} users...`);
    vols.forEach(v => {
        const uId = v.user ? v.user.toString() : 'NULL';
        const exists = userIdSet.has(uId);
        console.log(`Volunteer ${v._id}: user=${uId}, exists=${exists}`);
    });

    process.exit(0);
}

checkOrphans();
