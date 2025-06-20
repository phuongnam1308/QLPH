const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const bcrypt = require('bcryptjs');

module.exports = async () => {
  let adminRole = await Role.findOne({ role_name: 'admin' });
  if (!adminRole) {
    adminRole = new Role({ 
      role_name: 'admin',
      description: 'Quản trị viên' 
    });
    await adminRole.save();
  }

  let adminUser = await User.findOne({ username: 'admin' });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      fullname: 'Admin',
      email: 'admin@company.com',
      is_active: true
    });
    await adminUser.save();
  }

  const assignmentExists = await UserRole.findOne({ 
    user_id: adminUser._id,
    role_id: adminRole._id
  });
  
  if (!assignmentExists) {
    const userRole = new UserRole({
      user_id: adminUser._id,
      role_id: adminRole._id
    });
    await userRole.save();
  }
};