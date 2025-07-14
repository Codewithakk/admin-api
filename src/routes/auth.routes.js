const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validators = require('../utils/validators');

router.post('/register', validators.validateRegister, authController.register);
router.post('/login', validators.validateLogin, authController.login);

module.exports = router;