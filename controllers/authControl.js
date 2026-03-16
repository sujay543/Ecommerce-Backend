const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('../utils/appError');
const { decode } = require('punycode');
const sendMail = require('../utils/mail');
const crypto = require('crypto');


const createSendToken = (user,statusCode, res) => 
{
    const token = jwt.sign({id: user._id},process.env.JWT_SECRET_KEY,{expiresIn: process.env.JWT_EXPIRY_DATE});
    res.cookie('jwt',token,{
       expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        });
    res.status(statusCode).json(
        {
            status: 'success',
            token,
            data:{
                 user
            }
        }
    )
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
    createSendToken(newUser,200,res);
    
}

exports.logIn = async(req,res,next) => {
    if(!req.body.email || !req.body.password)
    {
        return next(new AppError('You need email and password for login',400));
    }

    const user = await User.findOne({email: req.body.email}).select('+password');

    if(!user){ return next(new AppError('user not found',401)); }

    if(!(await user.checkpassword(req.body.password,user.password)))
    {
        return next(new AppError('password does not match',401));
    }
    createSendToken(user,200,res);
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

exports.forgotPassword = async (req,res,next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user)
    {
        return next(new AppError("user not found",404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
     const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and
    passwordConfirm to: ${resetUrl}.\n If you did not forgot your password please ignore this email`

     try{
        // to: options.email,
        //     subject: options.subject,
        //     text: options.text

    await sendMail(
    {
        email: user.email,
        subject: 'Your password reset token (Valid for 10 min)',
        text: message
    })


    res.status(200).json(
        {
            status: 'success',
            message: 'Token sent to email'
        })
    }catch(err)
    {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.save();
        console.log(err);
        return next(new AppError('There was an error sending the email. Try again later!',500));

    }
};

exports.resetPassword = async(req,res,next) => {
    const hashedtoken =  crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({passwordResetToken: hashedtoken, passwordResetExpires: {$gt: Date.now()}});

    if(!user){return next(new AppError('Invalid token',404));}

    user.password = req.body.password;
    user.confirmpassword = req.body.confirmpassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    res.status(200).json(
        {
            status: 'success',
            message: "password changed successfully"
        }
    )
}

exports.updatePassword = async(req,res,next) => {
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.checkpassword(req.body.Oldpassword,user.password);
    if(!isMatch){return next(new AppError('user does not match',401)); }
    const oldOne = await user.checkpassword(req.body.newpassword,user.password);
    if(oldOne){return next(new AppError('old password can be used',401)); }
    user.password = req.body.newpassword;
    user.confirmpassword = req.body.confirmpassword;
    await user.save();
    const token = createToken(user._id);
    res.status(200).json(
        {
            status: "success",
            message: "password has been updated",
            token
        }
    )
}   


