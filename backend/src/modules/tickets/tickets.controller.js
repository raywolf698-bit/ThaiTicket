const service = require('./tickets.service');

async function list(req, res) {
  try {
    const tickets = await service.listAvailable(req.query);
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

async function buy(req, res) {
  try {
    const result = await service.buyTicket(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { list, buy };