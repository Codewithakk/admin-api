const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const { protect } = require('../middleware/auth.middleware');
const validators = require('../utils/validators');
const { checkPermissions } = require('../middleware/rbac.middleware');

router.use(protect);

router.get('/', checkPermissions(['manage_permissions']), permissionController.getAllPermissions);
router.post('/', checkPermissions(['manage_permissions']), validators.validateCreatePermission, permissionController.createPermission);

module.exports = router;