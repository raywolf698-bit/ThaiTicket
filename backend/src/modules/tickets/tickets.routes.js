const router = require('express').Router();
const auth = require('../../middleware/auth');
const controller = require('./tickets.controller');
const db = require('../../config/db');

// ✅ /draws must come BEFORE /:id/buy
router.get('/draws', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM draws ORDER BY draw_date DESC LIMIT 10'
    );
    const parsed = rows.map((r) => ({
      ...r,
      winning_numbers: typeof r.winning_numbers === 'string'
        ? JSON.parse(r.winning_numbers)
        : r.winning_numbers,
    }));
    res.json(parsed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', controller.list);
router.post('/:id/buy', auth, controller.buy);
// My purchased tickets
router.get('/my', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT t.*, o.created_at as purchased_at, o.amount as paid_amount
       FROM tickets t
       JOIN orders o ON o.ticket_id = t.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;