const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

testDB();
