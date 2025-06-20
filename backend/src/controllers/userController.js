const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({ 
      success: true,
      message: 'User created',
      user: result
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.id, 
      req.body, 
      req.user
    );
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await userService.blockUser(req.params.id);
    res.json({ success: true, message: 'User blocked', user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.params.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};