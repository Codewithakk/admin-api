const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    getAllPermissions,
    createPermission
} = require('../controllers/permission.controller');

router.get('/permissions', authenticate, getAllPermissions);
router.post('/permissions', authenticate, createPermission);

module.exports = router;
