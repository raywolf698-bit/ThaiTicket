const walletService = require('../wallet/wallet.service');

async function handlePromptPayWebhook({ ref, amount, userId }) {
  // TODO: verify PromptPay signature here
  await walletService.credit(userId, amount, ref, 'promptpay');
}

async function handleWaveWebhook({ ref, amount, userId }) {
  // TODO: verify Wave Money signature here
  await walletService.credit(userId, amount, ref, 'wave');
}

async function handleGrabPayWebhook({ ref, amount, userId }) {
  // TODO: verify GrabPay signature here
  await walletService.credit(userId, amount, ref, 'grabpay');
}

async function handleCryptoDeposit({ ref, amount, userId }) {
  // TODO: verify on-chain transaction here
  await walletService.credit(userId, amount, ref, 'usdt');
}

async function refundToWallet(userId, amount, ref) {
  // Called when payment fails after wallet debit
  await walletService.credit(userId, amount, ref, 'refund');
}

module.exports = {
  handlePromptPayWebhook,
  handleWaveWebhook,
  handleGrabPayWebhook,
  handleCryptoDeposit,
  refundToWallet,
};