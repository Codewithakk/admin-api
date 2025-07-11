require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Role = require('./models/Role');
const Permission = require('./models/Permission');
const { hashPassword } = require('./utils/hash');

const runSeed = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding...');

    // CLEAR old data
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    console.log('Cleared existing data.');

    // Create permissions
    const manageUsers = await new Permission({
        name: 'manage_users',
        description: 'Can manage users',
    }).save();

    const manageRoles = await new Permission({
        name: 'manage_roles',
        description: 'Can manage roles',
    }).save();

    const viewReports = await new Permission({
        name: 'view_reports',
        description: 'Can view reports',
    }).save();

    console.log('Created permissions.');

    // Create role: admin
    const adminRole = await new Role({
        name: 'admin',
        description: 'Administrator role',
        permissions: [manageUsers._id, manageRoles._id, viewReports._id],
    }).save();

    // Create role: manager
    const managerRole = await new Role({
        name: 'manager',
        description: 'Manager role',
        permissions: [viewReports._id],
    }).save();

    console.log('Created roles.');

    // Create default admin user
    const hashed = await hashPassword('admin123');

    const adminUser = await new User({
        name: 'Super Admin',
        email: 'admin@softfix.in',
        password: hashed,
        roles: [adminRole._id],
    }).save();

    console.log('Created default admin user:');
    console.log(`   Email: admin@softfix.in`);
    console.log(`   Password: admin123`);

    await mongoose.disconnect();
    console.log('Seed completed and disconnected from DB.');
};

runSeed();
