const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth, adminOnly } = require('../Middleware/authMiddleware'); // Sửa đường dẫn

router.post('/', auth, adminOnly, roleController.createRole);
router.get('/', auth, adminOnly, roleController.getAllRoles);
router.post('/assign', auth, adminOnly, roleController.assignRole);
router.put('/update', auth, adminOnly, roleController.updateUserRole);

module.exports = router;