const { readCollection } = require('../utils/fileStore');

const getDashboardSummary = async (req, res) => {
  const bookings = await readCollection('bookings.json', []);
  const payments = await readCollection('payments.json', []);
  const menuItems = await readCollection('menuItems.json', []);

  const todaysDate = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter((booking) => booking.createdAt === todaysDate).length;
  const upcomingEvents = bookings.filter((booking) => booking.status !== 'completed').length;
  const pendingQuotations = bookings.filter((booking) => booking.status === 'pending').length;
  const revenueTotal = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  return res.json({
    success: true,
    data: {
      todaysBookings,
      upcomingEvents,
      pendingQuotations,
      revenueTotal,
      recentActivities: [
        `${menuItems.length} menu items currently published`,
        `${bookings.length} bookings in the system`,
        `${payments.length} payments recorded`,
      ],
    },
  });
};

module.exports = {
  getDashboardSummary,
};
