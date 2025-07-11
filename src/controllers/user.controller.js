const User = require('../models/User');
const Role = require('../models/Role');

exports.getAllUsers = async (req, res) => {
    const users = await User.find().populate('roles');
    res.json(users);
};

exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id).populate('roles');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
};

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
};

exports.assignRoles = async (req, res) => {
    const user = await User.findById(req.params.id);
    const roles = await Role.find({ _id: { $in: req.body.roles } });
    user.roles = roles.map(r => r._id);
    await user.save();
    res.json({ message: 'Roles assigned', user });
};
