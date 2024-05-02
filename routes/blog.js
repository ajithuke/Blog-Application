const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const Blog = require('../models/blog.js')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/images/uploads'))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
})
  
const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    res.render('addBlog',{
        user:req.user
    })
})

router.post('/',upload.single('coverImage'),async (req,res)=>{
    const { title,body } = req.body
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })
    res.redirect(`/blog/${blog._id}`)
})

router.get('/:id',async (req,res)=>{
    const blog = await Blog.findById(req.params.id)
    res.render('blog',{
        user:req.user,
        blog
    })
})

module.exports = router