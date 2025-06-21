const tokenUtils = require('../utils/tokenUtils');

exports.auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = tokenUtils.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') message = 'Token expired';
    if (error.message === 'Token revoked') message = 'Token revoked';
    res.status(401).json({ success: false, message });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.roles && req.user.roles.includes('admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

exports.userOrAdmin = (req, res, next) => {
  const isAdmin = req.user.roles && req.user.roles.includes('admin');
  const isSelf = req.user.id === req.params.id;
  
  if (isAdmin || isSelf) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};