const Role = require('../models/Role');
const Permission = require('../models/Permission');
const successResponse = require('../utils/sucessResponse');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllRoles = asyncHandler(async (req, res, next) => {
    const roles = await Role.find().populate('permissions');
    return successResponse(res, 200, 'Roles fetched successfully', roles);
});

exports.createRole = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
        return errorResponse(res, 400, 'Role with this name already exists');
    }

    const role = await Role.create({ name, description });

    return successResponse(res, 201, 'Role created successfully', role);
});

exports.assignPermissionsToRole = asyncHandler(async (req, res, next) => {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
        return errorResponse(res, 400, 'Please provide an array of permission IDs');
    }

    const existingPermissions = await Permission.find({ _id: { $in: permissions } });
    if (existingPermissions.length !== permissions.length) {
        return errorResponse(res, 400, 'One or more permissions do not exist');
    }

    const role = await Role.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { permissions: { $each: permissions } } },
        { new: true, runValidators: true }
    ).populate('permissions');

    if (!role) {
        return errorResponse(res, 404, `Role not found with id of ${req.params.id}`);
    }

    return successResponse(res, 200, 'Permissions assigned successfully', role);
});

exports.getRolePermissions = asyncHandler(async (req, res, next) => {
    const role = await Role.findById(req.params.id).populate('permissions');

    if (!role) {
        return errorResponse(res, 404, `Role not found with id of ${req.params.id}`);
    }

    return successResponse(res, 200, 'Role permissions fetched successfully', role.permissions);
});
