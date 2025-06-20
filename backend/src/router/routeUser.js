const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly, userOrAdmin } = require('../Middleware/authMiddleware');

router.post('/', auth, adminOnly, userController.createUser);
router.get('/', auth, adminOnly, userController.getAllUsers);
router.get('/me', auth, userController.getUserProfile);
router.get('/:id', auth, userOrAdmin, userController.getUserById);
router.put('/:id', auth, userOrAdmin, userController.updateUser);
router.put('/block/:id', auth, adminOnly, userController.blockUser);

module.exports = router;