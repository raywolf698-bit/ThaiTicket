const service = require('./wallet.service');

async function getBalance(req, res) {
  try {
    const data = await service.getBalance(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getHistory(req, res) {
  try {
    const data = await service.getHistory(req.user.id, req.query);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function withdraw(req, res) {
  try {
    const result = await service.debit(req.user.id, req.body.amount, req.body.ref, 'withdrawal');
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function topUp(req, res) {
  try {
    const { amount, method } = req.body;
    const amt = Number(amount);
    if (!amt || amt <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const allowedTypes = ['promptpay', 'wave', 'grabpay', 'usdt', 'deposit'];
    const type = allowedTypes.includes(method) ? method : 'deposit';

    await service.credit(req.user.id, amt, `test-${type}-${Date.now()}`, type);
    const wallet = await service.getBalance(req.user.id);
    res.json({ success: true, balance: wallet.balance });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function requestWithdraw(req, res) {
  try {
    const { amount, bankName, accountNumber, accountName } = req.body;
    if (!amount || !bankName || !accountNumber || !accountName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const result = await service.requestWithdrawal({
      userId: req.user.id, amount: Number(amount),
      bankName, accountNumber, accountName,
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getWithdrawals(req, res) {
  try {
    const rows = await service.getWithdrawalRequests(req.user.id);
    res.json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
module.exports = { getBalance, getHistory, withdraw, topUp, requestWithdraw, getWithdrawals };