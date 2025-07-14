const validator = require('validator');
const { ErrorResponse } = require('./apiResponse');

// Common validation functions
const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new Error('Please provide a valid email');
    }
};

const validatePassword = (password) => {
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters', 400);
    }
};

const validateName = (name, fieldName) => {
    if (!name || name.trim().length === 0) {
        throw new Error(`Please provide a ${fieldName}`, 400);
    }
    if (name.length > 50) {
        throw new Error(`${fieldName} cannot be more than 50 characters`, 400);
    }
};

// Specific validators
exports.validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    validateName(name, 'name');
    validateEmail(email);
    validatePassword(password);

    next();
};

exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error('Please provide email and password', 400);
    }

    next();
};

exports.validateCreateUser = (req, res, next) => {
    const { name, email, password } = req.body;

    validateName(name, 'name');
    validateEmail(email);
    validatePassword(password);

    next();
};

exports.validateUpdateUser = (req, res, next) => {
    const { name, email } = req.body;

    if (name) validateName(name, 'name');
    if (email) validateEmail(email);

    next();
};

exports.validateCreateRole = (req, res, next) => {
    const { name, description } = req.body;

    validateName(name, 'role name');

    if (description && description.length > 500) {
        throw new Error('Description cannot be more than 500 characters', 400);
    }

    next();
};

exports.validateAssignRoles = (req, res, next) => {
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
        throw new Error('Please provide an array of role IDs', 400);
    }

    next();
};

exports.validateCreatePermission = (req, res, next) => {
    const { name, description } = req.body;

    validateName(name, 'permission name');

    if (description && description.length > 500) {
        throw new Error('Description cannot be more than 500 characters', 400);
    }

    next();
};

exports.validateAssignPermissions = (req, res, next) => {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
        throw new Error('Please provide an array of permission IDs', 400);
    }

    next();
};