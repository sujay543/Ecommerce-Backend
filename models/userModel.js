const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

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
        passwordResetToken: {
        type: String
        },
        passwordResetExpires: Date,
        passwordChangedAt: Date
    },
    {
        timestamps: true
    }
    
)

userSchema.pre('save',function(){
    if(!this.isModified('password') || this.isNew) return;
    this.passwordChangedAt = Date.now() - 1000;
})

userSchema.pre('save',async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,12);
    this.confirmpassword = undefined;
})

userSchema.methods.checkpassword = async function(usergivepw,correctPassword)
{
    return await bcrypt.compare(usergivepw,correctPassword);
}

userSchema.methods.changePasswordAfter = async function(jwtTimeStamp) {
    // console.log(this.passwordChangedAt.getTime()/1000);
    // console.log(jwtTimeStamp);
    if(this.passwordChangedAt)
    {
        const changedTimestamp = this.passwordChangedAt.getTime()/1000;
        return changedTimestamp > jwtTimeStamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    // 1. Generate random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash it before saving to DB (security)
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 3. Set expiry (10 min)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken; // send this to user
};

const User = mongoose.model('User',userSchema);

module.exports = User;