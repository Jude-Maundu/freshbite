const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'featured', 'seasonal', 'out-of-stock'],
      default: 'available',
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
