const { createBooking: buildBooking } = require('../models/bookingModel');
const { readCollection, writeCollection } = require('../utils/fileStore');

const getBookings = async (req, res) => {
  const bookings = await readCollection('bookings.json', []);

  return res.json({
    success: true,
    data: bookings,
  });
};

const createBooking = async (req, res) => {
  const booking = buildBooking(req.body);
  const bookings = await readCollection('bookings.json', []);
  await writeCollection('bookings.json', [booking, ...bookings]);

  return res.status(201).json({
    success: true,
    message: 'Booking request captured successfully.',
    data: booking,
  });
};

const updateBookingStatus = async (req, res) => {
  const bookings = await readCollection('bookings.json', []);
  const updatedBookings = bookings.map((booking) =>
    booking.id === req.params.id ? { ...booking, status: req.body.status || booking.status } : booking
  );

  await writeCollection('bookings.json', updatedBookings);
  const updatedBooking = updatedBookings.find((booking) => booking.id === req.params.id);

  return res.json({
    success: true,
    message: 'Booking status updated.',
    data: updatedBooking,
  });
};

module.exports = {
  getBookings,
  createBooking,
  updateBookingStatus,
};
