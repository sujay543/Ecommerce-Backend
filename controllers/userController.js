const User = require('../models/userModel');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync');

function filterObject(object,...allowedfields){
    const newObj = {};
    Object.keys(object).forEach(el => {
        if(allowedfields.includes(el))
        {
            newObj[el] = object[el];
        }
    
    })
    return newObj;
}
exports.getUsers = catchAsync(async (req,res,next) => {
    const users = await User.find();
    if(users.length == 0){return next(new AppError('there is no user',404))}
    res.status(201).json(
        {
            status: "success",
            data: {
                users
            }
        }
    )
})

exports.getProfile = catchAsync(async (req,res,next) => {
    const user = await User.findById(req.user._id).select('-__v');
    if(!user){return next(new AppError('user not exist',404))}
    res.status(201).json(
        {
            status: "success",
            data: {
                user
            }
        }
    )
})

exports.updateProfile = catchAsync(async (req,res,next) => {
    const user = await User.findById(req.user._id);
    if(!user){return next(new AppError('user not exist',404))}
    if(req.body.password || req.body.confirmpassword){return next(new AppError('this is not the place to update password',403)); }
    const updateObject = filterObject(req.body,'username','email','photo');
    const updatedUser = await User.findByIdAndUpdate(req.user.id,updateObject,{
        runValidators: true,
        new: true
    })
    res.status(200).json(
        {
            status: "success",
            data: {
                updatedUser
            }
        }
    )
})

exports.deleteUser = catchAsync(async(req,res,next) => {
    const user = await User.findById(req.user.id);
    if(!user){return next(new AppError('user not found')); }
    if(req.user.id.toString() != req.params.id.toString())
    {
        return next(new AppError('You dont have the permission to perform this action',403));
    }
    user.active = false;
    await user.save({validateBeforeSave: false});
    res.status(200).json(
        {
            stuatus: 'success',
            message: 'user has been deleted'
        }
    )
})