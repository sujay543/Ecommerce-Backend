const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('../utils/appError');
const { decode } = require('punycode');

const createToken = (userId) => 
{
    return jwt.sign({id: userId},process.env.JWT_SECRET_KEY,{expiresIn: process.env.JWT_EXPIRY_DATE})
}
exports.signUp = async (req,res,next) => {
    if(!req.body.password || !req.body.username || !req.body.email)
    {
        return next(new AppError('we need password, username and email for signup',404));

    }
    const newUser = await User.create(
        {
            username : req.body.username,
            email : req.body.email,
            photo: req.body.photo,
            passwordChangedAt: req.body.passwordChangedAt,
            password : req.body.password,
            confirmpassword  : req.body.confirmpassword,
            role: req.body.role
        }
    );

    const token = createToken(newUser._id);

    res.status(200).json(
        {
            status: 'success',
            token,
            data:{
                 newUser
            }
        }
    )
}

exports.logIn = async(req,res,next) => {
    if(!req.body.email || !req.body.password)
    {
        next(new AppError('You need email and password for login',400));
    }

    const user = await User.findOne({email: req.body.email}).select('+password');

    if(!user){ return next(new AppError('user not found',401)); }

    if(!(await user.checkpassword(req.body.password,user.password)))
    {
        return next(new AppError('password does not match',401));
    }
    const token = createToken(user._id);
    res.status(200).json(
        {
            status: 'success',
            token,
            message: 'user successfully loggedIn'
        }
    )
}

exports.protect = async(req,res,next) => {
    let token = "";
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
   
    if(!token)
    {
        return next(new AppError('The user must need login to access the product',401));
    }
     const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET_KEY);
    
    const user = await User.findById(decoded.id);
    if(await user.changePasswordAfter(decoded.iat))
    {
        return next(new AppError('You must login now',401));
    }

    req.user = user;
    next();
}

// exports.restrictTo = (req,res,next) =>{
//     if(req.user.role != "admin")
//     {
//         return next(new AppError('You are not allow to access this',401));
//     }
//     next();
// }

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role))
        {
            return next(new AppError('You are not allow to perform this action',401));
        }
        next();
    }
}


