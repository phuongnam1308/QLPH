const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const tokenUtils = require('../utils/tokenUtils');

module.exports = {
  login: async (username, password) => {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new Error('Invalid username');
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid password');
    
    if (!user.is_active) throw new Error('Account blocked');
    
    const roles = await userRepository.getUserRoles(user._id);
    
    const accessToken = tokenUtils.generateAccessToken(user, roles);
    const refreshToken = tokenUtils.generateRefreshToken(user);
    
    await userRepository.updateRefreshToken(user._id, refreshToken);
    
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        roles
      }
    };
  },

  refreshToken: async (refreshToken) => {
    const user = await userRepository.findByRefreshToken(refreshToken);
    if (!user) throw new Error('Invalid refresh token');
    
    tokenUtils.verifyRefreshToken(refreshToken);
    
    const roles = await userRepository.getUserRoles(user._id);
    const newAccessToken = tokenUtils.generateAccessToken(user, roles);
    
    return {
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        roles
      }
    };
  },

  logout: async (userId, accessToken) => {
    tokenUtils.revokeToken(accessToken);
    await userRepository.updateRefreshToken(userId, null);
  }
};