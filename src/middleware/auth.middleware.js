const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware - verifies JWT token
exports.authenticate = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user and populate roles and permissions
        req.user = await User.findById(decoded.id).populate({
            path: 'roles',
            populate: { path: 'permissions' }
        });

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No user found with this token'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Authorization middleware - checks roles and permissions
exports.authorize = (...requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Check if user has admin role (bypasses permission checks)
        const isAdmin = req.user.roles.some(role => role.name === 'admin');
        if (isAdmin) {
            return next();
        }

        // Get all permissions from user's roles
        const userPermissions = req.user.roles.reduce((permissions, role) => {
            return permissions.concat(role.permissions.map(p => p.name));
        }, []);

        // Check if user has all required permissions
        const hasPermission = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: `User is not authorized to access this route. Required permissions: ${requiredPermissions.join(', ')}`
            });
        }

        next();
    };
};