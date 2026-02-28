const express = require('express');
const productControler = require('../controllers/productController');
const authControler = require('../controllers/authControl');
const productRouter = express.Router();

productRouter.route('/').get(authControler.protect,productControler.getAllProducts).post(productControler.addProducts);
productRouter.route('/search').get(productControler.searchProduct);
productRouter.route('/:id').get(productControler.getSpecificProducts).put(productControler.updateProducts).delete(productControler.deleteProduct);


module.exports = productRouter;
