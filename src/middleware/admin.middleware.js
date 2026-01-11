const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  // For now, we'll check if the user is authenticated
  // You can enhance this to check for admin role specifically
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // For admin endpoints, we'll allow authenticated users
    // You can add role-based check here: if (req.user.role !== 'ADMIN') return res.status(403)...
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminMiddleware;

