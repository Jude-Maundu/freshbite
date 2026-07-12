const {
  countBookings,
  countBookingsCreatedSince,
  countBookingsNotCompleted,
  countMenuItems,
  countPayments,
  countQuotesByStatus,
  sumPaymentAmounts,
} = require('../repositories/supabaseRepository');

async function getDashboardSummary(req, res) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [todaysBookings, upcomingEvents, pendingQuotations, revenueTotal, menuCount, bookingCount, paymentCount] =
    await Promise.all([
      countBookingsCreatedSince(todayStart),
      countBookingsNotCompleted(),
      countQuotesByStatus('review'),
      sumPaymentAmounts(),
      countMenuItems(),
      countBookings(),
      countPayments(),
    ]);

  return res.json({
    success: true,
    data: {
      todaysBookings,
      upcomingEvents,
      pendingQuotations,
      revenueTotal,
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
