const { verifyAccessToken } = require('../utils/tokenUtils');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Cần đăng nhập' });
  
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token đã hết hạn' });
    }
    res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.roles && req.user.roles.includes('admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Yêu cầu quyền quản trị' });
  }
};

exports.userOrAdmin = (req, res, next) => {
  const isAdmin = req.user.roles && req.user.roles.includes('admin');
  const isSelf = req.user.id === req.params.id;
  
  if (isAdmin || isSelf) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
  }
};