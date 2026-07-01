const { v4: uuidv4 } = require('uuid');

function createBooking(payload) {
  const timestamp = new Date();
  const dateStamp = `${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, '0')}${String(
    timestamp.getDate()
  ).padStart(2, '0')}`;

  return {
    id: uuidv4(),
    reference: `FB-${dateStamp}-${String(timestamp.getTime()).slice(-3)}`,
    clientName: payload.clientName,
    email: payload.email,
    phone: payload.phone,
    eventType: payload.eventType,
    packageName: payload.packageName,
    eventDate: payload.eventDate,
    location: payload.location,
    guestCount: Number(payload.guestCount),
    servingStyle: payload.servingStyle,
    paymentOption: payload.paymentOption,
    specialRequests: payload.specialRequests || '',
    status: 'pending',
    createdAt: timestamp.toISOString().slice(0, 10),
  };
}

module.exports = {
  createBooking,
};
