
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Not authorized');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Not authorized');
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send('Not authorized as an admin');
  }
};
