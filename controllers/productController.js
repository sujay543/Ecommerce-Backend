const product = require('../models/productModel');
const AppError = require('../utils/appError');




const catchAsync = fn => {
    return (req,res,next)=>{
         fn(req,res,next).catch(err => next(err));
    }
   
}
exports.getAllProducts = catchAsync(async (req,res,next) => 
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
            return next(new AppError('This page does not exist', 404));
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
})

exports.getSpecificProducts = catchAsync(async (req,res,next) => 
{
    const products = await product.findById(req.params.id);
    if(!products)
    {
       return next(new AppError('Product not found', 404));
    }
    res.status(200).json(
        {
            status: 'success',
            data: {
               product: products
            }
        })
})

exports.addProducts = catchAsync(async (req,res,next) => 
{
    const newdata =  await product.create(req.body);
        res.status(201).json(
        {
            status: 'success',
            message: 'data created successfully',
            data: newdata
        })
    
})

exports.updateProducts = catchAsync(async (req,res,next) => 
{     
    const updatedProduct = await product.findByIdAndUpdate(req.params.id,req.body,
        {
            new: true,
            runValidators: true
        }
    )
     if(!updatedProduct)
    {
       return next(new AppError('Product not found', 404));
    }


    res.status(200).json(
        {
            status: 'success',
            message: 'product has been updated',
            data: updatedProduct
        }
    )

})

exports.deleteProduct = catchAsync(async (req,res,next) => 
{
    const deleteProduct = await product.findByIdAndDelete(req.params.id);
    if(!deleteProduct)
    {
        return next(new AppError('Product not found', 404));
    }

    res.status(200).send('success');
});

exports.searchProduct = catchAsync(async (req,res,next) => 
{
   const keyword = req.query.q;
   if(!keyword)
   {
     return next(new AppError('Please provide search keyword', 400));
   }

   const findproduct = await product.find({name: {$regex: keyword, $options: 'i'}});
   console.log(findproduct);
    if(findproduct.length == 0)
    {
        return next(new AppError('Product not found', 404));
    }
    
   res.status(200).json(
    {
        status: 'success',
        data: 
        {
            product: findproduct
        }
    }
   )
})