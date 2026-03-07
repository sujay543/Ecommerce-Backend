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

exports.myOrders = async(req,res,next) => {
    const orders = await Order.find({user: req.user._id});
    if(orders.length === 0){return next(new AppError('No order found',404)); }
    res.status(200).json(
        {
            status: 'success',
            result: orders.length,
            orders
        }
    )
}

exports.getOrder = async(req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new AppError('order not found',404));
    }
    if(order.user.toString() != req.user._id){
        return next(new AppError('Not authorized',403));
    }
    res.status(201).json(
        {
            status:'success',
            order
        }
    )
}

exports.getStatus = async(req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new AppError('order not found',404));
    }
    if(order.user.toString() != req.user._id){
        return next(new AppError('Not authorized',403));
    }
    // console.log(order.orderStatus)
     res.status(200).json(
        {
            status:'success',
            orderStatus: order.orderStatus
        }
    )
}

exports.updateStatus = async(req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new AppError('order not found',404));
    }
    if(order.user.toString() != req.user._id){
        return next(new AppError('Not authorized',403));
    }

    if(!req.body.status){return next(new AppError('status canont be empty',400)); }
    const allowedStatus = ['pending','processing','shipped','delivered','cancelled'];

    if(!allowedStatus.includes(req.body.status)){
        return next(new AppError('Invalid order status',400));
    }
    order.orderStatus = req.body.status;
    await order.save();
    // console.log(order.orderStatus)
     res.status(200).json(
        {
            status:'success',
            order
        }
    )
}

exports.deleteOrder = async(req,res,next) => {
   const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new AppError('order not found',404));
    }
    if(order.user.toString() != req.user._id){
        return next(new AppError('Not authorized',403));
    }
    order.orderStatus = "cancelled";
    await order.save();
    // console.log(order.orderStatus)
     res.status(200).json(
        {
            status:'success',
            message: 'order has been cancelled',
            order
        }
    )
}

exports.getAllOrder  = async(req,res,next) => {
   const orders = await Order.find();
   if(orders.length == 0){return next(new AppError('There is no orders',404))};
   res.status(200).json(
    {
        status: 'success',
        result: orders.length,
        orders
    }
   )
}