const router = require('express').Router();
const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const upload = require('../../middleware/upload');
const controller = require('./admin.controller');
const ticketService = require('../tickets/tickets.service');

router.use(auth, roles('admin'));

// User management
router.get('/users', controller.listUsers);
router.patch('/users/:id/ban', controller.banUser);
router.patch('/users/:id/role', controller.setRole);
router.patch('/users/:id/kyc', controller.updateKyc);

// Create ticket with image
router.post('/tickets', upload.single('image'), async (req, res) => {
  try {
    const { number, draw_date, price, set, series } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await ticketService.createTicket({ number, draw_date, price, set, series, image_url });
    res.json({ success: true, id: result.id, image_url });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete ticket
router.delete('/tickets/:id', async (req, res) => {
  try {
    await ticketService.deleteTicket(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Bulk upload (no images)
router.post('/tickets/upload', async (req, res) => {
  try {
    await ticketService.bulkUpload(req.body.tickets);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Draw
router.post('/draw/result', async (req, res) => {
  try {
    await ticketService.enterDrawResult(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Finance
router.get('/finance/report', controller.financeReport);

// Audit
router.get('/audit/logs', controller.auditLogs);
// Withdrawal management
router.get('/withdrawals', controller.getPendingWithdrawals);
router.patch('/withdrawals/:id', controller.reviewWithdrawal);

module.exports = router;