const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const Role = require('../models/Role');

module.exports = {
  createUser: async (userData) => {
    const { username, password, fullname, email, role_id } = userData;
    
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) throw new Error('Username already exists');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.create({
      username,
      password: hashedPassword,
      fullname,
      email,
      is_active: true
    });
    
    if (role_id) {
      const role = await Role.findById(role_id);
      if (!role) throw new Error('Role not found');
      await userRepository.assignRole(newUser._id, role_id);
    }
    
    return {
      id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname
    };
  },

  updateUser: async (userId, updateData, currentUser) => {
    const isAdmin = currentUser.roles.includes('admin');
    const isSelf = currentUser.id === userId.toString();

    if (!isAdmin && !isSelf) throw new Error('Unauthorized');

    const updateFields = { fullname: updateData.fullname };
    
    if (isAdmin) {
      if (updateData.email) updateFields.email = updateData.email;
      if (updateData.is_active !== undefined) updateFields.is_active = updateData.is_active;
    }

    const updatedUser = await userRepository.update(userId, updateFields);
    return updatedUser;
  },

  blockUser: async (userId) => {
    return userRepository.update(userId, { is_active: false });
  },

  getUserProfile: async (userId) => {
    return userRepository.findById(userId, '-password -refreshToken');
  },

  getAllUsers: async () => {
    return userRepository.findAll('-password -refreshToken');
  }
};