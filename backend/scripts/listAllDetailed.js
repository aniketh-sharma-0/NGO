const mongoose = require('mongoose');
require('dotenv').config();

const Volunteer = mongoose.model('Volunteer', new mongoose.Schema({ user: mongoose.Schema.Types.ObjectId }));
const User = mongoose.model('User', new mongoose.Schema({ email: String }));

async function listAll() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const vols = await Volunteer.find({}).populate('user');
    console.log(`--- VOLUNTEER PROFILES (${vols.length}) ---`);
    vols.forEach(v => {
        console.log(`ID: ${v._id}, Email: ${v.user ? v.user.email : 'NO USER'}`);
    });

    process.exit(0);
}

listAll();
