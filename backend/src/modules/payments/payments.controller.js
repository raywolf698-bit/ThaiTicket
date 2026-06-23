const service = require('./payments.service');

async function promptPayWebhook(req, res) {
  try {
    await service.handlePromptPayWebhook(req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function waveWebhook(req, res) {
  try {
    await service.handleWaveWebhook(req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function grabPayWebhook(req, res) {
  try {
    await service.handleGrabPayWebhook(req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function cryptoWebhook(req, res) {
  try {
    await service.handleCryptoDeposit(req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { promptPayWebhook, waveWebhook, grabPayWebhook, cryptoWebhook };