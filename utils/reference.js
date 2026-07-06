function buildBookingReference(timestamp = new Date()) {
  const dateStamp = `${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, '0')}${String(
    timestamp.getDate()
  ).padStart(2, '0')}`;

  return `FB-${dateStamp}-${String(timestamp.getTime()).slice(-3)}`;
}

module.exports = {
  buildBookingReference,
};
