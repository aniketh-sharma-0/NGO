const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const roleSchema = new mongoose.Schema({ name: String });
const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

const userSchema = new mongoose.Schema({ name: String, role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' } });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const checkRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const roles = await Role.find();
        console.log('--- ALL ROLES ---');
        roles.forEach(r => console.log(`Role: "${r.name}", ID: ${r._id}`));
        
        const users = await User.find().populate('role');
        console.log('\n--- USERS BY ROLE ---');
        users.forEach(u => console.log(`User: ${u.name}, Role: ${u.role?.name || 'NONE'}`));
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkRoles();
