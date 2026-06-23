const router = require('express').Router();
const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const { notifyWinner } = require('./notifications.service');

// Admin can manually trigger a winner notification
router.post('/notify-winner/:userId', auth, roles('admin'), async (req, res) => {
  try {
    await notifyWinner(req.params.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;