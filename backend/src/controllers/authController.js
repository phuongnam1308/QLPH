const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/tokenUtils');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ success: false, message: 'Sai tên đăng nhập' });
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ success: false, message: 'Sai mật khẩu' });

  if (!user.is_active) return res.status(403).json({ success: false, message: 'Tài khoản đã bị khóa' });
  
  // Lấy các vai trò của user
  const userRoles = await UserRole.find({ user_id: user._id }).populate('role_id');
  const roles = userRoles.map(ur => ur.role_id.role_name);
  
  const accessToken = generateAccessToken(user, roles);
  const refreshToken = generateRefreshToken(user);
  
  user.refreshToken = refreshToken;
  await user.save();
  
  res.json({ 
    success: true,
    accessToken, 
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      fullname: user.fullname,
      roles
    }
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Thiếu refresh token' });
  
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ success: false, message: 'Refresh token không hợp lệ' });
    
    const decoded = verifyRefreshToken(refreshToken);
    
    // Lấy lại roles của user
    const userRoles = await UserRole.find({ user_id: user._id }).populate('role_id');
    const roles = userRoles.map(ur => ur.role_id.role_name);
    
    const newAccessToken = generateAccessToken(user, roles);
    
    res.json({ 
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        roles
      }
    });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Refresh token không hợp lệ' });
  }
};

exports.logout = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
  
  user.refreshToken = null;
  await user.save();
  
  res.json({ success: true, message: 'Đăng xuất thành công' });
};