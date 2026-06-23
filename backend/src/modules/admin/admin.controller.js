const service = require('./admin.service');

async function listUsers(req, res) {
  try {
    const users = await service.getAllUsers(req.query);
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function banUser(req, res) {
  try {
    await service.banUser(req.params.id, req.body.banned);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function setRole(req, res) {
  try {
    await service.setUserRole(req.params.id, req.body.role);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function updateKyc(req, res) {
  try {
    await service.updateKyc(req.params.id, req.body.status);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function financeReport(req, res) {
  try {
    const report = await service.getFinanceReport(req.query);
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function auditLogs(req, res) {
  try {
    const logs = await service.getAuditLogs(req.query);
    res.json(logs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function getPendingWithdrawals(req, res) {
  try {
    const rows = await service.getPendingWithdrawals();
    res.json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function reviewWithdrawal(req, res) {
  try {
    const { status, adminNote } = req.body;
    await service.reviewWithdrawal(req.params.id, status, adminNote);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
module.exports = { listUsers, banUser, setRole, updateKyc, financeReport, auditLogs, getPendingWithdrawals, reviewWithdrawal };