const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');

exports.createUser = async (req, res) => {
  const { username, password, fullname, email, role_id } = req.body;
  
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ 
    username, 
    password: hashedPassword,
    fullname,
    email,
    is_active: true
  });
  
  const savedUser = await newUser.save();
  
  if (role_id) {
    const role = await Role.findById(role_id);
    if (!role) return res.status(400).json({ success: false, message: 'Vai trò không tồn tại' });
    
    const userRole = new UserRole({
      user_id: savedUser._id,
      role_id
    });
    await userRole.save();
  }
  
  res.status(201).json({ 
    success: true,
    message: 'Tạo user thành công',
    user: {
      id: savedUser._id,
      username: savedUser.username,
      fullname: savedUser.fullname
    }
  });
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { fullname, email, is_active } = req.body;
  const currentUser = req.user;

  const isAdmin = currentUser.roles.includes('admin');
  const isSelf = currentUser.id === userId;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ success: false, message: 'Không có quyền chỉnh sửa' });
  }

  const updateData = { fullname };
  
  // Chỉ admin được cập nhật email và trạng thái
  if (isAdmin) {
    if (email) updateData.email = email;
    if (is_active !== undefined) updateData.is_active = is_active;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  ).select('-password -refreshToken');

  if (!updatedUser) return res.status(404).json({ success: false, message: 'User không tồn tại' });

  res.json({ success: true, user: updatedUser });
};

exports.blockUser = async (req, res) => {
  const userId = req.params.id;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { is_active: false },
    { new: true }
  );
  
  if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });
  
  res.json({ success: true, message: 'Đã khóa user' });
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });
  
  res.json({ success: true, user });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password -refreshToken');
  res.json({ success: true, users });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshToken');
  if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });
  
  res.json({ success: true, user });
};