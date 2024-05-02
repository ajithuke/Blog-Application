const mongoose = require('mongoose')
const { createHmac,randomBytes } = require('node:crypto');
const { createTokenForUser,validateToken } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    profileImageURL:{
        type:String,
        default:'/userProfile.png'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    }

},{ timestamps:true })

userSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified("password"))
        return;

    const salt = randomBytes(16).toString()                 // secret key
    const hashedPass = createHmac('sha256',salt)
                        .update(user.password)
                        .digest('hex')

    this.salt = salt
    this.password = hashedPass
    next()
})

userSchema.static('matchPasswordANdGenerateToken',async function (email,password){
    const user = await this.findOne({email})
    if(!user)
        throw new Error("user not found")

    const salt = user.salt
    const hashedPass = user.password

    const userProvidedHash = createHmac('sha256',salt)
                                .update(password)
                                .digest('hex')

    if(hashedPass !== userProvidedHash)
        throw new Error("Incorrect password")

    const token = createTokenForUser(user)
    return token
})

const User = mongoose.model('user',userSchema)

module.exports = User