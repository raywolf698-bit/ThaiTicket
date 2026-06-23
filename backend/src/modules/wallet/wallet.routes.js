const router = require('express').Router();
const auth = require('../../middleware/auth');
const controller = require('./wallet.controller');

router.get('/balance', auth, controller.getBalance);
router.get('/history', auth, controller.getHistory);
router.post('/withdraw', auth, controller.withdraw);
router.post('/topup-test', auth, controller.topUp);
router.post('/withdraw-request', auth, controller.requestWithdraw);
router.get('/withdrawals', auth, controller.getWithdrawals);

module.exports = router;