// utils/successResponse.js

/**
 * Send a success JSON response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (e.g. 200, 201)
 * @param {String} message - Optional message
 * @param {Object} data - Optional data payload
 */
const successResponse = (res, statusCode, message = 'Success', data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

module.exports = successResponse;
