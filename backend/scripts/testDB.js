const mongoose = require('mongoose');
require('dotenv').config();

const test = async () => {
    try {
        console.log('URI:', process.env.MONGODB_URI ? 'FOUND' : 'NOT FOUND');
        if (!process.env.MONGODB_URI) throw new Error('NO URI');
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        process.exit(0);
    } catch (e) {
        console.error('ERROR:', e.message);
        process.exit(1);
    }
};

test();
