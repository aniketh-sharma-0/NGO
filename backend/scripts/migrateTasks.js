const mongoose = require('mongoose');
require('dotenv').config();

async function migrate() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    console.log('Starting migration...');
    
    // 1. Fix assignedHours
    const result1 = await db.collection('volunteertasks').updateMany(
        { assignedHours: { $exists: false } },
        { $set: { assignedHours: 1 } }
    );
    console.log(`Updated ${result1.modifiedCount} tasks with default assignedHours.`);

    const result2 = await db.collection('volunteertasks').updateMany(
        { assignedHours: null },
        { $set: { assignedHours: 1 } }
    );
    console.log(`Updated ${result2.modifiedCount} tasks with null assignedHours.`);

    // 2. Fix potential string IDs in volunteer field
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    let idFixes = 0;
    for (const t of tasks) {
        if (typeof t.volunteer === 'string') {
            await db.collection('volunteertasks').updateOne(
                { _id: t._id },
                { $set: { volunteer: new mongoose.Types.ObjectId(t.volunteer) } }
            );
            idFixes++;
        }
    }
    console.log(`Fixed ${idFixes} tasks with string volunteer IDs.`);

    process.exit(0);
}

migrate();
