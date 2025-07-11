const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    getAllRoles,
    createRole,
    assignPermissions,
    getRolePermissions
} = require('../controllers/role.controller');

router.get('/roles', authenticate, getAllRoles);
router.post('/roles', authenticate, createRole);
router.post('/roles/:id/permissions', authenticate, assignPermissions);
router.get('/roles/:id/permissions', authenticate, getRolePermissions);

module.exports = router;
