const Cart = require('../models/cartModel.js');
const User = require('../models/userModel.js');
const productModel = require('../models/productModel.js');
const AppError = require('../utils/appError');
const cart = require('../models/cartModel.js');

exports.addToCart = async(req,res,next) => {
    console.log(req.user.id);
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
     let total = 0;

    cart.items.forEach(item => {
        total += item.price * item.quantity;
    });
    cart.totalPrice = total;
    await cart.save();

    res.json(cart);
}

exports.getCart = async(req,res,next) => {
    const cart = await Cart.findOne({user: req.user._id});
    if(!cart)
    {
       return res.status(200).json(
        {
            status: 'success',
            cart: []
        }
       )
    }
    res.json({
        status: 'success',
        cart
        })
}

exports.updateCart = async(req,res,next) => {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if(!cart){return next(new AppError('cart not found',404)); }
     const findIndex = cart.items.findIndex(items => items.productId.toString() === req.params.id);
     if(findIndex === -1){ return next(new AppError('product not found',404)); }
     cart.items[findIndex].quantity = req.body.quantity;
     await cart.save();
     res.json(
        cart
     );
}

exports.deleteProduct = async(req,res,next) => {
    console.log(req.user.id);
    const cart = await Cart.findOne({user: req.user.id});
    if(!cart){return next(new AppError('cart not found',404)); }
    const findIndex = cart.items.findIndex(items => items.productId.toString() === req.params.id);
    if(findIndex === -1){ return next(new AppError('product not found',404)); }
    cart.items.splice(findIndex,1);
    await cart.save();
    res.json(
        {
            status: 'success',
            message: 'product has been removed'
        }
    )
}

exports.deleteCart = async(req,res,next) => {
    const cart = await Cart.findOne({user: req.user._id});
    if(!cart){return next(new AppError('cart not found',404)); }
    cart.items = [];
    cart.totalPrice = 0; 
    await cart.save();
    res.status(200).json(
        {
            status: 'success',
            message: 'cart has been deleted'
        }
    )
}