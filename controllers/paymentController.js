const {
  createPayment: insertPayment,
  findBookingByReference,
  listPayments,
} = require('../repositories/supabaseRepository');

function serializePayment(payment) {
  return {
    id: String(payment.id || payment._id),
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
  const payments = await listPayments();

  return res.json({
    success: true,
    data: payments.map(serializePayment),
  });
}

async function createPayment(req, res) {
  const booking = await findBookingByReference(req.body.bookingReference);

  const payment = await insertPayment({
    booking: booking?.id || booking?._id || null,
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
