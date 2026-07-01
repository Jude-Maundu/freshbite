const { v4: uuidv4 } = require('uuid');

function createPayment(payload) {
  return {
    id: uuidv4(),
    bookingReference: payload.bookingReference,
    customerName: payload.customerName,
    phone: payload.phone,
    amount: Number(payload.amount),
    method: payload.method || 'M-Pesa',
    status: 'completed',
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

module.exports = {
  createPayment,
};
