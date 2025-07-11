const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    getAllPermissions,
    createPermission
} = require('../controllers/permission.controller');

router.get('/', authenticate, getAllPermissions);
router.post('/', authenticate, createPermission);

module.exports = router;
