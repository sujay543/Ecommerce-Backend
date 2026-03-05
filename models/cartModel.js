const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        image: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        }
    }
)

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId
        },
        items: [cartItemSchema],
        totalPrice: {
            type: Number,
            default: 0
        }
    }
)

const cart = mongoose.model('Cart',cartSchema);

module.exports = cart;