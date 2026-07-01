const getQuotes = (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'QT-1001',
        eventType: 'Wedding',
        guestCount: 250,
        status: 'review',
      },
    ],
  });
};

const createQuote = (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Quotation request received.',
    data: req.body,
  });
};

module.exports = {
  getQuotes,
  createQuote,
};
