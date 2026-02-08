const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
       
  name: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    type: String,   // image URL or path
    required: true
  },

  priceCents: {
    type: Number,
    required: true,
    min: 0
  },

  rating: {
    stars: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },

  keywords: [
    {
      type: String
    }
  ]

}, {
  timestamps: true
})

const product = mongoose.model('product',productSchema);

module.exports = product;