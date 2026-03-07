const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema(
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

const OrderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        OrderItems: [ItemSchema],
        totalPrice: {
            type: Number,
            default: 0
        },
        shippingAddress: {
            address: {type: String,required: true},
            city: {type: String,required: true},
            postalCode: {type: String,required: true},
            country: {type: String,required: true}
        },
        orderStatus: {
            type: String,
            enum: ["pending","confirmed","shipped","delivered","cancelled"],
            default: "pending"
        },
        paymentMethod:{
            type: String,
            enum: ["COD","UPI","Card","NetBanking","Wallet"],
            required: true
        },
        deliveryDate: Date
    },{
        timestamps: true
    }
)

const Order = mongoose.model('Order',OrderSchema);
module.exports = Order;


OrderSchema.pre('save',function(){
    this.deliveryDate = Date.now() - 1000;
})