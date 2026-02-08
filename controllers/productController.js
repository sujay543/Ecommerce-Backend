const product = require('../models/productModel');

exports.getAllProducts = async (req,res) => 
{
    const products = await product.find();
    res.status(200).json(
        {
            status: 'success',
            size: products.length,
            data: {
                products
            }
        })
}

exports.getSpecificProducts = async (req,res) => 
{
    const products = await product.findById(req.params.id);;
    res.status(200).json(
        {
            status: 'success',
            size: products.length,
            data: {
                products
            }
        })
}
