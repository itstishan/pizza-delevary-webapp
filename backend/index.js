const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config({ quiet: true }) // suppress dotenv's console startup tips
const mongoose = require("mongoose")
const authController = require('./controllers/authController')
const productController = require('./controllers/productController')
const uploadController = require('./controllers/uploadController')
const orderController = require('./controllers/orderController')
const contactController = require('./controllers/contactController')
const reviewController = require('./controllers/reviewController')
const app = express()

//connect database
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('DataBase is successfully connected!'))
  .catch((err) => {
    // the old callback form never got the error, so a failed connection still logged "successfully connected"
    console.error('Failed to connect to the database:', err.message)
    process.exit(1)
  })

//routes & middlewares
//those two middlewares make req.body accessible, otherwise it would be undefined!!!
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/images', express.static('public/images'))
app.use('/auth', authController)
app.use('/product', productController)
app.use('/upload', uploadController)
app.use('/order', orderController)
app.use('/contact', contactController)
app.use('/review', reviewController)

//start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server has been started successfully on port ${PORT}!`))

//server is on port 5000, client is on port 3000, we are going to get a cros ERROR!!, but cors() remove that's error
