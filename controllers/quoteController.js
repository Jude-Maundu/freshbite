const Quote = require('../models/quoteModel');

function serializeQuote(quote) {
  return {
    id: String(quote._id),
    clientName: quote.clientName,
    email: quote.email,
    phone: quote.phone,
    eventType: quote.eventType,
    guestCount: quote.guestCount,
    eventDate: quote.eventDate,
    location: quote.location,
    budget: quote.budget,
    notes: quote.notes,
    status: quote.status,
    createdAt:
      quote.createdAt instanceof Date
        ? quote.createdAt.toISOString().slice(0, 10)
        : String(quote.createdAt || '').slice(0, 10),
  };
}

async function getQuotes(req, res) {
  const quotes = await Quote.find().sort({ createdAt: -1, _id: -1 }).lean();

  res.json({
    success: true,
    data: quotes.map(serializeQuote),
  });
}

async function createQuote(req, res) {
  const quote = await Quote.create({
    clientName: req.body.clientName || 'Quote Request',
    email: req.body.email,
    phone: req.body.phone || '',
    eventType: req.body.eventType,
    guestCount: Number(req.body.guestCount) || 0,
    eventDate: req.body.eventDate || '',
    location: req.body.location || '',
    budget: Number(req.body.budget) || 0,
    notes: req.body.notes || '',
    status: 'review',
  });

  res.status(201).json({
    success: true,
    message: 'Quotation request received.',
    data: serializeQuote(quote),
  });
}

module.exports = {
  getQuotes,
  createQuote,
};
