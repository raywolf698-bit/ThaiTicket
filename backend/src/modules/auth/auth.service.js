const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/env');

async function register({ email, password, name, country }) {
  const hash = await bcrypt.hash(password, 12);
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      'INSERT INTO users (email, password_hash, name, country, role, kyc_status) VALUES (?, ?, ?, ?, "user", "pending")',
      [email, hash, name, country]
    );

    await conn.execute(
      'INSERT INTO wallets (user_id, balance) VALUES (?, 0.00)',
      [result.insertId]
    );

    await conn.commit();

    const token = jwt.sign(
      { id: result.insertId, role: 'user', kyc: 'pending' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, user: { id: result.insertId, name, role: 'user' } };
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') throw new Error('Email already registered');
    throw err;
  } finally {
    conn.release();
  }
}

async function login({ email, password }) {
  const [[user]] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid email or password');

  if (user.is_banned) throw new Error('This account has been suspended');

  const token = jwt.sign(
    { id: user.id, role: user.role, kyc: user.kyc_status },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user: { id: user.id, name: user.name, role: user.role } };
}

async function updateKyc(userId, status) {
  await db.execute('UPDATE users SET kyc_status = ? WHERE id = ?', [status, userId]);
}

module.exports = { register, login, updateKyc };