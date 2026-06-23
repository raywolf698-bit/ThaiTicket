const db = require('../../config/db');

async function getAllUsers({ page = 1, limit = 50, role, kyc_status }) {
  const offset = (page - 1) * limit;
  let query = 'SELECT id, name, phone, country, role, kyc_status, is_banned, created_at FROM users WHERE 1=1';
  const params = [];

  if (role) { query += ' AND role = ?'; params.push(role); }
  if (kyc_status) { query += ' AND kyc_status = ?'; params.push(kyc_status); }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await db.execute(query, params);
  return rows;
}

async function banUser(userId, banned) {
  await db.execute('UPDATE users SET is_banned = ? WHERE id = ?', [banned, userId]);
}

async function setUserRole(userId, role) {
  await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
}

async function updateKyc(userId, status) {
  await db.execute('UPDATE users SET kyc_status = ? WHERE id = ?', [status, userId]);
}

async function getFinanceReport({ from, to }) {
  const [[revenue]] = await db.execute(
    `SELECT SUM(amount) AS total_revenue FROM wallet_transactions
     WHERE type IN ('promptpay','wave','grabpay','usdt')
     AND created_at BETWEEN ? AND ?`,
    [from, to]
  );

  const [[payouts]] = await db.execute(
    `SELECT SUM(amount) AS total_payouts FROM wallet_transactions
     WHERE type = 'payout'
     AND created_at BETWEEN ? AND ?`,
    [from, to]
  );

  const [[ticketsSold]] = await db.execute(
    `SELECT COUNT(*) AS count, SUM(amount) AS total FROM orders
     WHERE status = 'completed'
     AND created_at BETWEEN ? AND ?`,
    [from, to]
  );

  return {
    revenue: revenue.total_revenue || 0,
    payouts: payouts.total_payouts || 0,
    ticketsSold: ticketsSold.count || 0,
    ticketRevenue: ticketsSold.total || 0,
  };
}

async function getAuditLogs({ page = 1, limit = 100 }) {
  const offset = (page - 1) * limit;
  const [rows] = await db.execute(
    'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows;
}
async function getPendingWithdrawals() {
  const [rows] = await db.execute(
    `SELECT wr.*, u.name, u.email FROM withdrawal_requests wr
     JOIN users u ON u.id = wr.user_id
     WHERE wr.status = 'pending'
     ORDER BY wr.created_at ASC`
  );
  return rows;
}

async function reviewWithdrawal(requestId, status, adminNote) {
  const walletService = require('../wallet/wallet.service');
  return walletService.reviewWithdrawal(requestId, status, adminNote);
}

module.exports = { getAllUsers, banUser, setUserRole, updateKyc, getFinanceReport, getAuditLogs, getPendingWithdrawals, reviewWithdrawal };