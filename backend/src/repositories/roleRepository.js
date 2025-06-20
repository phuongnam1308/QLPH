const Role = require('../models/Role');

module.exports = {
  findById: async (id) => {
    return Role.findById(id);
  },
  
  findByName: async (roleName) => {
    return Role.findOne({ role_name: roleName });
  },
  
  create: async (roleData) => {
    const role = new Role(roleData);
    return role.save();
  },
  
  findAll: async () => {
    return Role.find();
  }
};