const express = require('express');
const productControler = require('../controllers/productController');
const tourRouter = express.Router();

tourRouter.route('/').get(productControler.getAllProducts).post(productControler.addProducts);
tourRouter.route('/:id').get(productControler.getSpecificProducts).put(productControler.updateProducts);

module.exports = tourRouter;
