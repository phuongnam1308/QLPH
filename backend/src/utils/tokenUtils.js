const jwt = require('jsonwebtoken');

const revokedTokens = new Set();

const generateAccessToken = (user, roles) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username,
      roles
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
  );
};

const verifyAccessToken = (token) => {
  if (revokedTokens.has(token)) {
    throw new Error('Token revoked');
  }
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const revokeToken = (token) => {
  revokedTokens.add(token);
  const expiration = parseInt(process.env.JWT_ACCESS_EXPIRATION) * 1000 || 15 * 60 * 1000;
  setTimeout(() => {
    revokedTokens.delete(token);
  }, expiration);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeToken
};