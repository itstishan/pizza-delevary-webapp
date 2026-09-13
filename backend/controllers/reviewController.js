const reviewController = require("express").Router()
const Review = require("../models/Review")

// list reviews for a product
reviewController.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 })
        return res.status(200).json(reviews)
    } catch (error) {
        console.error(error)
        return res.status(400).json({ msg: "Invalid product id" })
    }
})

// submit a review for a product
reviewController.post('/', async (req, res) => {
    try {
        const { productId, name, email, message } = req.body

        if (!productId || !name || !email || !message) {
            return res.status(400).json({ msg: "productId, name, email and message are required" })
        }

        const review = await Review.create({ productId, name, email, message })
        return res.status(201).json(review)
    } catch (error) {
        console.error(error)
        return res.status(400).json({ msg: error.message })
    }
})

module.exports = reviewController
