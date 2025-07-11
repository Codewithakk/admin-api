// utils/seedDatabase.js
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const seedDatabase = async () => {
    try {
        // Create default roles if they don't exist
        const defaultRoles = [
            { name: 'admin', description: 'Administrator with full access' },
            { name: 'basic', description: 'Basic user with limited access' }
        ];

        for (const role of defaultRoles) {
            await Role.findOneAndUpdate(
                { name: role.name },
                role,
                { upsert: true, new: true }
            );
        }

        // Create default permissions if needed
        const defaultPermissions = [
            { name: 'view_profile', description: 'Can view own profile' },
            { name: 'edit_profile', description: 'Can edit own profile' }
        ];

        for (const perm of defaultPermissions) {
            await Permission.findOneAndUpdate(
                { name: perm.name },
                perm,
                { upsert: true, new: true }
            );
        }

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;  