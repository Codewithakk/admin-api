// utils/errorResponse.js

/**
 * Send an error JSON response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (e.g. 400, 404, 500)
 * @param {String} message - Error message
 */
const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorResponse;
