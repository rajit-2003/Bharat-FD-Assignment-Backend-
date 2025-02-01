const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Add user data to request object
    next();  // Proceed to the next middleware/route
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
