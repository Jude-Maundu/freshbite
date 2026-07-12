const express = require('express');
const { getDashboardSummary } = require('../controllers/adminController');
const { getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { getPayments } = require('../controllers/paymentController');
const requireAdminAuth = require('../middleware/requireAdminAuth');

const router = express.Router();

router.use(requireAdminAuth);
router.get('/dashboard', getDashboardSummary);
router.get('/menu-items', getMenuItems);
router.post('/menu-items', createMenuItem);
router.patch('/menu-items/:id', updateMenuItem);
router.delete('/menu-items/:id', deleteMenuItem);
router.get('/bookings', getBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/payments', getPayments);

module.exports = router;
