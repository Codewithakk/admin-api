const mongoose = require('mongoose');
const Permission = require('../models/Permission');
const connectDB = require('../config/db');
require('dotenv').config();

const permissions = [
    { name: 'manage_users', description: 'Can manage users' },
    { name: 'manage_roles', description: 'Can manage roles' },
    { name: 'manage_permissions', description: 'Can manage permissions' },
    { name: 'view_dashboard', description: 'Can view dashboard' },
];

async function seedPermissions() {
    try {
        await connectDB();

        // Delete existing permissions
        await Permission.deleteMany();

        // Insert new permissions
        await Permission.insertMany(permissions);

        console.log('Permissions seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding permissions:', err);
        process.exit(1);
    }
}

seedPermissions();