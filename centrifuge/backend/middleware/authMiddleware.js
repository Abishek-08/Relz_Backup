const jwt = require('jsonwebtoken');
const {decryptToken} = require('../utils/encryptDecryptToken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decodedToken = decryptToken(token);
    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!Array.isArray(roles)) roles = [roles]; 
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};



