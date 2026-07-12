const { getSupabaseAdmin } = require('../lib/supabase');

function getSupabaseErrorMessage(error) {
  if (!error) {
    return 'Unknown Supabase error.';
  }

  const baseMessage = error.message || error.details || error.hint || 'Unknown Supabase error.';

  if (
    baseMessage.includes("Could not find the table 'public.") ||
    baseMessage.includes('relation') ||
    baseMessage.includes('schema cache')
  ) {
    return `${baseMessage} Run backend/supabase/schema.sql in your Supabase SQL editor first.`;
  }

  return baseMessage;
}

function isNoRowsError(error) {
  return error?.code === 'PGRST116';
}

async function maybeSingle(query) {
  const { data, error } = await query.maybeSingle();

  if (error && !isNoRowsError(error)) {
    throw new Error(getSupabaseErrorMessage(error));
  }

  return data || null;
}

async function expectSingle(query) {
  const { data, error } = await query.single();

  if (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }

  return data;
}

async function expectData(query) {
  const { data, error } = await query;

  if (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }

  return data;
}

async function expectCount(query) {
  const { count, error } = await query;

  if (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }

  return count || 0;
}

function getClient() {
  return getSupabaseAdmin();
}

function mapUserRow(row) {
  return row
    ? {
        id: row.id,
        name: row.name,
        email: row.email,
        passwordHash: row.password_hash,
        phone: row.phone || '',
        role: row.role,
        status: row.status,
        lastLoginAt: row.last_login_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;
}

function mapBookingRow(row) {
  return row
    ? {
        id: row.id,
        reference: row.reference,
        clientName: row.client_name,
        email: row.email,
        phone: row.phone,
        eventType: row.event_type,
        packageName: row.package_name,
        eventDate: row.event_date,
        location: row.location,
        guestCount: row.guest_count,
        servingStyle: row.serving_style,
        paymentOption: row.payment_option,
        specialRequests: row.special_requests || '',
        status: row.status,
        notes: row.notes || '',
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;
}

function mapPaymentRow(row) {
  return row
    ? {
        id: row.id,
        booking: row.booking_id,
        bookingReference: row.booking_reference,
        customerName: row.customer_name,
        phone: row.phone,
        amount: row.amount,
        method: row.method,
        status: row.status,
        transactionId: row.transaction_id || '',
        paidAt: row.paid_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;
}

function mapMenuItemRow(row) {
  return row
    ? {
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        price: row.price,
        status: row.status,
        imageUrl: row.image_url || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;
}

function mapQuoteRow(row) {
  return row
    ? {
        id: row.id,
        clientName: row.client_name,
        email: row.email,
        phone: row.phone || '',
        eventType: row.event_type,
        guestCount: row.guest_count,
        eventDate: row.event_date || '',
        location: row.location || '',
        budget: row.budget || 0,
        notes: row.notes || '',
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;
}

async function findUserByEmail(email) {
  const supabase = getClient();
  const row = await maybeSingle(supabase.from('users').select('*').eq('email', email));
  return mapUserRow(row);
}

async function findUserById(id) {
  const supabase = getClient();
  const row = await maybeSingle(supabase.from('users').select('*').eq('id', id));
  return mapUserRow(row);
}

async function createUser(user) {
  const supabase = getClient();
  const row = await expectSingle(
    supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        phone: user.phone || '',
        role: user.role || 'customer',
        status: user.status || 'active',
        last_login_at: user.lastLoginAt || null,
      })
      .select('*')
  );

  return mapUserRow(row);
}

async function updateUser(id, patch) {
  const supabase = getClient();
  const updatePayload = {};

  if (patch.name !== undefined) updatePayload.name = patch.name;
  if (patch.email !== undefined) updatePayload.email = patch.email;
  if (patch.passwordHash !== undefined) updatePayload.password_hash = patch.passwordHash;
  if (patch.phone !== undefined) updatePayload.phone = patch.phone;
  if (patch.role !== undefined) updatePayload.role = patch.role;
  if (patch.status !== undefined) updatePayload.status = patch.status;
  if (patch.lastLoginAt !== undefined) updatePayload.last_login_at = patch.lastLoginAt;

  const row = await expectSingle(
    supabase.from('users').update(updatePayload).eq('id', id).select('*')
  );

  return mapUserRow(row);
}

async function countUsers() {
  const supabase = getClient();
  return expectCount(supabase.from('users').select('id', { count: 'exact', head: true }));
}

async function listBookings() {
  const supabase = getClient();
  const rows = await expectData(
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).order('id', { ascending: false })
  );
  return rows.map(mapBookingRow);
}

async function createBooking(booking) {
  const supabase = getClient();
  const row = await expectSingle(
    supabase
      .from('bookings')
      .insert({
        reference: booking.reference,
        client_name: booking.clientName,
        email: booking.email,
        phone: booking.phone,
        event_type: booking.eventType,
        package_name: booking.packageName,
        event_date: booking.eventDate,
        location: booking.location,
        guest_count: booking.guestCount,
        serving_style: booking.servingStyle,
        payment_option: booking.paymentOption,
        special_requests: booking.specialRequests || '',
        status: booking.status || 'pending',
        notes: booking.notes || '',
        created_by: booking.createdBy || null,
      })
      .select('*')
  );

  return mapBookingRow(row);
}

async function findBookingByReference(reference) {
  const supabase = getClient();
  const row = await maybeSingle(supabase.from('bookings').select('*').eq('reference', reference));
  return mapBookingRow(row);
}

async function findBookingById(id) {
  const supabase = getClient();
  const row = await maybeSingle(supabase.from('bookings').select('*').eq('id', id));
  return mapBookingRow(row);
}

async function updateBookingStatus(id, status) {
  const supabase = getClient();
  const row = await maybeSingle(
    supabase.from('bookings').update({ status }).eq('id', id).select('*')
  );

  return mapBookingRow(row);
}

async function countBookings() {
  const supabase = getClient();
  return expectCount(supabase.from('bookings').select('id', { count: 'exact', head: true }));
}

async function countBookingsCreatedSince(dateValue) {
  const supabase = getClient();
  return expectCount(
    supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', dateValue.toISOString())
  );
}

async function countBookingsNotCompleted() {
  const supabase = getClient();
  return expectCount(
    supabase.from('bookings').select('id', { count: 'exact', head: true }).neq('status', 'completed')
  );
}

async function listPayments() {
  const supabase = getClient();
  const rows = await expectData(
    supabase.from('payments').select('*').order('created_at', { ascending: false }).order('id', { ascending: false })
  );
  return rows.map(mapPaymentRow);
}

async function createPayment(payment) {
  const supabase = getClient();
  const row = await expectSingle(
    supabase
      .from('payments')
      .insert({
        booking_id: payment.booking || null,
        booking_reference: payment.bookingReference,
        customer_name: payment.customerName,
        phone: payment.phone,
        amount: payment.amount,
        method: payment.method || 'M-Pesa',
        status: payment.status || 'completed',
        transaction_id: payment.transactionId || '',
        paid_at: payment.paidAt || new Date().toISOString(),
      })
      .select('*')
  );

  return mapPaymentRow(row);
}

async function countPayments() {
  const supabase = getClient();
  return expectCount(supabase.from('payments').select('id', { count: 'exact', head: true }));
}

async function sumPaymentAmounts() {
  const supabase = getClient();
  const rows = await expectData(supabase.from('payments').select('amount'));
  return rows.reduce((total, row) => total + (Number(row.amount) || 0), 0);
}

async function listMenuItems({ ascending = false } = {}) {
  const supabase = getClient();
  const rows = await expectData(
    supabase.from('menu_items').select('*').order('created_at', { ascending }).order('id', { ascending })
  );
  return rows.map(mapMenuItemRow);
}

async function findMenuItemById(id) {
  const supabase = getClient();
  const row = await maybeSingle(supabase.from('menu_items').select('*').eq('id', id));
  return mapMenuItemRow(row);
}

async function createMenuItem(item) {
  const supabase = getClient();
  const row = await expectSingle(
    supabase
      .from('menu_items')
      .insert({
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        status: item.status,
        image_url: item.imageUrl || '',
      })
      .select('*')
  );

  return mapMenuItemRow(row);
}

async function updateMenuItem(id, item) {
  const supabase = getClient();
  const row = await expectSingle(
    supabase
      .from('menu_items')
      .update({
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        status: item.status,
        image_url: item.imageUrl || '',
      })
      .eq('id', id)
      .select('*')
  );

  return mapMenuItemRow(row);
}

async function deleteMenuItem(id) {
  const supabase = getClient();
  const row = await maybeSingle(supabase.from('menu_items').delete().eq('id', id).select('*'));
  return mapMenuItemRow(row);
}

async function countMenuItems() {
  const supabase = getClient();
  return expectCount(supabase.from('menu_items').select('id', { count: 'exact', head: true }));
}

async function listQuotes() {
  const supabase = getClient();
  const rows = await expectData(
    supabase.from('quotes').select('*').order('created_at', { ascending: false }).order('id', { ascending: false })
  );
  return rows.map(mapQuoteRow);
}

async function createQuote(quote) {
  const supabase = getClient();
  const row = await expectSingle(
    supabase
      .from('quotes')
      .insert({
        client_name: quote.clientName,
        email: quote.email,
        phone: quote.phone || '',
        event_type: quote.eventType,
        guest_count: quote.guestCount,
        event_date: quote.eventDate || '',
        location: quote.location || '',
        budget: quote.budget || 0,
        notes: quote.notes || '',
        status: quote.status || 'review',
      })
      .select('*')
  );

  return mapQuoteRow(row);
}

async function countQuotes() {
  const supabase = getClient();
  return expectCount(supabase.from('quotes').select('id', { count: 'exact', head: true }));
}

async function countQuotesByStatus(status) {
  const supabase = getClient();
  return expectCount(
    supabase.from('quotes').select('id', { count: 'exact', head: true }).eq('status', status)
  );
}

async function seedMenuItems(items) {
  const supabase = getClient();
  const payload = items.map((item) => ({
    name: item.name,
    category: item.category,
    description: item.description,
    price: Number(item.price) || 0,
    status: item.status || 'available',
    image_url: item.imageUrl || '',
    created_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    updated_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
  }));

  await expectData(supabase.from('menu_items').insert(payload));
}

async function seedBookings(items) {
  const supabase = getClient();
  const payload = items.map((item) => ({
    reference: item.reference,
    client_name: item.clientName,
    email: item.email,
    phone: item.phone,
    event_type: item.eventType,
    package_name: item.packageName,
    event_date: item.eventDate,
    location: item.location,
    guest_count: Number(item.guestCount) || 0,
    serving_style: item.servingStyle,
    payment_option: item.paymentOption,
    special_requests: item.specialRequests || '',
    status: item.status || 'pending',
    notes: item.notes || '',
    created_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    updated_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
  }));

  await expectData(supabase.from('bookings').insert(payload));
}

async function seedPayments(items) {
  const supabase = getClient();
  const payload = items.map((item) => ({
    booking_reference: item.bookingReference,
    customer_name: item.customerName,
    phone: item.phone,
    amount: Number(item.amount) || 0,
    method: item.method || 'M-Pesa',
    status: item.status || 'completed',
    transaction_id: item.transactionId || '',
    paid_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    created_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    updated_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
  }));

  await expectData(supabase.from('payments').insert(payload));
}

module.exports = {
  countBookings,
  countBookingsCreatedSince,
  countBookingsNotCompleted,
  countMenuItems,
  countPayments,
  countQuotes,
  countQuotesByStatus,
  countUsers,
  createBooking,
  createMenuItem,
  createPayment,
  createQuote,
  createUser,
  deleteMenuItem,
  findBookingById,
  findBookingByReference,
  findMenuItemById,
  findUserByEmail,
  findUserById,
  listBookings,
  listMenuItems,
  listPayments,
  listQuotes,
  seedBookings,
  seedMenuItems,
  seedPayments,
  sumPaymentAmounts,
  updateBookingStatus,
  updateMenuItem,
  updateUser,
};
