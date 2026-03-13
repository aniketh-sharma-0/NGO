const mongoose = require('mongoose');
require('dotenv').config();

async function findId() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    const mysteryId = new mongoose.Types.ObjectId('6968ba8013fa855575de509c');

    console.log(`Searching for ID: ${mysteryId}`);

    for (const col of collections) {
        const found = await db.collection(col.name).findOne({ _id: mysteryId });
        if (found) {
            console.log(`FOUND in collection: ${col.name}`);
            console.log(JSON.stringify(found, null, 2));
        }
    }

    process.exit(0);
}

findId();
