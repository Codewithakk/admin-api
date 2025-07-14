class ApiResponse {
    constructor(success, data = null, message = '', statusCode = 200) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }
}

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
        });
    }
}

module.exports = { ApiResponse, ErrorResponse };