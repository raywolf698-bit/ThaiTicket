const db = require('../../config/db');

async function listAvailable({ drawDate, page = 1, limit = 100 } = {}) {
  const limitNum = Math.max(1, Math.min(Number(limit) || 100, 500));
  const pageNum = Math.max(1, Number(page) || 1);
  const offset = (pageNum - 1) * limitNum;

  if (drawDate) {
    const [rows] = await db.execute(
      `SELECT * FROM tickets WHERE draw_date = ? ORDER BY number ASC LIMIT ${limitNum} OFFSET ${offset}`,
      [drawDate]
    );
    return rows;
  }

  const [rows] = await db.execute(
    `SELECT * FROM tickets ORDER BY draw_date ASC, number ASC LIMIT ${limitNum} OFFSET ${offset}`
  );
  return rows;
}

async function createTicket({ number, draw_date, price, set, series, image_url }) {
  const [result] = await db.execute(
    'INSERT INTO tickets (number, draw_date, price, `set`, series, status, image_url) VALUES (?, ?, ?, ?, ?, "available", ?)',
    [number, draw_date, price, set || null, series || null, image_url || null]
  );
  return { id: result.insertId };
}

async function deleteTicket(id) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Delete linked orders first
    await conn.execute('DELETE FROM orders WHERE ticket_id = ?', [id]);
    // Then delete the ticket
    await conn.execute('DELETE FROM tickets WHERE id = ?', [id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function buyTicket(userId, ticketId) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[ticket]] = await conn.execute(
      'SELECT * FROM tickets WHERE id = ? AND status = "available" FOR UPDATE',
      [ticketId]
    );
    if (!ticket) throw new Error('Ticket not available');

    const [[wallet]] = await conn.execute(
      'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
      [userId]
    );
    if (!wallet || wallet.balance < ticket.price) throw new Error('Insufficient balance');

    await conn.execute(
      'UPDATE tickets SET status = "sold", owner_id = ? WHERE id = ?',
      [userId, ticketId]
    );
    await conn.execute(
      'UPDATE wallets SET balance = balance - ? WHERE user_id = ?',
      [ticket.price, userId]
    );
    await conn.execute(
      'INSERT INTO orders (user_id, ticket_id, amount, status) VALUES (?, ?, ?, "completed")',
      [userId, ticketId, ticket.price]
    );
    await conn.execute(
      'INSERT INTO wallet_transactions (user_id, type, amount, ref) VALUES (?, "purchase", ?, ?)',
      [userId, ticket.price, `ticket-${ticket.number}`]
    );

    await conn.commit();
    return { success: true, ticketId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function bulkUpload(tickets) {
  const values = tickets.map(t => [t.number, t.draw_date, t.price, t.set, t.series, 'available']);
  await db.query(
    'INSERT INTO tickets (number, draw_date, price, `set`, series, status) VALUES ?',
    [values]
  );
}

async function enterDrawResult({ drawDate, winningNumbers }) {
  await db.execute(
    'INSERT INTO draws (draw_date, winning_numbers, announced_at) VALUES (?, ?, NOW())',
    [drawDate, JSON.stringify(winningNumbers)]
  );
}

module.exports = { listAvailable, createTicket, deleteTicket, buyTicket, bulkUpload, enterDrawResult };