const Role = require('../models/Role');
const User = require('../models/User');
const UserRole = require('../models/UserRole');

exports.createRole = async (req, res) => {
  const { role_name, description } = req.body;
  
  const roleExists = await Role.findOne({ role_name });
  if (roleExists) return res.status(400).json({ success: false, message: 'Vai trò đã tồn tại' });
  
  const newRole = new Role({
    role_name,
    description
  });
  
  const savedRole = await newRole.save();
  res.status(201).json({ success: true, role: savedRole });
};

exports.assignRole = async (req, res) => {
  const { user_id, role_id } = req.body;
  
  const user = await User.findById(user_id);
  if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });
  
  const role = await Role.findById(role_id);
  if (!role) return res.status(404).json({ success: false, message: 'Vai trò không tồn tại' });
  
  const existingAssignment = await UserRole.findOne({ user_id, role_id });
  if (existingAssignment) return res.status(400).json({ success: false, message: 'Đã phân quyền' });
  
  const userRole = new UserRole({
    user_id,
    role_id
  });
  
  await userRole.save();
  res.status(201).json({ success: true, message: 'Phân quyền thành công' });
};

exports.updateUserRole = async (req, res) => {
  const { user_id, role_id } = req.body;

  const [user, role] = await Promise.all([
    User.findById(user_id),
    Role.findById(role_id)
  ]);

  if (!user || !role) {
    return res.status(404).json({ 
      success: false,
      message: 'User hoặc vai trò không tồn tại' 
    });
  }

  // Xóa tất cả vai trò cũ
  await UserRole.deleteMany({ user_id });

  // Thêm vai trò mới
  const userRole = new UserRole({ user_id, role_id });
  await userRole.save();

  res.json({ success: true, message: 'Cập nhật vai trò thành công' });
};

exports.getAllRoles = async (req, res) => {
  const roles = await Role.find();
  res.json({ success: true, roles });
};