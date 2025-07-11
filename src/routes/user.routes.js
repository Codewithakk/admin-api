const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', authorize(['view_users']), userController.getAllUsers);
router.post('/', authorize(['create_users']), userController.createUser);
router.get('/:id', authorize(['view_users']), userController.getUser);
router.put('/:id', authorize(['edit_users']), userController.updateUser);
router.delete('/:id', authorize(['delete_users']), userController.deleteUser);
router.post('/:id/roles', authorize(['assign_roles']), userController.assignRoles);

module.exports = router;