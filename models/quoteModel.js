const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    eventDate: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    budget: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['review', 'quoted', 'accepted', 'declined'],
      default: 'review',
    },
  },
  {
    timestamps: true,
  }
);

const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);

module.exports = Quote;
