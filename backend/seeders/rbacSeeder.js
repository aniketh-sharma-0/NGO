const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');

dotenv.config();

const seedRBAC = async () => {
    try {
        await connectDB();

        // 1. Create Permissions
        const permissions = [
            { name: 'manage_users', description: 'Can create, update, delete users' },
            { name: 'manage_content', description: 'Can create, update, delete content (blogs, events)' },
            { name: 'manage_projects', description: 'Can create, update, delete projects' },
            { name: 'manage_donations', description: 'Can view and manage donations' },
            { name: 'view_dashboard', description: 'Can view admin dashboard' },
        ];

        console.log('Seeding Permissions...');
        const savedPermissions = [];
        for (const perm of permissions) {
            let p = await Permission.findOne({ name: perm.name });
            if (!p) {
                p = await Permission.create(perm);
            }
            savedPermissions.push(p);
        }

        // 2. Create Roles
        const roles = [
            { name: 'Admin', permissions: savedPermissions.map(p => p._id) }, // Admin has all permissions
            { name: 'Staff', permissions: savedPermissions.filter(p => ['manage_content', 'manage_projects', 'view_dashboard'].includes(p.name)).map(p => p._id) },
            { name: 'Volunteer', permissions: [] },
            { name: 'User', permissions: [] }
        ];

        console.log('Seeding Roles...');
        const savedRoles = {};
        for (const role of roles) {
            let r = await Role.findOne({ name: role.name });
            if (!r) {
                r = await Role.create(role);
            } else {
                // Update permissions if role exists
                r.permissions = role.permissions;
                await r.save();
            }
            savedRoles[role.name] = r;
        }

        // 3. Create Default Admin User
        const adminEmail = 'admin@yrds.org';
        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            console.log('Creating Default Admin User...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            adminUser = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: savedRoles['Admin']._id,
                isVerified: true
            });
            console.log('Admin User Created: admin@yrds.org / admin123');
        } else {
            console.log('Admin User already exists.');
            // Ensure admin role is set
            adminUser.role = savedRoles['Admin']._id;
            await adminUser.save();
        }

        console.log('RBAC Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding RBAC:', error);
        process.exit(1);
    }
};

seedRBAC();
