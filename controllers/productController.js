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

   
    let productfind = product.find(queryString);
    
    //sorting
    if(req.query.sort)
    {
        const sortyBy = req.query.sort.split(',').join(' ');
        productfind = productfind.sort(sortyBy);
    }else{
        productfind = productfind.sort('-createdAt');
    }

    //limit
    if(req.query.fields)
    {
        const fields= req.query.fields.split(',').join(' ');
        productfind = productfind.select(fields);
    }else{
        productfind = productfind.select('-__v');
    }
    //paging
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 100;
    const skip = (page-1)*limit;

    productfind = productfind.skip(skip).limit(limit);

    if(req.query.page)
    {
        
        const noofproducts = await product.countDocuments();
        if(skip >= noofproducts)
        {
            throw new Error('This page does not exist');
        }
    }


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
