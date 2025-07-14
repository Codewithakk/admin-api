const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { protect } = require('../middleware/auth.middleware');
const validators = require('../utils/validators');
const { checkPermissions } = require('../middleware/rbac.middleware');

router.use(protect);

router.get('/', checkPermissions(['manage_roles']), roleController.getAllRoles);
router.post('/', checkPermissions(['manage_roles']), validators.validateCreateRole, roleController.createRole);
router.post('/:id/permissions', checkPermissions(['manage_roles']), validators.validateAssignPermissions, roleController.assignPermissionsToRole);
router.get('/:id/permissions', checkPermissions(['manage_roles']), roleController.getRolePermissions);

module.exports = router;