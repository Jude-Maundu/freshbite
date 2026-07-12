const { createBooking: insertBooking, listBookings, updateBookingStatus: setBookingStatus } = require('../repositories/supabaseRepository');
const { buildBookingReference } = require('../utils/reference');

function serializeBooking(booking) {
  return {
    id: String(booking.id || booking._id),
    reference: booking.reference,
    clientName: booking.clientName,
    email: booking.email,
    phone: booking.phone,
    eventType: booking.eventType,
    packageName: booking.packageName,
    eventDate: booking.eventDate,
    location: booking.location,
    guestCount: booking.guestCount,
    servingStyle: booking.servingStyle,
    paymentOption: booking.paymentOption,
    specialRequests: booking.specialRequests || '',
    status: booking.status,
    createdAt:
      booking.createdAt instanceof Date
        ? booking.createdAt.toISOString().slice(0, 10)
        : String(booking.createdAt || '').slice(0, 10),
  };
}

async function getBookings(req, res) {
  const bookings = await listBookings();

  return res.json({
    success: true,
    data: bookings.map(serializeBooking),
  });
}

async function createBooking(req, res) {
  const booking = await insertBooking({
    reference: buildBookingReference(),
    clientName: req.body.clientName,
    email: req.body.email,
    phone: req.body.phone,
    eventType: req.body.eventType,
    packageName: req.body.packageName,
    eventDate: req.body.eventDate,
    location: req.body.location,
    guestCount: Number(req.body.guestCount),
    servingStyle: req.body.servingStyle,
    paymentOption: req.body.paymentOption,
    specialRequests: req.body.specialRequests || '',
    status: 'pending',
    createdBy: req.user?.id || req.user?._id || null,
  });

  return res.status(201).json({
    success: true,
    message: 'Booking request captured successfully.',
    data: serializeBooking(booking),
  });
}

async function updateBookingStatus(req, res) {
  const booking = await setBookingStatus(req.params.id, req.body.status || 'pending');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found.',
    });
  }

  return res.json({
    success: true,
    message: 'Booking status updated.',
    data: serializeBooking(booking),
  });
}

module.exports = {
  getBookings,
  createBooking,
  updateBookingStatus,
};
