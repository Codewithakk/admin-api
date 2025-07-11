const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    assignRoles
} = require('../controllers/user.controller');

router.get('/users', authenticate, getAllUsers);
router.get('/users/:id', authenticate, getUser);
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);
router.post('/users/:id/roles', authenticate, assignRoles);

module.exports = router;
