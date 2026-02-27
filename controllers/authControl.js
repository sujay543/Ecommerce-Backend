const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

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


