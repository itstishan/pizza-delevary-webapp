const uploadController = require('express').Router()
const multer = require('multer')
const path = require('path')
const {verifyTokenAdmin} = require('../middllewares/verifyToken')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        // never trust a client-supplied filename (path traversal risk) - slugify it into a safe prefix, then add a unique suffix
        const ext = path.extname(file.originalname || '').toLowerCase()
        const base = path.basename(file.originalname || '', ext)
        const slug = base
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 40) || 'image'
        const uniqueSuffix = `${Date.now().toString(36)}-${Math.round(Math.random() * 1e6).toString(36)}`
        const safeName = `${slug}-${uniqueSuffix}${ext}`
        cb(null, safeName)
    }
})

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_GALLERY_IMAGES = 5

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if(!ALLOWED_MIME_TYPES.includes(file.mimetype)){
            return cb(new Error('Only image files are allowed'))
        }
        cb(null, true)
    }
})

// single cover image
uploadController.post('/image', verifyTokenAdmin, upload.single('image'), (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({msg: "No image file received"})
        }
        return res.status(201).json({msg: "Successfully upload file!", filename: req.file.filename})

    }catch (error) {
        console.error(error.message)
        return res.status(500).json({msg: "Failed to upload file"})
    }
})

// multiple gallery images for a product's details page
uploadController.post('/images', verifyTokenAdmin, upload.array('images', MAX_GALLERY_IMAGES), (req, res) => {
    try {
        if(!req.files || req.files.length === 0){
            return res.status(400).json({msg: "No image files received"})
        }
        return res.status(201).json({
            msg: "Successfully uploaded files!",
            filenames: req.files.map((file) => file.filename)
        })

    }catch (error) {
        console.error(error.message)
        return res.status(500).json({msg: "Failed to upload files"})
    }
})

// multer errors (bad mime type, too large, too many files) need this 4-arg signature, and must come after every route it covers
uploadController.use((err, req, res, next) => {
    if(err){
        return res.status(400).json({msg: err.message})
    }
    next()
})

module.exports = uploadController
