const express = require('express');
const authController = require('../controllers/authControl');
const orderController = require('../controllers/orderController');
const OrderRouter = express.Router();

OrderRouter.route('/Create').post(authController.protect,orderController.createOrder);
OrderRouter.route('/my-Orders').get(authController.protect,orderController.myOrders);
OrderRouter.route('/:id').get(authController.protect,orderController.getOrder);
OrderRouter.route('/:id/status').get(authController.protect,orderController.getStatus);
module.exports = OrderRouter;