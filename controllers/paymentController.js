const Booking = require('../models/bookingModel');
const Payment = require('../models/paymentModel');

function serializePayment(payment) {
  return {
    id: String(payment._id),
    bookingReference: payment.bookingReference,
    customerName: payment.customerName,
    phone: payment.phone,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId || '',
    createdAt:
      payment.createdAt instanceof Date
        ? payment.createdAt.toISOString().slice(0, 10)
        : String(payment.createdAt || '').slice(0, 10),
  };
}

async function getPayments(req, res) {
  const payments = await Payment.find().sort({ createdAt: -1, _id: -1 }).lean();

  return res.json({
    success: true,
    data: payments.map(serializePayment),
  });
}

async function createPayment(req, res) {
  const booking = await Booking.findOne({ reference: req.body.bookingReference }).lean();

  const payment = await Payment.create({
    booking: booking?._id || null,
    bookingReference: req.body.bookingReference,
    customerName: req.body.customerName,
    phone: req.body.phone,
    amount: Number(req.body.amount),
    method: req.body.method || 'M-Pesa',
    status: req.body.status || 'completed',
    transactionId: req.body.transactionId || '',
  });

  return res.status(201).json({
    success: true,
    message: 'Payment recorded successfully.',
    data: serializePayment(payment),
  });
}

module.exports = {
  getPayments,
  createPayment,
};
