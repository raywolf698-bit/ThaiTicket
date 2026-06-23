// Usage: roles('admin') or roles('admin', 'agent')
module.exports = (...allowed) => (req, res, next) => {
  if (!allowed.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};