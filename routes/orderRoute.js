const express = require('express');
const authController = require('../controllers/authControl');
const orderController = require('../controllers/orderController');
const OrderRouter = express.Router();

OrderRouter.route('/Create').post(authController.protect,orderController.createOrder);

module.exports = OrderRouter;