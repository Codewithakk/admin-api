const Permission = require('../models/Permission');

exports.getAllPermissions = async (req, res) => {
    const permissions = await Permission.find();
    res.json(permissions);
};

exports.createPermission = async (req, res) => {
    const permission = new Permission(req.body);
    await permission.save();
    res.json(permission);
};
