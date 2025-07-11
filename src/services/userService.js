const User = require('../models/User');
const Role = require('../models/Role');

exports.getAllUsers = async () => {
    return await User.find()
        .select('-password')
        .populate('roles');
};

exports.getUserById = async (userId) => {
    const user = await User.findById(userId)
        .select('-password')
        .populate('roles');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

exports.createUser = async (userData) => {
    // Check if email exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    // Create user without password if not provided
    if (!userData.password) {
        delete userData.password;
    }

    const user = await User.create(userData);
    return user.toObject();
};

exports.updateUser = async (userId, updateData) => {
    // Prevent email update
    if (updateData.email) {
        throw new Error('Email cannot be changed');
    }

    // Prevent password update through this service
    if (updateData.password) {
        delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    )
        .select('-password')
        .populate('roles');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

exports.deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
};

exports.assignRolesToUser = async (userId, roleIds) => {
    // Check if roles exist
    const roles = await Role.find({ _id: { $in: roleIds } });
    if (roles.length !== roleIds.length) {
        throw new Error('One or more roles not found');
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { roles: { $each: roleIds } } },
        { new: true }
    )
        .select('-password')
        .populate('roles');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

exports.removeRolesFromUser = async (userId, roleIds) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { roles: { $in: roleIds } } },
        { new: true }
    )
        .select('-password')
        .populate('roles');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};