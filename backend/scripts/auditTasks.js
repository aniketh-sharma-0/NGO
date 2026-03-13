const mongoose = require('mongoose');
require('dotenv').config();

async function audit() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const volunteers = await db.collection('volunteers').find({}).toArray();
    const tasks = await db.collection('volunteertasks').find({}).toArray();

    console.log(`Audit: ${volunteers.length} volunteers, ${tasks.length} tasks`);

    for (const v of volunteers) {
        const vTasks = tasks.filter(t => t.volunteer && t.volunteer.toString() === v._id.toString());
        const statusCounts = vTasks.reduce((acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {});
        
        console.log(`Volunteer ${v._id}: ${vTasks.length} total tasks`);
        console.log(`  Statuses: ${JSON.stringify(statusCounts)}`);
        
        const approved = vTasks.filter(t => ['Approved', 'Completed'].includes(t.status));
        if (approved.length > 0) {
            console.log(`  APPROVED TASKS FOUND: ${approved.length}`);
            approved.forEach(t => console.log(`    - Task ${t._id}, Hrs: ${t.assignedHours}`));
        }
    }

    process.exit(0);
}

audit();
