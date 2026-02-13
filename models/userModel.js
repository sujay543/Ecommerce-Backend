const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
             required: [true,'username is required'],
        },
        email: {
            type: String,
            required: [true,'email is required'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail,'please provid a valid email']

        },
        photo: { 
            type: String,
             required: [true,'photo is required'],

        },
        password: {
            type: String,
             required: [true,'password is required'],
        }
    },
    {
        timestamps: true
    }
    
)

const User = mongoose.model('User',userSchema);

module.exports = User;