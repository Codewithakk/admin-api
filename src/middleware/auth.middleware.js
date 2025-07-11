const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Unauthorized' });

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.user = await User.findById(decoded.id).populate({
            path: 'roles',
            populate: { path: 'permissions' },
        });
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};
