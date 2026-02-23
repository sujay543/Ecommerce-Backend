const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.signUp = async (req,res,next) => {
    if(!req.body.password || !req.body.username || !req.body.email)
    {
        return new AppError('we need password, username and email for signup',404);

    }
    const newUser = await User.create(
        {
     username : req.body.username,
       email : req.body.email,
       password : req.body.password,
        confirmPassword  : req.body.confirmPassword
        },{
           new: true
        }
    );

    res.status(200).json(
        {
            status: 'success',
            data: newUser
        }
    )
}


