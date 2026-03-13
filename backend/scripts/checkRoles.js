const mongoose = require('mongoose');
require('dotenv').config();

async function checkRoles() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const roles = await db.collection('roles').find({}).toArray();
    console.log("ROLES IN DB:");
    roles.forEach(r => console.log(` - ${r.name} (${r._id})`));
    
    const users = await db.collection('users').find({}).toArray();
    console.log("\nUSERS WITH ADMIN ROLE:");
    for (const u of users) {
        const role = roles.find(r => r._id.toString() === u.role?.toString());
        if (role && role.name === 'Admin') {
            console.log(` - ${u.name} (${u.email}) -> Role: ${role.name}`);
        }
    }
    process.exit(0);
}

checkRoles();
