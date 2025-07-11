const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
console.log('JWT Secret:', process.env.JWT_SECRET); // Debugging line to check if JWT_SECRET is loaded
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };