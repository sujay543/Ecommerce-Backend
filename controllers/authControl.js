const User = require('../models/userModel');
const AppError = require('../utils/appError');

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

    res.status(200).json(
        {
            status: 'success',
            data: newUser
        }
    )
}


