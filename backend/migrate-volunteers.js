const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Volunteer = require('./models/Volunteer');

dotenv.config();

const migrateVolunteers = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const activeResult = await Volunteer.updateMany(
            { status: 'Active' },
            { $set: { status: 'Approved' } }
        );
        console.log(`Migrated ${activeResult.modifiedCount} 'Active' volunteers to 'Approved'.`);

        const inactiveResult = await Volunteer.updateMany(
            { status: 'Inactive' },
            { $set: { status: 'Rejected' } }
        );
        console.log(`Migrated ${inactiveResult.modifiedCount} 'Inactive' volunteers to 'Rejected'.`);

        console.log('Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateVolunteers();
