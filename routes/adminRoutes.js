const express = require('express');
const { getDashboardSummary } = require('../controllers/adminController');
const { getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { getMenu, createMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { getPayments } = require('../controllers/paymentController');
const requireAdminAuth = require('../middleware/requireAdminAuth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(requireAdminAuth);
router.get('/dashboard', getDashboardSummary);
router.get('/menu-items', getMenu);
router.post('/menu-items', upload.single('image'), createMenuItem);
router.delete('/menu-items/:id', deleteMenuItem);
router.get('/bookings', getBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/payments', getPayments);

module.exports = router;
