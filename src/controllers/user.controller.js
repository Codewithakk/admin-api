const User = require('../models/User');
const Role = require('../models/Role');
const successResponse = require('../utils/sucessResponse');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const validator = require('validator');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().populate('roles');

    const filteredUsers = users.filter(user =>
        !user.roles.some(role => role.name.toLowerCase() === 'admin')
    );

    return successResponse(res, 200, 'Non-admin users fetched successfully', filteredUsers);
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('roles');

    if (!user) {
        return errorResponse(res, 404, `User not found with id of ${req.params.id}`);
    }

    return successResponse(res, 200, 'User fetched successfully', user);
});

exports.createUser = asyncHandler(async (req, res, next) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return errorResponse(res, 400, 'Email already in use');
    }

    const user = await User.create(req.body);

    return successResponse(res, 201, 'User created successfully', user);
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;

    if (email && !validator.isEmail(email)) {
        return errorResponse(res, 400, 'Please provide a valid email');
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, email },
        {
            new: true,
            runValidators: true,
        }
    ).populate('roles');

    if (!user) {
        return errorResponse(res, 404, `User not found with id of ${req.params.id}`);
    }

    return successResponse(res, 200, 'User updated successfully', user);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return errorResponse(res, 404, `User not found with id of ${req.params.id}`);
    }

    return successResponse(res, 200, 'User deleted successfully');
});

exports.assignRolesToUser = asyncHandler(async (req, res, next) => {
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
        return errorResponse(res, 400, 'Please provide an array of role IDs');
    }

    const existingRoles = await Role.find({ _id: { $in: roles } });
    if (existingRoles.length !== roles.length) {
        return errorResponse(res, 400, 'One or more roles do not exist');
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { roles: { $each: roles } } },
        { new: true, runValidators: true }
    ).populate('roles');

    if (!user) {
        return errorResponse(res, 404, `User not found with id of ${req.params.id}`);
    }

    return successResponse(res, 200, 'Roles assigned successfully', user);
});
