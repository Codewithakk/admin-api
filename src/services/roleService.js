const Role = require('../models/Role');
const Permission = require('../models/Permission');

exports.getAllRoles = async () => {
    return await Role.find().populate('permissions');
};

exports.getRoleById = async (roleId) => {
    const role = await Role.findById(roleId).populate('permissions');
    if (!role) {
        throw new Error('Role not found');
    }
    return role;
};

exports.createRole = async (roleData) => {
    // Check if role name already exists
    const existingRole = await Role.findOne({ name: roleData.name });
    if (existingRole) {
        throw new Error('Role name already exists');
    }

    const role = await Role.create(roleData);
    return role;
};

exports.updateRole = async (roleId, updateData) => {
    // Prevent name change
    if (updateData.name) {
        throw new Error('Role name cannot be changed');
    }

    const role = await Role.findByIdAndUpdate(
        roleId,
        updateData,
        { new: true, runValidators: true }
    ).populate('permissions');

    if (!role) {
        throw new Error('Role not found');
    }

    return role;
};

exports.deleteRole = async (roleId) => {
    // Check if any user has this role
    const usersWithRole = await User.countDocuments({ roles: roleId });
    if (usersWithRole > 0) {
        throw new Error('Cannot delete role assigned to users');
    }

    const role = await Role.findByIdAndDelete(roleId);
    if (!role) {
        throw new Error('Role not found');
    }
    return { message: 'Role deleted successfully' };
};

exports.assignPermissionsToRole = async (roleId, permissionIds) => {
    // Check if permissions exist
    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    if (permissions.length !== permissionIds.length) {
        throw new Error('One or more permissions not found');
    }

    const role = await Role.findByIdAndUpdate(
        roleId,
        { $addToSet: { permissions: { $each: permissionIds } } },
        { new: true }
    ).populate('permissions');

    if (!role) {
        throw new Error('Role not found');
    }

    return role;
};

exports.removePermissionsFromRole = async (roleId, permissionIds) => {
    const role = await Role.findByIdAndUpdate(
        roleId,
        { $pull: { permissions: { $in: permissionIds } } },
        { new: true }
    ).populate('permissions');

    if (!role) {
        throw new Error('Role not found');
    }

    return role;
};