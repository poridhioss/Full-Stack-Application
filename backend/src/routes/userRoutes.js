const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.createUser);
router.post('/login', userController.login);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

router.put('/:id', authMiddleware, userController.updateUser);
router.put('/:id/password', authMiddleware, userController.updatePassword);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;