const User = require('../models/userModel');

exports.getUsers = async (req,res,next) => {
    const users = await User.find();

    res.status(201).json(
        {
            status: "success",
            data: {
                users
            }
        }
    )
}