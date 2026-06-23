const router = require('express').Router();
const controller = require('./payments.controller');
const verifyWebhook = require('../../middleware/verifyWebhook');

router.post('/webhook/promptpay', verifyWebhook(process.env.PROMPTPAY_WEBHOOK_SECRET), controller.promptPayWebhook);
router.post('/webhook/wave',      verifyWebhook(process.env.WAVE_WEBHOOK_SECRET),      controller.waveWebhook);
router.post('/webhook/grabpay',   verifyWebhook(process.env.GRABPAY_WEBHOOK_SECRET),   controller.grabPayWebhook);
router.post('/webhook/crypto',    verifyWebhook(process.env.CRYPTO_WEBHOOK_SECRET),    controller.cryptoWebhook);

module.exports = router;