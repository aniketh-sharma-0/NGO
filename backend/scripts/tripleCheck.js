const mongoose = require('mongoose');
require('dotenv').config();

const Volunteer = mongoose.model('Volunteer', new mongoose.Schema({ user: mongoose.Schema.Types.ObjectId }));

async function tripleCheck() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const count1 = await Volunteer.countDocuments({});
    const count2 = await db.collection('volunteers').countDocuments({});
    const docs = await Volunteer.find({});
    
    console.log(`Mongoose countDocuments: ${count1}`);
    console.log(`Direct MongoDB countDocuments: ${count2}`);
    console.log(`Mongoose find().length: ${docs.length}`);
    
    if (docs.length > 0) {
        console.log('Sample Mongoose ID:', docs[0]._id);
    }
    
    const directDocs = await db.collection('volunteers').find({}).toArray();
    if (directDocs.length > 0) {
        console.log('Sample Direct ID:', directDocs[0]._id);
    }

    process.exit(0);
}

tripleCheck();
