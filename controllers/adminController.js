const Booking = require('../models/bookingModel');
const Payment = require('../models/paymentModel');
const MenuItem = require('../models/menuItemModel');

async function getDashboardSummary(req, res) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [todaysBookings, upcomingEvents, pendingQuotations, revenueStats, menuCount, bookingCount, paymentCount] =
    await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: todayStart } }),
      Booking.countDocuments({ status: { $ne: 'completed' } }),
      Booking.countDocuments({ status: 'pending' }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      MenuItem.countDocuments(),
      Booking.countDocuments(),
      Payment.countDocuments(),
    ]);

  return res.json({
    success: true,
    data: {
      todaysBookings,
      upcomingEvents,
      pendingQuotations,
      revenueTotal: revenueStats[0]?.total || 0,
      recentActivities: [
        `${menuCount} menu items currently published`,
        `${bookingCount} bookings in the system`,
        `${paymentCount} payments recorded`,
      ],
    },
  });
}

module.exports = {
  getDashboardSummary,
};
