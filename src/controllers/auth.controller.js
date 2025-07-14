const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const successResponse = require('../utils/sucessResponse');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return errorResponse(res, 400, 'Email already in use');
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 201, 'User registered successfully', { user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return errorResponse(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return errorResponse(res, 401, 'Incorrect email or password');
    }

    const token = generateToken(user._id);

    return successResponse(res, 200, 'User logged in successfully', { user, token });
});
