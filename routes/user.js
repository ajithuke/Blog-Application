const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.get('/signin',(req,res)=>{
    res.render('signin')
})

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.post('/signin',async (req,res)=>{
    const { email,password } = req.body
    try{
        const token = await User.matchPasswordANdGenerateToken(email,password)
        res.cookie('token',token).redirect('/')
    }
    catch(error){
        res.render('signin',{
            error:"Incorrect Email or Password"
        })
    }
})

router.post('/signup',async (req,res)=>{
    const { username,email,password } = req.body
    await User.create({
        username,
        email,
        password,
    })
    res.redirect('/')
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})

module.exports = router