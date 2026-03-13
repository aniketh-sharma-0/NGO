const mongoose = require('mongoose');
require('dotenv').config();

async function listNames() {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases:', dbs.databases.map(d => d.name));
    console.log('Current DB:', mongoose.connection.db.databaseName);
    process.exit(0);
}

listNames();
