const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const validators = require('../utils/validators');
const { checkPermissions } = require('../middleware/rbac.middleware');

router.use(protect);

router.get('/', checkPermissions(['manage_users']), userController.getAllUsers);
router.post('/', checkPermissions(['manage_users']), validators.validateCreateUser, userController.createUser);
router.get('/:id', checkPermissions(['manage_users']), userController.getUser);
router.put('/:id', checkPermissions(['manage_users']), validators.validateUpdateUser, userController.updateUser);
router.delete('/:id', checkPermissions(['manage_users']), userController.deleteUser);
router.post('/:id/roles', checkPermissions(['manage_users']), validators.validateAssignRoles, userController.assignRolesToUser);

module.exports = router;