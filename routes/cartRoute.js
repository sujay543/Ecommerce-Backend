const express = require('express');
const Cart = require('../models/cartModel');
const CartRouter = express.Router();
const authController = require('../controllers/authControl');
const cartController = require('../controllers/cartController');

CartRouter.route('/').get(authController.protect,cartController.getCart);
CartRouter.route('/addToCart').post(authController.protect,cartController.addToCart);

module.exports = CartRouter;

