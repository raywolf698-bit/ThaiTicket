const crypto = require('crypto');

module.exports = (secret) => (req, res, next) => {
  const sig = req.headers['x-webhook-signature'];
  if (!sig) return res.status(401).json({ message: 'Missing signature' });

  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (sig !== expected) return res.status(401).json({ message: 'Invalid signature' });
  next();
};