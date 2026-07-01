const express = require('express');
const { getBookings, createBooking, updateBookingStatus } = require('../controllers/bookingController');
const requireAdminAuth = require('../middleware/requireAdminAuth');

const router = express.Router();

router.post('/', createBooking);
router.get('/', requireAdminAuth, getBookings);
router.patch('/:id/status', requireAdminAuth, updateBookingStatus);

module.exports = router;
