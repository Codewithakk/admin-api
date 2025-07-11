const Role = require('../models/Role');
const Permission = require('../models/Permission');

exports.getAllRoles = async (req, res) => {
    const roles = await Role.find().populate('permissions');
    res.json(roles);
};

exports.createRole = async (req, res) => {
    const role = new Role(req.body);
    await role.save();
    res.json(role);
};

exports.assignPermissions = async (req, res) => {
    const role = await Role.findById(req.params.id);
    const permissions = await Permission.find({ _id: { $in: req.body.permissions } });
    role.permissions = permissions.map(p => p._id);
    await role.save();
    res.json({ message: 'Permissions assigned', role });
};

exports.getRolePermissions = async (req, res) => {
    const role = await Role.findById(req.params.id).populate('permissions');
    res.json(role.permissions);
};
