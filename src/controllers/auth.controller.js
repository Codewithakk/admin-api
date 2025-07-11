const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashed = await hashPassword(password);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.json({ message: 'User created', user });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('roles');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: user._id });
    res.json({ token });
};
