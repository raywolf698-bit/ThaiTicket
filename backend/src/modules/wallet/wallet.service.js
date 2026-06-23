const db = require('../../config/db');

async function getBalance(userId) {
  const [[wallet]] = await db.execute(
    'SELECT balance FROM wallets WHERE user_id = ?',
    [userId]
  );
  return wallet || { balance: 0 };
}

async function getHistory(userId, { page = 1, limit = 20 } = {}) {
  const limitNum = Math.max(1, Math.min(Number(limit) || 20, 100));
  const pageNum = Math.max(1, Number(page) || 1);
  const offset = (pageNum - 1) * limitNum;

  const [rows] = await db.execute(
    `SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`,
    [userId]
  );
  return rows;
}

async function credit(userId, amount, ref, type = 'deposit') {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      'UPDATE wallets SET balance = balance + ? WHERE user_id = ?',
      [amount, userId]
    );
    await conn.execute(
      'INSERT INTO wallet_transactions (user_id, type, amount, ref) VALUES (?, ?, ?, ?)',
      [userId, type, amount, ref]
    );
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function debit(userId, amount, ref, type = 'withdrawal') {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[wallet]] = await conn.execute(
      'SELECT balance FROM wallets WHERE user_id = ? FOR UPDATE',
      [userId]
    );
    if (!wallet || wallet.balance < amount) throw new Error('Insufficient balance');

    await conn.execute(
      'UPDATE wallets SET balance = balance - ? WHERE user_id = ?',
      [amount, userId]
    );
    await conn.execute(
      'INSERT INTO wallet_transactions (user_id, type, amount, ref) VALUES (?, ?, ?, ?)',
      [userId, type, amount, ref]
    );
    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
async function requestWithdrawal({ userId, amount, bankName, accountNumber, accountName }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[wallet]] = await conn.execute(
      'SELECT balance FROM wallets WHERE user_id = ? FOR UPDATE',
      [userId]
    );
    if (!wallet || wallet.balance < amount) throw new Error('Insufficient balance');

    // Hold the amount — deduct immediately
    await conn.execute(
      'UPDATE wallets SET balance = balance - ? WHERE user_id = ?',
      [amount, userId]
    );
    await conn.execute(
      'INSERT INTO wallet_transactions (user_id, type, amount, ref) VALUES (?, "withdrawal", ?, ?)',
      [userId, amount, `withdraw-pending-${Date.now()}`]
    );
    await conn.execute(
      'INSERT INTO withdrawal_requests (user_id, amount, bank_name, account_number, account_name) VALUES (?, ?, ?, ?, ?)',
      [userId, amount, bankName, accountNumber, accountName]
    );

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function reviewWithdrawal(requestId, status, adminNote) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[req]] = await conn.execute(
      'SELECT * FROM withdrawal_requests WHERE id = ? AND status = "pending" FOR UPDATE',
      [requestId]
    );
    if (!req) throw new Error('Request not found or already processed');

    if (status === 'rejected') {
      // Refund the amount back to wallet
      await conn.execute(
        'UPDATE wallets SET balance = balance + ? WHERE user_id = ?',
        [req.amount, req.user_id]
      );
      await conn.execute(
        'INSERT INTO wallet_transactions (user_id, type, amount, ref) VALUES (?, "refund", ?, ?)',
        [req.user_id, req.amount, `withdraw-refund-${requestId}`]
      );
    }

    await conn.execute(
      'UPDATE withdrawal_requests SET status = ?, admin_note = ? WHERE id = ?',
      [status, adminNote || null, requestId]
    );

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getWithdrawalRequests(userId = null) {
  if (userId) {
    const [rows] = await db.execute(
      'SELECT * FROM withdrawal_requests WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
  const [rows] = await db.execute(
    `SELECT wr.*, u.name, u.email FROM withdrawal_requests wr
     JOIN users u ON u.id = wr.user_id
     ORDER BY wr.created_at DESC`
  );
  return rows;
}
module.exports = { getBalance, getHistory, credit, debit, requestWithdrawal, reviewWithdrawal, getWithdrawalRequests };