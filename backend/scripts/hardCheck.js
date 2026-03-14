const mongoose = require('mongoose');

const uri = "mongodb+srv://anikethsharma2146_db_user:yrds_NGO.org@cluster0.clseaui.mongodb.net/ngoDB?appName=Cluster0";

async function check() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        
        const tasks = await mongoose.connection.db.collection('volunteertasks').find({}).toArray();
        console.log(`Total tasks found: ${tasks.length}`);
        
        const submitted = tasks.filter(t => t.status && t.status.toLowerCase() === 'submitted');
        console.log(`Submitted tasks (case-insensitive): ${submitted.length}`);
        
        for(const t of submitted) {
            console.log(`- [${t.status}] Title: "${t.title}", VolID: ${t.volunteer}`);
        }
        
        const volunteers = await mongoose.connection.db.collection('volunteers').find({}).toArray();
        console.log(`Total volunteers found: ${volunteers.length}`);
        for(const v of volunteers) {
            console.log(`- VolID: ${v._id}, Name (from user ref?): ${v.user}`);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
