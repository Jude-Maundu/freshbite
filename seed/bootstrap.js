const { readCollection } = require('../utils/fileStore');
const { hashPassword } = require('../utils/auth');
const { buildBookingReference } = require('../utils/reference');
const User = require('../models/userModel');
const MenuItem = require('../models/menuItemModel');
const Booking = require('../models/bookingModel');
const Payment = require('../models/paymentModel');
const Quote = require('../models/quoteModel');

async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || 'admin@freshbites.ke').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'FreshBites2026!';
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    return existingAdmin;
  }

  const passwordHash = await hashPassword(password);

  return User.create({
    name: 'Fresh Bites Admin',
    email,
    passwordHash,
    role: 'admin',
    status: 'active',
  });
}

async function seedMenuItems() {
  if ((await MenuItem.estimatedDocumentCount()) > 0) {
    return;
  }

  const items = await readCollection('menuItems.json', []);
  if (!items.length) {
    return;
  }

  await MenuItem.insertMany(
    items.map((item) => ({
      name: item.name,
      category: item.category,
      description: item.description,
      price: Number(item.price) || 0,
      status: item.status || 'available',
      imageUrl: item.imageUrl || '',
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    })),
    { ordered: false }
  );
}

async function seedBookings() {
  if ((await Booking.estimatedDocumentCount()) > 0) {
    return;
  }

  const items = await readCollection('bookings.json', []);
  if (!items.length) {
    return;
  }

  await Booking.insertMany(
    items.map((item) => ({
      reference: item.reference || buildBookingReference(new Date(item.createdAt || Date.now())),
      clientName: item.clientName,
      email: item.email,
      phone: item.phone,
      eventType: item.eventType,
      packageName: item.packageName,
      eventDate: item.eventDate,
      location: item.location,
      guestCount: Number(item.guestCount) || 0,
      servingStyle: item.servingStyle,
      paymentOption: item.paymentOption,
      specialRequests: item.specialRequests || '',
      status: item.status || 'pending',
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    })),
    { ordered: false }
  );
}

async function seedPayments() {
  if ((await Payment.estimatedDocumentCount()) > 0) {
    return;
  }

  const items = await readCollection('payments.json', []);
  if (!items.length) {
    return;
  }

  await Payment.insertMany(
    items.map((item) => ({
      bookingReference: item.bookingReference,
      customerName: item.customerName,
      phone: item.phone,
      amount: Number(item.amount) || 0,
      method: item.method || 'M-Pesa',
      status: item.status || 'completed',
      transactionId: item.transactionId || '',
      paidAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    })),
    { ordered: false }
  );
}

async function seedQuotes() {
  if ((await Quote.estimatedDocumentCount()) > 0) {
    return;
  }

  await Quote.create({
    clientName: 'Sample Client',
    email: 'sample@freshbites.ke',
    phone: '0710500813',
    eventType: 'Wedding',
    guestCount: 250,
    status: 'review',
    notes: 'Seed quotation sample',
  });
}

async function bootstrapDatabase() {
  await ensureAdminUser();
  await seedMenuItems();
  await seedBookings();
  await seedPayments();
  await seedQuotes();
}

module.exports = {
  bootstrapDatabase,
};
