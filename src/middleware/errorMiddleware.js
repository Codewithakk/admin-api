// utils/globalErrorHandler.js

const globalErrorHandler = (err, req, res, next) => {
    // If statusCode not set, default to 500
    const statusCode = err.statusCode || 500;

    // Basic error response shape
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = `Resource not found with id of ${err.value}`;
    }

    // Handle Mongoose duplicate key
    if (err.code === 11000) {
        message = 'Duplicate field value entered';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please log in again!';
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Your token has expired! Please log in again.';
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Only show stack trace in dev
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
};

module.exports = globalErrorHandler;
