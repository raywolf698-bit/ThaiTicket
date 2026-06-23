const { createClient } = require('redis');
const { REDIS_URL } = require('./env');

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => {
  console.error('Redis error:', err.message);
});

client.connect().catch((err) => {
  console.warn('Redis not connected — OTP will not work:', err.message);
});

module.exports = client;