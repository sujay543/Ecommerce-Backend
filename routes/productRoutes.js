const express = require('express');
const productControler = require('../controllers/productController');
const authControler = require('../controllers/authControl');
const productRouter = express.Router();

productRouter.route('/').get(authControler.protect,productControler.getAllProducts).post(authControler.protect,authControler.restrictTo('admin'),productControler.addProducts);
productRouter.route('/search').get(productControler.searchProduct);
productRouter.route('/:id').get(authControler.protect,productControler.getSpecificProducts).put(authControler.protect,productControler.updateProducts).delete(authControler.protect,authControler.restrictTo('admin'),productControler.deleteProduct);


module.exports = productRouter;
