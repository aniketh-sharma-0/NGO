const axios = require('axios');

async function checkApi() {
    try {
        // We can't easily call the API because it needs auth.
        // But we can check the database one more time, very aggressively.
        const mongoose = require('mongoose');
        require('dotenv').config();
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        const vols = await db.collection('volunteers').find({}).toArray();
        console.log(`Found ${vols.length} items in 'volunteers' collection.`);
        vols.forEach(v => console.log(` - ${v._id}`));

        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} items in 'users' collection.`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkApi();
