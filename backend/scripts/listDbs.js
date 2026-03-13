const mongoose = require('mongoose');
require('dotenv').config();

async function listDbs() {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('--- DATABASES ---');
    console.log(JSON.stringify(dbs, null, 2));
    
    console.log('\nCurrent Database:', mongoose.connection.db.databaseName);
    
    process.exit(0);
}

listDbs();
