const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
             minlength: 8
        },
        confirmpassword:{
           type: String,
           required: [true,'confirmpassword is required'],
           validate: {
            validator: function(el){
                return el === this.password
            },
            message: 'Password are not the same'
           }
              
        },
        role: {
            type: String,
            enum: ['admin','user'],
            default: 'user'      
        },
        passwordChangeAt: Date
    },
    {
        timestamps: true
    }
    
)

userSchema.pre('save',async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,12);
    this.confirmpassword = undefined;
})

userSchema.methods.checkpassword = async function(usergivepw,correctPassword)
{
    return await bcrypt.compare(usergivepw,correctPassword);
}

const User = mongoose.model('User',userSchema);

module.exports = User;