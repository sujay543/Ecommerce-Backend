const product = require('../models/productModel');

exports.getAllProducts = async (req,res) => 
{
    //build the query
    const queryObj = {...req.query}; //spread operator;
    const excludedFields = ['sort','limit','page','fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g,match => `$${match}`);
    queryString = JSON.parse(queryString);
    const productfind = product.find(queryString);
    
    const products = await productfind;
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
    const products = await product.findById(req.params.id);
    if(!products)
    {
        res.status(404).json(
            {
                 status: 'Fail',
                 message: 'product not found'
            }
        )
    }
    res.status(200).json(
        {
            status: 'success',
            size: products.length,
            data: {
                products
            }
        })
}

exports.addProducts = async (req,res) => 
{
    const newdata =  await product.create(req.body);
    try
    {
        res.status(201).json(
        {
            status: 'success',
            message: 'data created successfully',
            data: newdata
        }
    )
    }catch(err)
    {
        console.log(err);
    }   
}

exports.updateProducts = async (req,res) => 
{     
    const updatedProduct = await product.findByIdAndUpdate(req.params.id,req.body,
        {
            new: true,
            runValidaors: true
        }
    )

    if(!updatedProduct)
    {
        res.status(404).json(
            {
                 status: 'Fail',
                 message: 'product not found'
            }
        )
    }

    res.status(200).json(
        {
            status: 'success',
            message: 'product has been updated',
            data: updatedProduct
        }
    )

}

exports.deleteProduct = async (req,res) => 
{
    const deleteProduct = await product.findByIdAndDelete(req.params.id);
    if(!deleteProduct)
    {
        res.status(404).json(
            {
                 status: 'Fail',
                 message: 'product not found'
            }
        )
    }

    res.status(200).send('success');
}
