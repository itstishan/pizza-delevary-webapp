const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("Review", ReviewSchema)
