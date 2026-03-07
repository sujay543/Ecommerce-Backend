const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');

exports.createOrder = async(req,res,next) => {
    const cart = await Cart.findOne({user: req.user.id});

    if(!cart || cart.items.length === 0)
    {  
        return next(new AppError('cart have not items',401));
    }
    // console.log(cart.items);
    const order = await Order.create(
        {
            user: req.user._id,
            OrderItems: cart.items,
            totalPrice: cart.totalPrice,
            shippingAddress: {
                address: req.body.shippingAddress.address,
                city: req.body.shippingAddress.city,
                postalCode: req.body.shippingAddress.postalCode,
                country: req.body.shippingAddress.country
            },
            orderStatus: req.body.orderStatus,
            paymentMethod: req.body.paymentMethod,
            deliveryDate: req.body.deliveryDate
        }
    )

    cart.items = [];
    await cart.save();
    res.json(
        {
            status: "success",
            order
        }
    )
}