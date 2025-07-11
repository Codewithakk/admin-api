const authService = require('../services/authService');
const { validateRegister, validateLogin } = require('../utils/validators');

exports.register = async (req, res) => {
    try {
        const { error } = validateRegister(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = await authService.registerUser(req.body);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { user, token } = await authService.loginUser(req.body);
        res.json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};