const express = require('express');
const authController = require('../controllers/authControl');
const orderController = require('../controllers/orderController');
const OrderRouter = express.Router();

OrderRouter.route('/').get(authController.protect,authController.restrictTo('admin'),orderController.getAllOrder);
OrderRouter.route('/Create').post(authController.protect,orderController.createOrder);
OrderRouter.route('/my-Orders').get(authController.protect,orderController.myOrders);
OrderRouter.route('/:id').get(authController.protect,orderController.getOrder).delete(authController.protect,orderController.deleteOrder);
OrderRouter.route('/:id/status').get(authController.protect,orderController.getStatus).patch(authController.protect,authController.restrictTo('admin'),orderController.updateStatus);
module.exports = OrderRouter;