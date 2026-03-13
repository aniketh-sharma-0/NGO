const mongoose = require('mongoose');
require('dotenv').config();

async function globalAudit() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    const allCollections = await db.listCollections().toArray();
    
    const uniqueVolIds = [...new Set(tasks.map(t => t.volunteer ? t.volunteer.toString() : 'NULL'))];
    
    console.log(`Unique Volunteer IDs in Tasks: ${uniqueVolIds.join(', ')}`);
    
    for (const vId of uniqueVolIds) {
        if (vId === 'NULL') continue;
        const objId = new mongoose.Types.ObjectId(vId);
        
        console.log(`\nChecking ID: ${vId}`);
        for (const col of allCollections) {
            const doc = await db.collection(col.name).findOne({ _id: objId });
            if (doc) {
                console.log(`- FOUND in ${col.name}`);
                if (col.name === 'users') console.log(`  User: ${doc.email} (${doc.name})`);
            }
        }
    }

    process.exit(0);
}

globalAudit();
