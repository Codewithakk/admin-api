const Permission = require('../models/Permission');

exports.getAllPermissions = async () => {
    return await Permission.find();
};

exports.getPermissionById = async (permissionId) => {
    const permission = await Permission.findById(permissionId);
    if (!permission) {
        throw new Error('Permission not found');
    }
    return permission;
};

exports.createPermission = async (permissionData) => {
    // Check if permission name already exists
    const existingPermission = await Permission.findOne({ name: permissionData.name });
    if (existingPermission) {
        throw new Error('Permission name already exists');
    }

    const permission = await Permission.create(permissionData);
    return permission;
};

exports.updatePermission = async (permissionId, updateData) => {
    // Prevent name change
    if (updateData.name) {
        throw new Error('Permission name cannot be changed');
    }

    const permission = await Permission.findByIdAndUpdate(
        permissionId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!permission) {
        throw new Error('Permission not found');
    }

    return permission;
};

exports.deletePermission = async (permissionId) => {
    // Check if any role has this permission
    const rolesWithPermission = await Role.countDocuments({ permissions: permissionId });
    if (rolesWithPermission > 0) {
        throw new Error('Cannot delete permission assigned to roles');
    }

    const permission = await Permission.findByIdAndDelete(permissionId);
    if (!permission) {
        throw new Error('Permission not found');
    }
    return { message: 'Permission deleted successfully' };
};