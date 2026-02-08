const express = require('express');
const productControler = require('../controllers/productController');
const tourRouter = express.Router();

tourRouter.route('/').get(productControler.getAllProducts);
tourRouter.route('/:id').get(productControler.getSpecificProducts);

module.exports = tourRouter;
