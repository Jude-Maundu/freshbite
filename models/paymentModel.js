const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    bookingReference: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      default: 'M-Pesa',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    transactionId: {
      type: String,
      default: '',
      trim: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

module.exports = Payment;
