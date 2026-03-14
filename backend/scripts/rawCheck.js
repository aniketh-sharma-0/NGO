const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const rawCheck = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        console.log('--- RAW COLLECTIONS ---');
        const collections = await db.listCollections().toArray();
        collections.forEach(c => console.log(c.name));

        const tasksCol = db.collection('volunteertasks');
        const volsCol = db.collection('volunteers');

        const allTasks = await tasksCol.find({}).toArray();
        console.log(`\nFound ${allTasks.length} tasks in raw collection.`);

        const submittedTasks = allTasks.filter(t => t.status && t.status.toLowerCase() === 'submitted');
        console.log(`Found ${submittedTasks.length} submitted tasks (case-insensitive check).`);

        for (const t of submittedTasks) {
            console.log(`- Task: "${t.title}", Status: "${t.status}", VolID: ${t.volunteer}`);
        }

        const allVols = await volsCol.find({}).toArray();
        console.log(`\nFound ${allVols.length} volunteers in raw collection.`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

rawCheck();
