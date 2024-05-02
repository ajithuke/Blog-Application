const express = require('express')
const path = require('path')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middleware/authentication')
const Blog = require('./models/blog')

const app = express()
const port = 8000
mongoose.connect('mongodb://127.0.0.1:27017/blogApp').then(e => console.log('MongoDB connected'))

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public/images')))

app.get('/',async (req,res)=>{
    const allBlogs =await Blog.find({})
    res.render('home',{
        user: req.user,
        blogs: allBlogs
    })
})

app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(port,()=>{console.log(`server is running on port ${port}`)})