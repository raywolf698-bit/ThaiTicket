const db = require('../../config/db');

// Stub — swap internals with Twilio, Firebase, Nodemailer, etc.

async function sendSMS(phone, message) {
  // TODO: integrate SMS provider (e.g. Twilio)
  console.log(`[SMS] To: ${phone} | Message: ${message}`);
}

async function sendPush(userId, { title, body }) {
  // TODO: integrate Firebase Cloud Messaging
  console.log(`[PUSH] userId: ${userId} | ${title}: ${body}`);
}

async function sendEmail(email, { subject, html }) {
  // TODO: integrate Nodemailer / SendGrid
  console.log(`[EMAIL] To: ${email} | Subject: ${subject}`);
}

async function notifyWinner(userId) {
  const [[user]] = await db.execute(
    'SELECT phone, email, name FROM users WHERE id = ?',
    [userId]
  );
  if (!user) return;

  const message = `ยินดีด้วย ${user.name}! คุณถูกรางวัล กรุณาติดต่อรับเงินรางวัลภายใน 48 ชั่วโมง`;

  await Promise.all([
    sendSMS(user.phone, message),
    sendPush(userId, { title: '🎉 คุณถูกรางวัล!', body: message }),
    sendEmail(user.email, { subject: 'คุณถูกรางวัลสลากกินแบ่ง', html: `<p>${message}</p>` }),
  ]);
}

async function notifyPurchaseConfirm(userId, ticketNumber) {
  const [[user]] = await db.execute(
    'SELECT phone, name FROM users WHERE id = ?',
    [userId]
  );
  if (!user) return;

  await sendSMS(
    user.phone,
    `${user.name}: ซื้อสลากหมายเลข ${ticketNumber} สำเร็จ`
  );
}

async function notifyTopUp(userId, amount) {
  const [[user]] = await db.execute(
    'SELECT phone, name FROM users WHERE id = ?',
    [userId]
  );
  if (!user) return;

  await sendSMS(
    user.phone,
    `${user.name}: เติมเงินสำเร็จ ฿${amount}`
  );
}

module.exports = { sendSMS, sendPush, sendEmail, notifyWinner, notifyPurchaseConfirm, notifyTopUp };