const mongoose = require('mongoose');
require('dotenv').config();

async function superMigrate() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    console.log('Starting Super Migration...');
    
    const volunteers = await db.collection('volunteers').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();
    const tasks = await db.collection('volunteertasks').find({}).toArray();
    
    // Create maps for quick lookup
    const userToVolMap = {};
    volunteers.forEach(v => {
        userToVolMap[v.user.toString()] = v._id;
    });
    
    const volIdSet = new Set(volunteers.map(v => v._id.toString()));
    const userIdSet = new Set(users.map(u => u._id.toString()));
    
    let fixCount = 0;
    let hoursFixCount = 0;
    
    for (const task of tasks) {
        let needsUpdate = false;
        const updateDoc = {};
        
        // 1. Fix volunteer ID link
        const currentRef = task.volunteer ? task.volunteer.toString() : null;
        if (currentRef && !volIdSet.has(currentRef)) {
            // Is it a user ID instead?
            if (userToVolMap[currentRef]) {
                updateDoc.volunteer = userToVolMap[currentRef];
                needsUpdate = true;
                fixCount++;
                console.log(`Fixing Task ${task._id}: Linked User ID ${currentRef} -> Volunteer ID ${updateDoc.volunteer}`);
            } else {
                console.log(`Warning: Task ${task._id} has unknown volunteer ref ${currentRef}`);
            }
        }
        
        // 2. Fix assignedHours
        if (task.assignedHours === undefined || task.assignedHours === null) {
            updateDoc.assignedHours = 1;
            needsUpdate = true;
            hoursFixCount++;
        }
        
        if (needsUpdate) {
            await db.collection('volunteertasks').updateOne(
                { _id: task._id },
                { $set: updateDoc }
            );
        }
    }
    
    console.log(`Migration Complete: Fixed ${fixCount} orphaned links, ${hoursFixCount} missing hour fields.`);
    
    // 3. Force re-calculate stats for all volunteers
    console.log('Re-calculating all volunteer stats...');
    const allTasks = await db.collection('volunteertasks').find({}).toArray();
    
    for (const vol of volunteers) {
        const volTasks = allTasks.filter(t => 
            t.volunteer && 
            t.volunteer.toString() === vol._id.toString() && 
            ['Approved', 'Completed'].includes(t.status)
        );
        
        const totalHours = volTasks.reduce((sum, t) => sum + (Number(t.assignedHours) || 0), 0);
        const completedTasks = volTasks.length;
        
        await db.collection('volunteers').updateOne(
            { _id: vol._id },
            { $set: { totalHours, completedTasks } }
        );
        console.log(`Volunteer ${vol._id} (${vol.user}): Hours=${totalHours}, Tasks=${completedTasks}`);
    }

    process.exit(0);
}

superMigrate();
