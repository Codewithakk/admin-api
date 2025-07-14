const Permission = require('../models/Permission');
const successResponse = require('../utils/sucessResponse');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllPermissions = asyncHandler(async (req, res, next) => {
    const permissions = await Permission.find();
    return successResponse(res, 200, 'Permissions fetched successfully', permissions);
});

exports.createPermission = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
        return errorResponse(res, 400, 'Permission with this name already exists');
    }

    const permission = await Permission.create({ name, description });

    return successResponse(res, 201, 'Permission created successfully', permission);
});
