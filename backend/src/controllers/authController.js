const authService = require("../services/authService");

exports.login = async (req, res) => {
  try {
    const result = await authService.login(
      req.body.username,
      req.body.password
    );
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,              
      sameSite: 'Lax',           
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Thêm kiểm tra an toàn cho req.user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];
    await authService.logout(req.user.id, token);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
