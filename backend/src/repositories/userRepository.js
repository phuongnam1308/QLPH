const User = require('../models/User');
const UserRole = require('../models/UserRole');

module.exports = {
  findByUsername: async (username) => {
    return User.findOne({ username });
  },

  findById: async (id, projection = null) => {
    return User.findById(id).select(projection);
  },

  findAll: async (projection = null) => {
    return User.find().select(projection);
  },

  create: async (userData) => {
    const user = new User(userData);
    return user.save();
  },

  update: async (userId, updateData) => {
    return User.findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password -refreshToken');
  },

  updateRefreshToken: async (userId, refreshToken) => {
    return User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
  },

  getUserRoles: async (userId) => {
    const userRoles = await UserRole.find({ user_id: userId }).populate('role_id');
    return userRoles.map(ur => ur.role_id.role_name);
  },

  assignRole: async (userId, roleId) => {
    const userRole = new UserRole({ user_id: userId, role_id: roleId });
    return userRole.save();
  },

  findByRefreshToken: async (refreshToken) => {
    return User.findOne({ refreshToken });
  }
};