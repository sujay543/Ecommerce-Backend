const express = require('express');
const Cart = require('../models/cartModel');
const CartRouter = express.Router();
const authController = require('../controllers/authControl');
const cartController = require('../controllers/cartController');

CartRouter.route('/').get(authController.protect,authController.protect,cartController.getCart);
CartRouter.route('/addToCart').post(authController.protect,cartController.addToCart);
CartRouter.route('/:id').patch(authController.protect,cartController.updateCart);
CartRouter.route('/remove/:id').delete(authController.protect,cartController.deleteProduct);
CartRouter.route('/clear').delete(authController.protect,cartController.deleteCart);

module.exports = CartRouter;

