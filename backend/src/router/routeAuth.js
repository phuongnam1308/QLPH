const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../Middleware/authMiddleware'); // Thêm import middleware

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', auth, authController.logout); // Thêm middleware auth

module.exports = router;