const db = require('../config/db');

module.exports = async (req, res, next) => {
  res.on('finish', () => {
    setImmediate(async () => {
      try {
        await db.execute(
          'INSERT INTO audit_logs (user_id, method, path, status, ip, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [req.user?.id || null, req.method, req.path, res.statusCode, req.ip]
        );
      } catch (err) {
        console.error('Audit log error:', err.message);
      }
    });
  });
  next();
};