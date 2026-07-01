const { createPayment: buildPayment } = require('../models/paymentModel');
const { readCollection, writeCollection } = require('../utils/fileStore');

const getPayments = async (req, res) => {
  const payments = await readCollection('payments.json', []);

  return res.json({
    success: true,
    data: payments,
  });
};

const createPayment = async (req, res) => {
  const payment = buildPayment(req.body);
  const payments = await readCollection('payments.json', []);
  await writeCollection('payments.json', [payment, ...payments]);

  return res.status(201).json({
    success: true,
    message: 'Payment recorded successfully.',
    data: payment,
  });
};

module.exports = {
  getPayments,
  createPayment,
};
