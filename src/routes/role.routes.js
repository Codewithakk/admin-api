const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    getAllRoles,
    createRole,
    assignPermissions,
    getRolePermissions
} = require('../controllers/role.controller');

router.get('/', authenticate, getAllRoles);
router.post('/', authenticate, createRole);
router.post('/:id/permissions', authenticate, assignPermissions);
router.get('/:id/permissions', authenticate, getRolePermissions);

module.exports = router;
