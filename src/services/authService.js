const User = require('../models/User');
const Role = require('../models/Role');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

exports.registerUser = async (userData) => {
    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Assign basic role if not specified
    if (!userData.roles || userData.roles.length === 0) {
        const basicRole = await Role.findOne({ name: 'basic' });
        if (!basicRole) throw new Error('Default role not found');
        userData.roles = [basicRole._id];
    }

    // Create user
    const user = await User.create({
        ...userData,
        password: hashedPassword
    });

    // Return user data without password
    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
};

exports.loginUser = async ({ email, password }) => {
    // Find user with roles populated
    const user = await User.findOne({ email })
        .populate({
            path: 'roles',
            populate: { path: 'permissions' }
        });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken({
        id: user._id,
        roles: user.roles.map(role => role.name)
    });

    // Prepare user data to return
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
};

exports.getCurrentUser = async (userId) => {
    const user = await User.findById(userId)
        .select('-password')
        .populate({
            path: 'roles',
            populate: { path: 'permissions' }
        });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};