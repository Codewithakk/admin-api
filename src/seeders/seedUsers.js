const mongoose = require('mongoose');
const faker = require('@faker-js/faker').faker;
const User = require('../models/User');
const Role = require('../models/Role');
const connectDB = require('../config/db');
require('dotenv').config();

(async function seedUsers() {
    try {
        await connectDB();

        // Get user role
        const userRole = await Role.findOne({ name: 'user' });
        if (!userRole) {
            throw new Error('User role not found. Seed roles first.');
        }

        // Delete existing fake users (optional)
        await User.deleteMany({ email: { $ne: 'admin@example.com' } });

        const fakeUsers = [];

        for (let i = 0; i < 20; i++) {
            fakeUsers.push({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: 'Test@1234',
                roles: [userRole._id],
            });
        }

        await User.insertMany(fakeUsers);

        console.log('Fake users seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding users:', err);
        process.exit(1);
    }
})();
