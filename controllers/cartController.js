const Cart = require('../models/cartModel.js');
const User = require('../models/userModel.js');
const productModel = require('../models/productModel.js');
const AppError = require('../utils/appError');
const cart = require('../models/cartModel.js');

exports.addToCart = async(req,res,next) => {
    const user = await User.findById(req.user._id);
    if(!user){ return next(new AppError('User not found',404)); }
    const product = await productModel.findById(req.body.productId);
    if(!product){ return next(new AppError('Product not found',404)); }
    let cart = await Cart.findOne({user: req.user._id});
    if(!cart){
    cart = await Cart.create(
            {
                user: req.user._id,
                items: [],
                
            }
        )
    }
    let total = 0;

    cart.items.forEach(item => {
        total += item.price * item.quantity;
    });

    cart.totalPrice = total;
    const findIndex = await cart.items.findIndex(items => items.productId.toString() === product._id.toString());
    if(findIndex > -1)
    {
         cart.items[findIndex].quantity += req.body.quantity;
    }else{
        cart.items.push(
            {
                productId: req.body.productId,
                image: product.image,
                quantity: req.body.quantity,
                price: product.priceCents
            }
        )
    }

    await cart.save();

    res.json(cart);
}

exports.getCart = async(req,res,next) => {
    const cart = await Cart.find();
    res.json(
        cart
    )
}