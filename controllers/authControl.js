const User = require('../models/userModel');

exports.signUp = async (req,res,next) => {
    const newUser = await User.create(req.body);
    console.log(newUser);
    res.status(200).json(
        {
            status: 'success',
            user: newUser
        }
    )
}


