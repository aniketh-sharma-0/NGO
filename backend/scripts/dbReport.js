const mongoose = require('mongoose');
const fs = require('fs');

const uri = "mongodb+srv://anikethsharma2146_db_user:yrds_NGO.org@cluster0.clseaui.mongodb.net/ngoDB?appName=Cluster0";

async function check() {
    try {
        await mongoose.connect(uri);
        const tasks = await mongoose.connection.db.collection('volunteertasks').find({}).toArray();
        const volunteers = await mongoose.connection.db.collection('volunteers').find({}).toArray();
        
        const report = {
            tasks: tasks.map(t => ({ id: t._id, title: t.title, status: t.status, volID: t.volunteer })),
            volunteers: volunteers.map(v => ({ id: v._id, user: v.user, status: v.status })),
            submittedTasks: tasks.filter(t => t.status && t.status.toLowerCase() === 'submitted').map(t => ({ id: t._id, volID: t.volunteer }))
        };
        
        fs.writeFileSync('db_report.json', JSON.stringify(report, null, 2));
        console.log("Report generated in db_report.json");
        process.exit(0);
    } catch (e) {
        console.error(e);
        fs.writeFileSync('db_report.json', JSON.stringify({ error: e.message }));
        process.exit(1);
    }
}

check();
